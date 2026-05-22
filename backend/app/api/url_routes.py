from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.url_checker      import check_url
from app.services.ssl_checker      import check_ssl
from app.utils.confidence_score    import calculate_confidence_score
from app.api.report_routes         import save_report          # ← NEW

router = APIRouter()


class URLRequest(BaseModel):
    url: str


@router.post("/scan/url")
async def scan_url(request: URLRequest):
    url = request.url.strip()

    url_result    = check_url(url)
    ssl_result    = check_ssl(url)
    url_risk_score = 1.0 if url_result["is_malicious"] else 0.0

    report = calculate_confidence_score(
        nlp_score=0.0,
        pattern_score=0.0,
        url_score=url_risk_score,
        ssl_score=min(
            (
                (0 if ssl_result["ssl_valid"] else 1) +
                (1 if ssl_result["young_domain_warning"] else 0)
            ) / 2,
            1.0
        )
    )

    result = {
        "type":      "url",
        "url":       url,
        "url_check": url_result,
        "ssl_check": ssl_result,
        "report":    report,
    }

    scan_id = save_report(result)              # ← save & get ID
    result["scan_id"] = scan_id

    return result