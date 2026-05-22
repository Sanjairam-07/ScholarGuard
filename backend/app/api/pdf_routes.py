import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pdf_parser       import extract_text_from_pdf
from app.services.pattern_detector import detect_patterns
from app.services.nlp_engine       import analyze_text
from app.utils.confidence_score    import calculate_confidence_score
from app.api.report_routes         import save_report          # ← NEW
from app.services.qr_scanner import extract_qr_from_pdf

router = APIRouter()


@router.post("/scan/pdf")
async def scan_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        pdf_data       = extract_text_from_pdf(tmp_path)
        # Scan for QR codes
        qr_result = extract_qr_from_pdf(tmp_path)
        extracted_text = pdf_data["raw_text"]

        patterns      = detect_patterns(extracted_text)
        nlp_result    = analyze_text(extracted_text)
        pattern_score = min(patterns["risk_score"], 1.0)

        report = calculate_confidence_score(
            nlp_score=nlp_result["confidence"],
            pattern_score=pattern_score,
            url_score=0.0,
            ssl_score=0.0
        )

        result = {
            "type":                  "pdf",
            "filename":              file.filename,
            "extracted_text_preview": extracted_text[:300],
            "patterns":              patterns,
            "nlp":                   nlp_result,
            "qr_codes"             : qr_result,
            "report":                report
        }

        scan_id = save_report(result)          # ← save & get ID
        result["scan_id"] = scan_id

        return result

    finally:
        os.remove(tmp_path)