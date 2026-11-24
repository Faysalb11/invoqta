
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from pathlib import Path
import uuid
from fastapi.middleware.cors import CORSMiddleware
from pdf_generator import generate_invoice_pdf

app = FastAPI(
    title="Invoora API",
    description="Backend API for Invoora",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WorkItem(BaseModel):
    description: str
    rate: float
    hours: float


class Invoice(BaseModel):
    business_name: str
    business_email: str
    client_name: str
    client_email: str
    invoice_number: str
    issue_date: str
    due_date: str
    currency: str
    items: List[WorkItem]
    notes: str = ""


@app.get("/")
def home():
    return {
        "message": "Welcome to Invoora API!",
        "status": "running"
    }


@app.post("/generate-invoice")
def create_invoice(invoice: Invoice):

    invoice_data = invoice.model_dump()

    output_folder = Path("generated_invoices")
    output_folder.mkdir(exist_ok=True)

    filename = f"invoice_{uuid.uuid4().hex}.pdf"
    output_path = output_folder / filename

    generate_invoice_pdf(invoice_data, str(output_path))

    return FileResponse(
        path=str(output_path),
        media_type="application/pdf",
        filename="Invoora_Invoice.pdf"
    )
