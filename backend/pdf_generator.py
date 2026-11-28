
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle,
)
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


def safe_text(value):
    """Escape user-provided text before inserting it into PDF paragraphs."""
    return escape(str(value if value is not None else ""))


def get_template_colors(template):
    """Return the colors used by the selected invoice template."""

    templates = {
        "modern": {
            "primary": colors.HexColor("#173B5E"),
            "accent": colors.HexColor("#2855D9"),
            "light": colors.HexColor("#EAF4FC"),
            "row": colors.HexColor("#F5F8FB"),
            "text": colors.HexColor("#334155"),
            "muted": colors.HexColor("#64748B"),
            "grid": colors.HexColor("#DCE7EF"),
        },
        "minimal": {
            "primary": colors.HexColor("#252525"),
            "accent": colors.HexColor("#444444"),
            "light": colors.HexColor("#F3F3F3"),
            "row": colors.white,
            "text": colors.HexColor("#333333"),
            "muted": colors.HexColor("#777777"),
            "grid": colors.HexColor("#DDDDDD"),
        },
        "creative": {
            "primary": colors.HexColor("#B94F40"),
            "accent": colors.HexColor("#E97863"),
            "light": colors.HexColor("#FCEDE9"),
            "row": colors.HexColor("#FFF8F6"),
            "text": colors.HexColor("#493B39"),
            "muted": colors.HexColor("#927B76"),
            "grid": colors.HexColor("#F0DAD5"),
        },
    }

    return templates.get(template, templates["modern"])


