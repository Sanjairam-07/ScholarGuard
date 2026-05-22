import RiskBadge      from "./RiskBadge";
import ConfidenceBar  from "./ConfidenceBar";
import FlagList       from "./FlagList";

export default function ReportCard({ data, type }) {
  if (!data) return null;

  const report   = data.result?.report   || {};
  const patterns = data.result?.patterns || {};
  const nlp      = data.result?.nlp      || {};
  const urlCheck = data.result?.url_check || {};
  const sslCheck = data.result?.ssl_check || {};
  const filename = data.result?.filename  || "";
  const url      = data.result?.url       || "";

  const verdict     = report.verdict     || "UNKNOWN";
  const finalScore  = report.final_score ?? 0;
  const breakdown   = report.breakdown   || {};

  // Build a human-readable explanation list
  const flags = [];

  // Pattern flags
  if (patterns.urgency_count > 0)
    flags.push({ level: "danger", text: `${patterns.urgency_count} urgency keyword(s) detected (e.g. "Act now", "Limited time")` });
  if (patterns.financial_count > 0)
    flags.push({ level: "danger", text: `${patterns.financial_count} financial pressure phrase(s) found` });
  if (patterns.personal_info_count > 0)
    flags.push({ level: "warning", text: `${patterns.personal_info_count} personal information request(s) detected` });
  if (patterns.suspicious_links_count > 0)
    flags.push({ level: "danger", text: `${patterns.suspicious_links_count} suspicious link(s) embedded in document` });

  // NLP flags
  if (nlp.label === "phishing" || nlp.label === "PHISHING")
    flags.push({ level: "danger", text: `NLP model classified this as phishing (confidence: ${(nlp.confidence * 100).toFixed(1)}%)` });
  else if (nlp.label && nlp.confidence)
    flags.push({ level: "safe",  text: `NLP model classified this as safe (confidence: ${(nlp.confidence * 100).toFixed(1)}%)` });

  // URL flags
  if (urlCheck.is_malicious)
    flags.push({ level: "danger",  text: "URL found on VirusTotal / known blacklists" });
  else if (url)
    flags.push({ level: "safe",    text: "URL not found on any known blacklist" });

  // SSL flags
  if (sslCheck.risk_score >= 0.8)
    flags.push({ level: "danger",  text: "SSL certificate is invalid or expired" });
  else if (sslCheck.domain_age_days !== undefined && sslCheck.domain_age_days < 30)
    flags.push({ level: "warning", text: `Domain is only ${sslCheck.domain_age_days} days old — newly registered domains are high risk` });
  else if (sslCheck.is_valid)
    flags.push({ level: "safe",    text: "SSL certificate is valid and domain age looks normal" });

  if (flags.length === 0)
    flags.push({ level: "safe", text: "No suspicious patterns detected" });

  const cardBorder = {
    SAFE:       "#22c55e",
    SUSPICIOUS: "#f59e0b",
    DANGER:     "#ef4444",
    UNKNOWN:    "#94a3b8",
  }[verdict] || "#94a3b8";

  return (
    <div style={{
      width:        "100%",
      maxWidth:     560,
      margin:       "32px auto 0",
      borderRadius: 16,
      border:       `2px solid ${cardBorder}`,
      background:   "#fff",
      boxShadow:    "0 4px 24px rgba(0,0,0,0.07)",
      overflow:     "hidden",
    }}>

      {/* Header */}
      <div style={{
        padding:    "20px 24px 16px",
        borderBottom: "1px solid #f1f5f9",
        display:    "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap:   "wrap",
        gap:        12,
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
            {type === "pdf" ? "📄 PDF SCAN RESULT" : "🔗 URL SCAN RESULT"}
          </p>
          <p style={{
            margin:   "4px 0 0",
            fontSize: 15,
            fontWeight: 600,
            color:    "#1e293b",
            wordBreak: "break-all",
          }}>
            {filename || url || "Scanned Document"}
          </p>
        </div>
        <RiskBadge verdict={verdict} />
      </div>

      {/* Confidence Score */}
      <div style={{ padding: "20px 24px 0" }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#475569" }}>
          Risk Score
        </p>
        <ConfidenceBar score={finalScore} />
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#94a3b8", textAlign: "right" }}>
          {finalScore.toFixed(1)} / 100
        </p>
      </div>

      {/* Score Breakdown */}
      {Object.keys(breakdown).length > 0 && (
        <div style={{ padding: "16px 24px 0" }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#475569" }}>
            Score Breakdown
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(breakdown).map(([key, val]) => (
              <div key={key} style={{
                flex:         "1 1 120px",
                padding:      "10px 14px",
                background:   "#f8fafc",
                borderRadius: 10,
                border:       "1px solid #e2e8f0",
              }}>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", textTransform: "capitalize" }}>
                  {key.replace(/_/g, " ")}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#1e293b" }}>
                  {typeof val === "number" ? val.toFixed(1) : val}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flags / Explanations */}
      <div style={{ padding: "20px 24px" }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#475569" }}>
          Why this verdict?
        </p>
        <FlagList flags={flags} />
      </div>

      {/* Text Preview (PDF only) */}
      {type === "pdf" && data.result?.extracted_text_preview && (
        <div style={{
          margin:       "0 24px 24px",
          padding:      "12px 16px",
          background:   "#f8fafc",
          borderRadius: 10,
          border:       "1px solid #e2e8f0",
        }}>
          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>
            Extracted Text Preview
          </p>
          <p style={{
            margin:     0,
            fontSize:   12,
            color:      "#94a3b8",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak:  "break-word",
          }}>
            {data.result.extracted_text_preview}…
          </p>
        </div>
      )}

      {/* Report & Contribute */}
      <div style={{
        padding:      "14px 24px",
        background:   "#f8fafc",
        borderTop:    "1px solid #f1f5f9",
        display:      "flex",
        justifyContent: "space-between",
        alignItems:   "center",
        flexWrap:     "wrap",
        gap:          10,
      }}>
        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
          Is this a false result?
        </p>
        <button
          onClick={() => alert("Thanks! This report has been flagged for community review.")}
          style={{
            padding:      "7px 16px",
            background:   "transparent",
            border:       "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontSize:     12,
            color:        "#64748b",
            cursor:       "pointer",
            fontWeight:   500,
          }}
        >
          🚩 Report False Result
        </button>
      </div>
    </div>
  );
}