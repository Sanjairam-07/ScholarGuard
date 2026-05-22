import { useState } from "react";
import Head        from "next/head";
import UploadCard  from "../components/UploadCard";
import ReportCard  from "../components/ReportCard";

export default function Home() {
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading]   = useState(false);

  const handleScanComplete = (data) => {
    setScanResult(data);
    // Smooth scroll to report
    setTimeout(() => {
      document.getElementById("report-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setScanResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>ScholarGuard — Phishing & Fraud Detector</title>
        <meta name="description" content="Protect yourself from fake internship offers, fraudulent scholarships and phishing links." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{
        minHeight:   "100vh",
        background:  "linear-gradient(135deg, #f0f4ff 0%, #fafafa 60%, #f0fdf4 100%)",
        fontFamily:  "'Inter', 'Segoe UI', sans-serif",
      }}>

        {/* ── Navbar ─────────────────────────────────────────── */}
        <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        flexWrap: "nowrap",
        overflowX: "auto"
        }}>
        
        {/* Logo */}
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0
        }}>
            
            <div style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            color: "white",
            boxShadow: "0 4px 12px rgba(99,102,241,0.25)"
            }}>
            🛡️
            </div>

            <div>
            <div style={{
                fontSize: "15px",
                fontWeight: "800",
                color: "#111827",
                lineHeight: 1
            }}>
                Scholar<span style={{ color: "#4f46e5" }}>Guard</span>
            </div>

            <div style={{
                fontSize: "10px",
                color: "#6b7280",
                marginTop: "2px"
            }}>
                AI Fraud Detection
            </div>
            </div>
        </div>

        {/* Links */}
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
            marginLeft: "12px"
        }}>
            
            <a
            href="#how-it-works"
            style={{
                fontSize: "11px",
                color: "#4b5563",
                textDecoration: "none",
                padding: "6px 10px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                fontWeight: "600"
            }}
            >
            How it works
            </a>

            <a
            href="/community"
            style={{
                fontSize: "11px",
                color: "#4f46e5",
                textDecoration: "none",
                padding: "6px 10px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                fontWeight: "700",
                background: "#eef2ff",
                border: "1px solid #c7d2fe"
            }}
            >
            🌐 Community
            </a>

            <a
            href="https://github.com/Sanjairam-07/scholarguard"
            target="_blank"
            rel="noreferrer"
            style={{
                fontSize: "11px",
                color: "white",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "#111827",
                fontWeight: "700",
                whiteSpace: "nowrap"
            }}
            >
            GitHub ↗
            </a>
        </div>
        </nav>

        {/* ── Hero ───────────────────────────────────────────── */}
        <section style={{ textAlign: "center", padding: "64px 24px 48px" }}>
          <div style={{
            display:       "inline-block",
            padding:       "6px 16px",
            background:    "#eef2ff",
            borderRadius:  99,
            fontSize:      12,
            fontWeight:    600,
            color:         "#6366f1",
            marginBottom:  20,
            letterSpacing: ".04em",
          }}>
            🎓 Built for Students
          </div>

          <h1 style={{
            fontSize:   "clamp(28px, 5vw, 46px)",
            fontWeight: 800,
            color:      "#0f172a",
            margin:     "0 0 16px",
            lineHeight: 1.2,
          }}>
            Is this offer real —<br />
            <span style={{ color: "#6366f1" }}>or a scam?</span>
          </h1>

          <p style={{
            fontSize:  "clamp(15px, 2.5vw, 18px)",
            color:     "#64748b",
            maxWidth:  520,
            margin:    "0 auto 48px",
            lineHeight: 1.65,
          }}>
            Upload a PDF offer letter or paste a scholarship link.
            ScholarGuard uses AI + cybersecurity checks to detect fraud instantly.
          </p>

          {/* Scanner Card */}
          <div style={{
            background:   "#fff",
            borderRadius: 20,
            padding:      "36px 32px",
            maxWidth:     600,
            margin:       "0 auto",
            boxShadow:    "0 8px 40px rgba(99,102,241,0.10)",
            border:       "1px solid #e2e8f0",
          }}>
            <UploadCard
              onScanComplete={handleScanComplete}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            {/* Loading Indicator */}
            {isLoading && (
              <div style={{ marginTop: 28, textAlign: "center" }}>
                <div style={{
                  width:            40,
                  height:           40,
                  border:           "4px solid #e2e8f0",
                  borderTop:        "4px solid #6366f1",
                  borderRadius:     "50%",
                  animation:        "spin 0.8s linear infinite",
                  margin:           "0 auto 14px",
                }} />
                <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
                  Running AI + security checks…
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
          </div>
        </section>

        {/* ── Report Section ─────────────────────────────────── */}
        {scanResult && (
          <section id="report-section" style={{ padding: "0 24px 64px" }}>
            <ReportCard data={scanResult} type={scanResult.type} />
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={handleReset}
                style={{
                  padding:      "10px 28px",
                  background:   "#6366f1",
                  color:        "#fff",
                  border:       "none",
                  borderRadius: 10,
                  fontWeight:   600,
                  fontSize:     14,
                  cursor:       "pointer",
                }}
              >
                ← Scan Another
              </button>
            </div>
          </section>
        )}

        {/* ── How ScholarGuard Works ───────────────────────── */}
        {!scanResult && (
        <section
        id="how-it-works"
        style={{
            padding: "70px 24px 90px",
            background: "linear-gradient(to bottom, #f8faff, #ffffff)",
        }}
        >
        <h2
            style={{
            textAlign: "center",
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 800,
            marginBottom: 14,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            }}
        >
            How ScholarGuard works
        </h2>

        <p
            style={{
            textAlign: "center",
            maxWidth: 650,
            margin: "0 auto 52px",
            color: "#64748b",
            fontSize: 15,
            lineHeight: 1.7,
            }}
        >
            ScholarGuard combines AI-powered phishing detection with real cybersecurity
            analysis to protect students from fake internships, scholarships and scam offers.
        </p>

        <div
            style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
            maxWidth: 1050,
            margin: "0 auto",
            }}
        >
            {[
            {
                icon: "📤",
                step: "STEP 1",
                title: "Upload or Paste",
                desc: "Drop a PDF offer letter or paste any suspicious scholarship or internship link.",
                bg: "#eef2ff",
                accent: "#6366f1",
            },

            {
                icon: "🤖",
                step: "STEP 2",
                title: "AI NLP Analysis",
                desc: "DistilBERT model detects urgency, threats, manipulation and phishing language patterns.",
                bg: "#ecfdf5",
                accent: "#10b981",
            },

            {
                icon: "🔐",
                step: "STEP 3",
                title: "Security Verification",
                desc: "Checks SSL validity, domain age, blacklist reputation and spoofed websites.",
                bg: "#fff7ed",
                accent: "#f97316",
            },

            {
                icon: "📊",
                step: "STEP 4",
                title: "Confidence Report",
                desc: "Receive a detailed fraud confidence score with complete explanation of red flags.",
                bg: "#faf5ff",
                accent: "#a855f7",
            },
            ].map((card, i) => (
            <div
                key={i}
                style={{
                background: card.bg,
                borderRadius: 22,
                padding: "32px 24px",
                border: `1px solid ${card.accent}22`,
                borderTop: `5px solid ${card.accent}`,
                textAlign: "center",
                minHeight: 270,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.25s ease",
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                cursor: "default",
                }}
                onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                    "0 14px 32px rgba(0,0,0,0.10)";
                }}
                onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.05)";
                }}
            >
                <div
                style={{
                    width: 74,
                    height: 74,
                    margin: "0 auto 18px",
                    borderRadius: "50%",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
                >
                {card.icon}
                </div>

                <div
                style={{
                    display: "inline-block",
                    alignSelf: "center",
                    background: card.accent,
                    color: "#fff",
                    padding: "5px 14px",
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: ".05em",
                    marginBottom: 16,
                }}
                >
                {card.step}
                </div>

                <h3
                style={{
                    margin: "0 0 12px",
                    fontSize: 19,
                    fontWeight: 700,
                    color: "#0f172a",
                }}
                >
                {card.title}
                </h3>

                <p
                style={{
                    margin: 0,
                    fontSize: 14,
                    color: "#475569",
                    lineHeight: 1.75,
                }}
                >
                {card.desc}
                </p>
            </div>
            ))}
        </div>
        </section>
        )}

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer style={{
          textAlign:    "center",
          padding:      "20px 24px",
          borderTop:    "1px solid #e2e8f0",
          background:   "#fff",
          fontSize:     13,
          color:        "#94a3b8",
        }}>
          🛡️ ScholarGuard By SANJAIRAM S R &nbsp;|&nbsp; Built with FastAPI + Next.js + HuggingFace
        </footer>
      </div>
    </>
  );
}