from app.services.pdf_parser import extract_text_from_pdf
result = extract_text_from_pdf("tests/S R SANJAIRAM.pdf")
print(result)