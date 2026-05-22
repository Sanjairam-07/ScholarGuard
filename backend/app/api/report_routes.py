from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid

router = APIRouter()

# In-memory store: { scan_id: report_data }
# Replace with a real DB (MongoDB / SQLite) when deploying
scan_store: dict = {}


def save_report(report_data: dict) -> str:
    """Save a scan report and return a unique scan ID."""
    scan_id = str(uuid.uuid4())[:8]   # short 8-char ID  e.g. "a3f9c21b"
    scan_store[scan_id] = {
        **report_data,
        "scan_id":   scan_id,
        "scanned_at": datetime.utcnow().isoformat() + "Z",
    }
    return scan_id


@router.get("/report/{scan_id}")
async def get_report(scan_id: str):
    """Retrieve a saved scan report by its ID."""
    report = scan_store.get(scan_id)
    if not report:
        raise HTTPException(
            status_code=404,
            detail=f"Report '{scan_id}' not found. It may have expired or never existed."
        )
    return report


@router.get("/reports")
async def list_reports(limit: int = 20):
    """Return the most recent scan reports (community feed)."""
    all_reports = list(scan_store.values())
    # Sort newest first
    all_reports.sort(key=lambda r: r.get("scanned_at", ""), reverse=True)
    return all_reports[:limit]