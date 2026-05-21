from app.services.ssl_checker import full_ssl_report

# Test 1 — Legit site (should be clean)
print("=== Legit Site ===")
report = full_ssl_report("https://internshala.com")
print(f"SSL Valid     : {report['ssl']['ssl_valid']}")
print(f"Domain Age    : {report['domain_age']['domain_age_days']} days")
print(f"Spoofed       : {report['spoof_check']['is_spoofed']}")
print(f"Risk Flags    : {report['risk_flags']}")

print()

# Test 2 — Spoof simulation
print("=== Spoof Test ===")
report2 = full_ssl_report("https://internshala-jobs.co")
print(f"Spoofed       : {report2['spoof_check']['is_spoofed']}")
print(f"Spoof Target  : {report2['spoof_check']['spoof_target']}")
print(f"Risk Flags    : {report2['risk_flags']}")