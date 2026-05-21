import requests
import os
from dotenv import load_dotenv

load_dotenv()

VT_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
GSB_API_KEY = os.getenv("GOOGLE_SAFEBROWSING_API_KEY")


def check_virustotal(url: str) -> dict:
    headers = {"x-apikey": VT_API_KEY}

    # Step 1: Submit URL for analysis
    response = requests.post(
        "https://www.virustotal.com/api/v3/urls",
        headers=headers,
        data={"url": url}
    )

    if response.status_code != 200:
        return {"error": "VirusTotal submission failed"}

    analysis_id = response.json()["data"]["id"]

    # Step 2: Get the analysis result
    result = requests.get(
        f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
        headers=headers
    )

    stats = result.json()["data"]["attributes"]["stats"]

    return {
        "malicious": stats.get("malicious", 0),
        "suspicious": stats.get("suspicious", 0),
        "harmless": stats.get("harmless", 0),
        "undetected": stats.get("undetected", 0)
    }


def check_google_safe_browsing(url: str) -> dict:
    payload = {
        "client": {"clientId": "scholarguard", "clientVersion": "1.0"},
        "threatInfo": {
            "threatTypes": [
                "MALWARE", "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"
            ],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}]
        }
    }

    response = requests.post(
        f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GSB_API_KEY}",
        json=payload
    )

    matches = response.json().get("matches", [])

    return {
        "is_threat": len(matches) > 0,
        "threat_types": [m["threatType"] for m in matches]
    }


def check_url(url: str) -> dict:
    vt_result = check_virustotal(url)
    gsb_result = check_google_safe_browsing(url)

    is_malicious = (
        vt_result.get("malicious", 0) > 0 or
        gsb_result.get("is_threat", False)
    )

    return {
        "url": url,
        "is_malicious": is_malicious,
        "virustotal": vt_result,
        "google_safe_browsing": gsb_result
    }