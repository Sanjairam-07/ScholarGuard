from app.services.nlp_engine import analyze_text

# Test 1 - Phishing text
phishing = """
URGENT: Your scholarship account will be suspended!
Click here immediately to verify your identity and claim your prize.
Act now - limited time offer. Wire transfer required.
"""

# Test 2 - Safe text
safe = """
Dear Student, your internship application at TCS has been received.
Our HR team will contact you within 5 business days for the next round.
"""

print("=== PHISHING TEXT ===")
print(analyze_text(phishing))

print("\n=== SAFE TEXT ===")
print(analyze_text(safe))