def generate_invoice_pdf(data, output_path):

    template = data.get("template", "modern")
    theme = get_template_colors(template)

    primary = theme["primary"]
    accent = theme["accent"]
    light = theme["light"]
    row_color = theme["row"]
    text_color = theme["text"]
    muted = theme["muted"]
    grid_color = theme["grid"]

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
        textColor=primary,
        fontSize=26 if template != "minimal" else 23,
        alignment=TA_RIGHT,
        spaceAfter=0,
    ))

    styles.add(ParagraphStyle(
        name="SmallText",
        parent=styles["Normal"],
        fontSize=9,
        leading=13,
        textColor=muted,
    ))

    styles.add(ParagraphStyle(
        name="SectionHeading",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        textColor=accent,
        spaceAfter=5,
    ))

    styles.add(ParagraphStyle(
        name="BodyTextCustom",
        parent=styles["Normal"],
        fontSize=9,
        leading=14,
        textColor=text_color,
    ))

    story = []

    # Header and optional logo
    logo_path = data.get("logo_path")

    if logo_path:
        brand_content = Image(
            logo_path,
            width=35 * mm,
            height=20 * mm,
            kind="proportional",
        )
        brand_content.hAlign = "LEFT"
    else:
        brand_content = Paragraph(
            f'<font color="{primary.hexval()}"><b>INVOQTA</b></font>',
            styles["Heading1"],
        )

    header = Table(
        [[
            brand_content,
            Paragraph("INVOICE", styles["InvoiceTitle"]),
        ]],
        colWidths=[85 * mm, 90 * mm],
    )

    header_style = [
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (1, 0), (1, 0), "RIGHT"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]

    if template == "modern":
        header_style.append(
            ("LINEBELOW", (0, 0), (-1, -1), 2, accent)
        )

    elif template == "creative":
        header_style.extend([
            ("BACKGROUND", (0, 0), (-1, -1), light),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
            ("TOPPADDING", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ])

    else:
        header_style.append(
            ("LINEBELOW", (0, 0), (-1, -1), 0.8, primary)
        )

    header.setStyle(TableStyle(header_style))

    story.append(header)
    story.append(Spacer(1, 12 * mm))

    # Freelancer and client details
    details = [
        [
            Paragraph("<b>FROM</b>", styles["SectionHeading"]),
            Paragraph("<b>BILL TO</b>", styles["SectionHeading"]),
        ],
        [
            Paragraph(
                f"<b>{safe_text(data['business_name'])}</b><br/>"
                f"{safe_text(data['business_email'])}",
                styles["BodyTextCustom"],
            ),
            Paragraph(
                f"<b>{safe_text(data['client_name'])}</b><br/>"
                f"{safe_text(data['client_email'])}",
                styles["BodyTextCustom"],
            ),
        ],
    ]

    details_table = Table(
        details,
        colWidths=[87.5 * mm, 87.5 * mm],
    )

    details_style = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]

    if template == "creative":
        details_style.append(
            ("BACKGROUND", (0, 0), (-1, -1), light)
        )
    elif template == "modern":
        details_style.append(
            ("LINEBELOW", (0, 0), (-1, -1), 0.5, grid_color)
        )

    details_table.setStyle(TableStyle(details_style))

    story.append(details_table)
    story.append(Spacer(1, 10 * mm))

    # Invoice information
    invoice_info = Paragraph(
        f"<b>Invoice:</b> {safe_text(data['invoice_number'])}<br/>"
        f"<b>Issue date:</b> {safe_text(data['issue_date'])}<br/>"
        f"<b>Due date:</b> {safe_text(data['due_date'])}",
        styles["BodyTextCustom"],
    )

    if template == "creative":
        info_table = Table(
            [[invoice_info]],
            colWidths=[175 * mm],
        )
        info_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), light),
            ("BOX", (0, 0), (-1, -1), 0.5, grid_color),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(info_table)
    else:
        story.append(invoice_info)

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
                styles["BodyTextCustom"],
            ),
            f"{currency} {rate:,.2f}",
            f"{hours:g}",
            f"{currency} {amount:,.2f}",
        ])

    work_table = Table(
        table_data,
        colWidths=[75 * mm, 32 * mm, 25 * mm, 43 * mm],
        repeatRows=1,
    )

    work_style = [
        ("BACKGROUND", (0, 0), (-1, 0), primary),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [
            colors.white,
            row_color,
        ]),
        ("GRID", (0, 0), (-1, -1), 0.4, grid_color),
        ("ALIGN", (1, 1), (-1, -1), "RIGHT"),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]

    if template == "minimal":
        work_style.extend([
            ("BACKGROUND", (0, 0), (-1, 0), colors.white),
            ("TEXTCOLOR", (0, 0), (-1, 0), primary),
            ("LINEBELOW", (0, 0), (-1, 0), 1, primary),
            ("LINEBELOW", (0, 1), (-1, -1), 0.4, grid_color),
            ("GRID", (0, 0), (-1, -1), 0, colors.white),
        ])

    work_table.setStyle(TableStyle(work_style))

    story.append(work_table)
    story.append(Spacer(1, 8 * mm))

    # Subtotal and total
    total_table = Table([
        ["SUBTOTAL", f"{currency} {total:,.2f}"],
        ["TOTAL", f"{currency} {total:,.2f}"],
    ], colWidths=[130 * mm, 45 * mm])

    total_style = [
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 11),
        ("TEXTCOLOR", (0, 1), (-1, 1), accent),
        ("LINEABOVE", (0, 1), (-1, 1), 1, accent),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]

    if template == "creative":
        total_style.extend([
            ("BACKGROUND", (0, 1), (-1, 1), light),
            ("LEFTPADDING", (0, 1), (-1, 1), 8),
            ("RIGHTPADDING", (0, 1), (-1, 1), 8),
        ])

    total_table.setStyle(TableStyle(total_style))

    story.append(total_table)

    # Notes
    if data.get("notes"):
        story.append(Spacer(1, 12 * mm))
        story.append(Paragraph(
            "<b>NOTES</b>",
            styles["SectionHeading"],
        ))
        story.append(Paragraph(
            safe_text(data["notes"]),
            styles["SmallText"],
        ))

    document.build(story)
