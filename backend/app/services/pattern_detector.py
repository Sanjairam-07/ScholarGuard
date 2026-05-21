import re
from typing import TypedDict

class PatternResult(TypedDict):
    urgency_flags: list[str]
    credential_flags: list[str]
    money_flags: list[str]
    impersonation_flags: list[str]
    total_flag_count: int
    risk_level: str          # "low" | "medium" | "high"
    risk_score: float        # 0.0 to 1.0

# ── keyword banks ────────────────────────────────────────────────────────────

URGENCY_KEYWORDS = [
    "urgent", "immediately", "act now", "limited time", "expire",
    "deadline", "within 24 hours", "respond asap", "last chance",
    "your account will be suspended", "verify now", "do not ignore",
    "action required", "final notice", "offer expires"
]

CREDENTIAL_KEYWORDS = [
    "enter your password", "confirm your email", "verify your identity",
    "click here to login", "update your credentials", "submit your details",
    "provide your bank", "enter otp", "share your pin",
    "validate your account", "reset your password via this link"
]

MONEY_KEYWORDS = [
    "you have won", "congratulations", "prize money", "scholarship grant",
    "stipend of", "pay registration fee", "refundable deposit",
    "processing fee", "transfer fee", "wire transfer", "western union",
    "you are selected", "claim your reward", "cash prize"
]

IMPERSONATION_KEYWORDS = [
    "hr department", "recruitment team", "official offer",
    "government of india", "ministry of", "national scholarship",
    "infosys hr", "tcs recruitment", "wipro official",
    "google internship offer", "microsoft hiring",
    "aicte approved", "ugc approved", "university grants"
]

# ── scorer ───────────────────────────────────────────────────────────────────

def _find_matches(text: str, keywords: list[str]) -> list[str]:
    text_lower = text.lower()
    return [kw for kw in keywords if kw in text_lower]

def _compute_risk(total_flags: int) -> tuple[str, float]:
    if total_flags == 0:
        return "low", 0.0
    elif total_flags <= 2:
        return "low", round(total_flags * 0.12, 2)
    elif total_flags <= 5:
        return "medium", round(0.25 + (total_flags - 2) * 0.1, 2)
    else:
        score = min(0.55 + (total_flags - 5) * 0.05, 1.0)
        return "high", round(score, 2)

# ── main function (called by your API routes) ─────────────────────────────────

def detect_patterns(text: str) -> PatternResult:
    urgency     = _find_matches(text, URGENCY_KEYWORDS)
    credential  = _find_matches(text, CREDENTIAL_KEYWORDS)
    money       = _find_matches(text, MONEY_KEYWORDS)
    impersonation = _find_matches(text, IMPERSONATION_KEYWORDS)

    total = len(urgency) + len(credential) + len(money) + len(impersonation)
    risk_level, risk_score = _compute_risk(total)

    return PatternResult(
        urgency_flags=urgency,
        credential_flags=credential,
        money_flags=money,
        impersonation_flags=impersonation,
        total_flag_count=total,
        risk_level=risk_level,
        risk_score=risk_score
    )