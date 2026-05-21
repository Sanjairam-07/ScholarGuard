from app.services.pattern_detector import detect_patterns

fake_text = """
Dear Student, Urgent! You have been selected for a Government of India 
scholarship grant of ₹50,000. Act now — offer expires in 24 hours. 
Click here to login and verify your identity. Pay a refundable deposit of ₹500.
"""

real_text = """
Dear Applicant, We are pleased to inform you that your application for the 
summer internship program has been reviewed. Please report to our office 
on June 10th with your original documents.
"""

print("=== FAKE DOCUMENT ===")
print(detect_patterns(fake_text))

print("\n=== REAL DOCUMENT ===")
print(detect_patterns(real_text))