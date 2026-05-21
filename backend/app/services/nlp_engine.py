from transformers import pipeline

# Load once at startup (not on every request)
classifier = pipeline(
    "text-classification",
    model="mrm8488/bert-tiny-finetuned-sms-spam-detection",
    truncation=True,
    max_length=512
)

PHISHING_KEYWORDS = [
    "urgent", "verify immediately", "click here", "limited time",
    "congratulations you won", "confirm your account", "suspend",
    "act now", "free scholarship", "wire transfer", "gift card",
    "your account will be closed", "winner", "claim your prize"
]

def analyze_text(text: str) -> dict:
    if not text or len(text.strip()) < 10:
        return {"error": "Text too short to analyze"}

    # Run HuggingFace classifier
    result = classifier(text[:512])[0]
    label = result["label"]       # "LABEL_1" = spam/phishing
    score = result["score"]

    # Check phishing keywords manually
    text_lower = text.lower()
    found_keywords = [kw for kw in PHISHING_KEYWORDS if kw in text_lower]

    # Map model output to readable label
    is_phishing = label == "LABEL_1"

    # Combine model + keyword signal into final risk
    keyword_boost = min(len(found_keywords) * 0.05, 0.2)
    final_score = round(min(score + keyword_boost, 1.0), 3) if is_phishing else round(score, 3)

    return {
        "classification": "PHISHING" if is_phishing else "SAFE",
        "confidence": final_score,
        "flagged_keywords": found_keywords,
        "keyword_count": len(found_keywords),
        "raw_label": label
    }