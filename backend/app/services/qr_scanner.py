import cv2
from pyzbar.pyzbar import decode
import fitz
import tempfile
import os


def extract_qr_from_pdf(pdf_path: str) -> dict:
    """
    Scans every page of a PDF for QR codes.
    Returns all decoded URLs found inside them.
    """

    found_urls = []

    doc = fitz.open(pdf_path)

    for page_num in range(len(doc)):

        page = doc[page_num]

        pix = page.get_pixmap(dpi=200)

        # Create temporary image path
        tmp_path = tempfile.mktemp(suffix=".png")

        try:
            # Save page as image
            pix.save(tmp_path)

            # Read image
            img = cv2.imread(tmp_path)

            # Decode QR
            qrs = decode(img)

            for qr in qrs:

                data = qr.data.decode("utf-8").strip()

                if data:
                    found_urls.append({
                        "page": page_num + 1,
                        "content": data
                    })

        finally:
            # Delete temp image safely
            try:
                os.remove(tmp_path)
            except:
                pass

    doc.close()

    return {
        "qr_codes_found": len(found_urls),
        "urls": found_urls
    }