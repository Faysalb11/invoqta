
import logging
import os
import tempfile

from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from starlette.background import BackgroundTask

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from pdf_generator import generate_invoice_pdf


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Rate limiting
limiter = Limiter(key_func=get_remote_address)


# FastAPI application
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


# CORS configuration
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

frontend_url = os.getenv("FRONTEND_URL", "").strip()

if frontend_url:
    allowed_origins.extend(
        origin.strip()
        for origin in frontend_url.split(",")
        if origin.strip()
    )

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
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

# Work item validation
class WorkItem(BaseModel):

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    description: str = Field(
        min_length=1,
        max_length=300,
    )

    rate: float = Field(
        ge=0,
        le=1_000_000,
        allow_inf_nan=False,
    )

    hours: float = Field(
        ge=0,
        le=1_000_000,
        allow_inf_nan=False,
    )


# Invoice validation
class Invoice(BaseModel):

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

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

    items: List[WorkItem] = Field(
        min_length=1,
        max_length=50,
    )

    notes: str = Field(
        default="",
        max_length=2000,
    )


# Home endpoint
@app.get("/")
def home():

    return {
        "message": "Welcome to Invoqta API!",
        "status": "running",
    }


# Generate invoice PDF
@app.post("/generate-invoice")
@limiter.limit("5/minute")
def create_invoice(request: Request, invoice: Invoice):

    invoice_data = invoice.model_dump()

    # Create a temporary PDF file
    file_descriptor, output_path = tempfile.mkstemp(
        prefix="invoqta_",
        suffix=".pdf",
    )

    os.close(file_descriptor)

    try:

        generate_invoice_pdf(
            invoice_data,
            output_path,
        )

        return FileResponse(
            path=output_path,
            media_type="application/pdf",
            filename="Invoqta_Invoice.pdf",
            background=BackgroundTask(
                os.unlink,
                output_path,
            ),
        )

    except Exception:

        # Remove incomplete PDF if generation fails
        if os.path.exists(output_path):
            os.unlink(output_path)

        logger.exception("Invoice PDF generation failed")

        raise HTTPException(
            status_code=500,
            detail="Unable to generate invoice PDF. Please try again.",
        )
