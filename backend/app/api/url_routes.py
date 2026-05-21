from fastapi import APIRouter
from pydantic import BaseModel

from app.services.url_checker import check_url
from app.services.ssl_checker import full_ssl_report
from app.utils.confidence_score import calculate_confidence_score

router = APIRouter()

class URLRequest(BaseModel):
    url: str

@router.post("/scan/url")
async def scan_url(request: URLRequest):
    url = request.url.strip()

    url_result = check_url(url)
    ssl_result = full_ssl_report(url)

    url_risk_score = 1.0 if url_result["is_malicious"] else 0.0
    ssl_score = min(ssl_result["risk_count"] / 4, 1.0)
    report = calculate_confidence_score(
        nlp_score    = 0.0,
        pattern_score= 0.0,
        url_score    = url_risk_score,
        ssl_score    = ssl_score
    )

    return {
        "url"       : url,
        "url_check" : url_result,
        "ssl_check" : ssl_result,
        "report"    : report
    }