from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile, os

from app.services.pdf_parser import extract_text_from_pdf
from app.services.pattern_detector import detect_patterns
from app.services.nlp_engine import analyze_text
from app.utils.confidence_score import calculate_confidence_score

router = APIRouter()

@router.post("/scan/pdf")
async def scan_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        # Extract PDF data
        pdf_data = extract_text_from_pdf(tmp_path)

        extracted_text = pdf_data["raw_text"]
        # Run all Phase 1 services
        patterns   = detect_patterns(extracted_text)
        nlp_result = analyze_text(extracted_text)

        # Convert pattern result into score
        pattern_score = min(patterns["risk_score"], 1.0)

        # Calculate final score
        report = calculate_confidence_score(
            nlp_score=nlp_result["confidence"],
            pattern_score=pattern_score,
            url_score=0.0,
            ssl_score=0.0
        )

        return {
            "filename": file.filename,
            "extracted_text_preview": extracted_text[:300],
            "patterns": patterns,
            "nlp": nlp_result,
            "report": report
        }

    finally:
        os.remove(tmp_path)

    