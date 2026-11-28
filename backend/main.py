
import os
import json
import logging
import tempfile
from io import BytesIO
from typing import List

from fastapi import (
    FastAPI,
    HTTPException,
    Request,
    UploadFile,
    File,
    Form,
)
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict, ValidationError
from starlette.background import BackgroundTask
from PIL import Image as PILImage

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from pdf_generator import generate_invoice_pdf


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Invoqta API",
    description="Secure PDF invoice generation API for Invoqta.",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://invoqta.vercel.app",
    "https://invoqta-app.vercel.app",
]

frontend_url = os.getenv("FRONTEND_URL", "").strip()

if frontend_url:
    allowed_origins.extend(
        origin.strip()
        for origin in frontend_url.split(",")
        if origin.strip()
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class WorkItem(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    description: str = Field(min_length=1, max_length=300)
    rate: float = Field(ge=0, le=1_000_000, allow_inf_nan=False)
    hours: float = Field(ge=0, le=1_000_000, allow_inf_nan=False)


class Invoice(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    business_name: str = Field(min_length=1, max_length=100)
    business_email: str = Field(min_length=1, max_length=254)
    client_name: str = Field(min_length=1, max_length=100)
    client_email: str = Field(min_length=1, max_length=254)
    invoice_number: str = Field(min_length=1, max_length=50)
    issue_date: str = Field(min_length=1, max_length=20)
    due_date: str = Field(min_length=1, max_length=20)
    currency: str = Field(
        min_length=1,
        max_length=8,
        pattern=r"^[A-Za-z$€£¥₹.]{1,8}$",
    )
    items: List[WorkItem] = Field(min_length=1, max_length=50)
    notes: str = Field(default="", max_length=2000)


@app.get("/")
def home():
    return {
        "message": "Welcome to Invoqta API!",
        "status": "running",
    }


@app.post("/generate-invoice")
@limiter.limit("5/minute")
def create_invoice(
    request: Request,
    invoice_data: str = Form(...),
    logo: UploadFile | None = File(default=None),
):
    output_path = None
    logo_path = None

    try:
        try:
            invoice_dict = json.loads(invoice_data)
            invoice = Invoice.model_validate(invoice_dict)
        except (json.JSONDecodeError, ValidationError, TypeError):
            raise HTTPException(
                status_code=422,
                detail="Invalid invoice data. Check all required fields.",
            )

        validated_data = invoice.model_dump()

        if logo and logo.filename:
            if logo.content_type not in ("image/png", "image/jpeg"):
                raise HTTPException(
                    status_code=400,
                    detail="Only PNG and JPG logos are allowed.",
                )

            logo_bytes = logo.file.read(2 * 1024 * 1024 + 1)

            if len(logo_bytes) > 2 * 1024 * 1024:
                raise HTTPException(
                    status_code=400,
                    detail="Logo must be smaller than 2 MB.",
                )

            try:
                image = PILImage.open(BytesIO(logo_bytes))
                image_format = image.format
                image.verify()

                if image_format not in ("PNG", "JPEG"):
                    raise ValueError("Unsupported image format.")

            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid logo image.",
                )

            descriptor, logo_path = tempfile.mkstemp(
                prefix="invoqta_logo_",
                suffix=".png" if image_format == "PNG" else ".jpg",
            )

            with os.fdopen(descriptor, "wb") as logo_file:
                logo_file.write(logo_bytes)

            validated_data["logo_path"] = logo_path

        descriptor, output_path = tempfile.mkstemp(
            prefix="invoqta_",
            suffix=".pdf",
        )
        os.close(descriptor)

        generate_invoice_pdf(validated_data, output_path)

        return FileResponse(
            path=output_path,
            media_type="application/pdf",
            filename="Invoqta_Invoice.pdf",
            background=BackgroundTask(cleanup_files, output_path, logo_path),
        )

    except HTTPException:
        cleanup_files(output_path, logo_path)
        raise

    except Exception:
        cleanup_files(output_path, logo_path)
        logger.exception("Invoice PDF generation failed")
        raise HTTPException(
            status_code=500,
            detail="Unable to generate invoice PDF. Please try again.",
        )


def cleanup_files(output_path, logo_path):
    for path in (output_path, logo_path):
        if path and os.path.exists(path):
            try:
                os.unlink(path)
            except OSError:
                logger.exception("Could not remove temporary file: %s", path)
