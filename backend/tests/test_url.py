from app.services.url_checker import check_url

# Test with a safe URL
result = check_url("https://www.google.com")
print("SAFE URL TEST:", result)

# Test with a known phishing-style URL (fake)
result2 = check_url("http://free-scholarship-apply-now.xyz")
print("SUSPICIOUS URL TEST:", result2)