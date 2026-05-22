# backend/app/services/community_reports.py
import json, os
from datetime import datetime

REPORTS_FILE = "community_reports.json"

def save_report(url_or_filename: str, verdict: str, reported_by: str = "anonymous"):
    reports = load_reports()
    reports.append({
        "target"     : url_or_filename,
        "verdict"    : verdict,
        "reported_at": datetime.now().isoformat(),
        "reported_by": reported_by
    })
    with open(REPORTS_FILE, "w") as f:
        json.dump(reports, f, indent=2)

def load_reports():
    if not os.path.exists(REPORTS_FILE):
        return []
    with open(REPORTS_FILE) as f:
        return json.load(f)