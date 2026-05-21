from app.utils.confidence_score import calculate_confidence_score

def test_dangerous_case():
    result = calculate_confidence_score(
        nlp_score=0.9,
        pattern_score=0.8,
        url_score=1.0,
        ssl_score=1.0
    )
    print(result)
    assert result["verdict"] == "DANGEROUS"
    assert result["score"] >= 70

def test_safe_case():
    result = calculate_confidence_score(
        nlp_score=0.1,
        pattern_score=0.0,
        url_score=0.0,
        ssl_score=0.0
    )
    print(result)
    assert result["verdict"] == "SAFE"
    assert result["score"] < 40

def test_suspicious_case():
    result = calculate_confidence_score(
        nlp_score=0.5,
        pattern_score=0.4,
        url_score=0.2,
        ssl_score=0.3
    )
    print(result)
    assert result["verdict"] == "SUSPICIOUS"

if __name__ == "__main__":
    test_dangerous_case()
    test_safe_case()
    test_suspicious_case()
    print("All confidence score tests passed!")