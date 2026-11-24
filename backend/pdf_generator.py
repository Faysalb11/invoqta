
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib.enums import TA_RIGHT


def safe_text(value):
    """Escape user-provided text before inserting it into PDF paragraphs."""
    return escape(str(value if value is not None else ""))


def generate_invoice_pdf(data, output_path):

    navy = colors.HexColor("#172B3A")
    cobalt = colors.HexColor("#2855D9")
    light_grey = colors.HexColor("#F5F7FA")

    document = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )

    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name="InvoiceTitle",
        parent=styles["Title"],
        textColor=navy,
        fontSize=26,
        alignment=TA_RIGHT,
    ))

    styles.add(ParagraphStyle(
        name="SmallText",
        parent=styles["Normal"],
        fontSize=9,
        textColor=colors.HexColor("#64748B"),
    ))

    story = []

    # Header
    header = Table([
        [
            Paragraph("<b>INVOQTA</b>", styles["Heading1"]),
            Paragraph("INVOICE", styles["InvoiceTitle"]),
        ]
    ], colWidths=[85 * mm, 90 * mm])

    header.setStyle(TableStyle([
        ("TEXTCOLOR", (0, 0), (0, 0), cobalt),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (1, 0), (1, 0), "RIGHT"),
    ]))

    story.append(header)
    story.append(Spacer(1, 12 * mm))

    # Freelancer and client details
    details = [
        [
            Paragraph("<b>FROM</b>", styles["Normal"]),
            Paragraph("<b>BILL TO</b>", styles["Normal"]),
        ],
        [
            Paragraph(
                f"{safe_text(data['business_name'])}<br/>"
                f"{safe_text(data['business_email'])}",
                styles["Normal"],
            ),
            Paragraph(
                f"{safe_text(data['client_name'])}<br/>"
                f"{safe_text(data['client_email'])}",
                styles["Normal"],
            ),
        ],
    ]

    details_table = Table(
        details,
        colWidths=[87.5 * mm, 87.5 * mm],
    )

    details_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))

    story.append(details_table)
    story.append(Spacer(1, 10 * mm))

    # Invoice information
    story.append(Paragraph(
        f"<b>Invoice:</b> {safe_text(data['invoice_number'])}<br/>"
        f"<b>Issue date:</b> {safe_text(data['issue_date'])}<br/>"
        f"<b>Due date:</b> {safe_text(data['due_date'])}",
        styles["Normal"],
    ))

    story.append(Spacer(1, 10 * mm))

    # Work items
    currency = data.get("currency", "USD")

    table_data = [
        ["WORK DESCRIPTION", "RATE", "HOURS", "AMOUNT"]
    ]

    total = 0

    for item in data["items"]:
        rate = float(item["rate"])
        hours = float(item["hours"])
        amount = rate * hours
        total += amount

        table_data.append([
            Paragraph(
                safe_text(item["description"]),
                styles["Normal"],
            ),
            f"{currency} {rate:,.2f}",
            f"{hours:g}",
            f"{currency} {amount:,.2f}",
        ])

    work_table = Table(
        table_data,
        colWidths=[75 * mm, 32 * mm, 25 * mm, 43 * mm],
    )

    work_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), navy),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [
            colors.white, light_grey
        ]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#E2E8F0")),
        ("ALIGN", (1, 1), (-1, -1), "RIGHT"),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))

    story.append(work_table)
    story.append(Spacer(1, 8 * mm))

    # Total
    total_table = Table([
        ["SUBTOTAL", f"{currency} {total:,.2f}"],
        ["TOTAL", f"{currency} {total:,.2f}"],
    ], colWidths=[130 * mm, 45 * mm])

    total_table.setStyle(TableStyle([
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 11),
        ("TEXTCOLOR", (0, 1), (-1, 1), cobalt),
        ("LINEABOVE", (0, 1), (-1, 1), 1, cobalt),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
    ]))

    story.append(total_table)

    # Notes
    if data.get("notes"):
        story.append(Spacer(1, 12 * mm))
        story.append(Paragraph(
            "<b>NOTES</b>",
            styles["Normal"],
        ))
        story.append(Paragraph(
            safe_text(data["notes"]),
            styles["SmallText"],
        ))

    document.build(story)
