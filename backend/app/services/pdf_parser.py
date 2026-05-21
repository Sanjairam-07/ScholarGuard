import pdfplumber

def extract_text_from_pdf(file_path: str) -> dict:
    text = ""
    page_count = 0
    urls_found = []

    with pdfplumber.open(file_path) as pdf:
        page_count = len(pdf.pages)
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    # Extract any URLs found in the text
    import re
    url_pattern = r'https?://[^\s]+'
    urls_found = re.findall(url_pattern, text)

    return {
        "raw_text": text,
        "page_count": page_count,
        "urls_found": urls_found,
        "char_count": len(text)
    }