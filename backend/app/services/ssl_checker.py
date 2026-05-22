import ssl
import socket
import whois
from datetime import datetime, timezone
from urllib.parse import urlparse

def extract_domain(url: str) -> str:
    parsed = urlparse(url)
    domain = parsed.netloc or parsed.path
    return domain.replace("www.", "")

def check_ssl(url: str) -> dict:
    domain = extract_domain(url)
    result = {
        "domain": domain,
        "ssl_valid": False,
        "ssl_expiry": None,
        "days_until_expiry": None,
        "ssl_error": None,
        "domain_age_days": None,
        "young_domain_warning": False
    }
    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                expiry_str = cert["notAfter"]
                expiry_date = datetime.strptime(
                    expiry_str, "%b %d %H:%M:%S %Y %Z"
                ).replace(tzinfo=timezone.utc)
                now = datetime.now(timezone.utc)
                days_left = (expiry_date - now).days
                result["ssl_valid"] = days_left > 0
                result["ssl_expiry"] = expiry_date.strftime("%Y-%m-%d")
                result["days_until_expiry"] = days_left
    except ssl.SSLCertVerificationError as e:
        result["ssl_error"] = f"SSL verification failed: {str(e)}"
    except Exception as e:
        result["ssl_error"] = f"Could not check SSL: {str(e)}"
    try:
        age_info = check_domain_age(url)

        result["domain_age_days"] = age_info["domain_age_days"]

        # Domain younger than 30 days = suspicious
        if (
            age_info["domain_age_days"] is not None and
            age_info["domain_age_days"] < 30
        ):
            result["young_domain_warning"] = True

    except Exception:
        pass
    return result

def check_domain_age(url: str) -> dict:
    domain = extract_domain(url)
    result = {
        "domain": domain,
        "creation_date": None,
        "domain_age_days": None,
        "is_new_domain": True,
        "whois_error": None
    }
    try:
        w = whois.whois(domain)
        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        if creation:
            if creation.tzinfo is None:
                creation = creation.replace(tzinfo=timezone.utc)
            age_days = (datetime.now(timezone.utc) - creation).days
            result["creation_date"] = creation.strftime("%Y-%m-%d")
            result["domain_age_days"] = age_days
            result["is_new_domain"] = age_days < 180  # < 6 months = suspicious
    except Exception as e:
        result["whois_error"] = f"WHOIS lookup failed: {str(e)}"
    return result

def check_domain_spoof(url: str, trusted_domains: list = None) -> dict:
    if trusted_domains is None:
        trusted_domains = [
            "gov.in", "edu.in", "ac.in", "gov.com",
            "scholarships.gov.in", "nsp.gov.in",
            "linkedin.com", "internshala.com", "naukri.com"
        ]
    domain = extract_domain(url)
    result = {
        "domain": domain,
        "is_spoofed": False,
        "spoof_target": None
    }
    for trusted in trusted_domains:
        trusted_core = trusted.replace("www.", "").split(".")[0]
        if trusted_core in domain and domain != trusted and not domain.endswith(trusted):
            result["is_spoofed"] = True
            result["spoof_target"] = trusted
            break
    return result

def full_ssl_report(url: str) -> dict:
    ssl_info = check_ssl(url)
    age_info = check_domain_age(url)
    spoof_info = check_domain_spoof(url)

    risk_flags = []

    # SSL Issues
    if not ssl_info["ssl_valid"]:
        risk_flags.append("Invalid or missing SSL certificate")

    # SSL Expiry Warning
    if (
        ssl_info["days_until_expiry"] and
        ssl_info["days_until_expiry"] < 15
    ):
        risk_flags.append("SSL certificate expiring very soon")

    # New Domain Warning (< 6 months)
    if age_info["is_new_domain"]:
        risk_flags.append(
            f"New domain (only {age_info['domain_age_days']} days old)"
        )

    # VERY Young Domain Warning (< 30 days)
    young_domain_warning = False

    if (
        age_info["domain_age_days"] is not None and
        age_info["domain_age_days"] < 30
    ):
        young_domain_warning = True

        risk_flags.append(
            f"Very young domain ({age_info['domain_age_days']} days old)"
        )

    # Spoof Detection
    if spoof_info["is_spoofed"]:
        risk_flags.append(
            f"Domain may be spoofing: {spoof_info['spoof_target']}"
        )

    return {
        "ssl": ssl_info,
        "domain_age": age_info,
        "spoof_check": spoof_info,

        # NEW FIELD
        "young_domain_warning": young_domain_warning,

        "risk_flags": risk_flags,
        "risk_count": len(risk_flags)
    }