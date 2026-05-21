# backend/app/utils/confidence_score.py

def calculate_confidence_score(
    nlp_score: float,        # 0.0 to 1.0  (from nlp_engine)
    pattern_score: float,    # 0.0 to 1.0  (from pattern_detector)
    url_score: float,        # 0.0 to 1.0  (from url_checker) — 0=safe, 1=dangerous
    ssl_score: float         # 0.0 to 1.0  (from ssl_checker) — 0=valid, 1=invalid
) -> dict:

    # Weights (must sum to 1.0)
    weights = {
        "nlp":     0.35,
        "pattern": 0.25,
        "url":     0.25,
        "ssl":     0.15
    }

    # Weighted risk score (0.0 to 1.0)
    raw_score = (
        nlp_score     * weights["nlp"]     +
        pattern_score * weights["pattern"] +
        url_score     * weights["url"]     +
        ssl_score     * weights["ssl"]
    )

    # Convert to 0–100
    final_score = round(raw_score * 100, 2)

    # Verdict
    if final_score >= 70:
        verdict  = "DANGEROUS"
        color    = "red"
        message  = "High chance of phishing or fraud. Do NOT proceed."
    elif final_score >= 30:
        verdict  = "SUSPICIOUS"
        color    = "orange"
        message  = "Some red flags detected. Verify before proceeding."
    else:
        verdict  = "SAFE"
        color    = "green"
        message  = "No major threats detected."

    return {
        "score":   final_score,
        "verdict": verdict,
        "color":   color,
        "message": message,
        "breakdown": {
            "nlp_contribution":     round(nlp_score     * weights["nlp"]     * 100, 2),
            "pattern_contribution": round(pattern_score * weights["pattern"] * 100, 2),
            "url_contribution":     round(url_score     * weights["url"]     * 100, 2),
            "ssl_contribution":     round(ssl_score     * weights["ssl"]     * 100, 2)
        }
    }