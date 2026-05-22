import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import RiskBadge from "../../components/RiskBadge";
import ConfidenceBar from "../../components/ConfidenceBar";
import FlagList from "../../components/FlagList";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── tiny helpers ──────────────────────────────────────────────────────────────
function fmt(iso) {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function MetaRow({ label, value, mono = false }) {
  return (
    <div style={styles.metaRow}>
      <span style={styles.metaLabel}>{label}</span>
      <span style={{ ...styles.metaValue, fontFamily: mono ? "monospace" : "inherit" }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function ReportPage() {
  const router = useRouter();
  const { id }  = router.query;

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/api/report/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Report not found (${r.status})`);
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [id]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={styles.center}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Fetching report…</p>
    </div>
  );

  // ── error ──────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={styles.center}>
      <div style={styles.errorBox}>
        <span style={styles.errorIcon}>⚠</span>
        <p style={styles.errorTitle}>Report not found</p>
        <p style={styles.errorSub}>{error}</p>
        <button style={styles.backBtn} onClick={() => router.push("/")}>
          ← Back to scanner
        </button>
      </div>
    </div>
  );

  if (!data) return null;

  const report  = data.report  || {};
  const verdict = report.verdict || "UNKNOWN";
  const score   = report.score ?? 0;

  const verdictColor =
    verdict === "SAFE"       ? "#16a34a" :
    verdict === "SUSPICIOUS" ? "#d97706" : "#dc2626";

  // ── flags list ─────────────────────────────────────────────────────────────
  const flags = [];
  if (data.patterns?.flags?.length)          flags.push(...data.patterns.flags);
  if (data.url_check?.is_malicious)          flags.push("URL found on malicious blacklist");
  if (
    data.ssl_check &&
    (
      !data.ssl_check.ssl_valid ||
      data.ssl_check.young_domain_warning
    )
  )
  flags.push("SSL / domain risk detected");
  if (data.nlp?.classification === "PHISHING")        flags.push("NLP model classified as phishing");

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>ScholarGuard Report · {id}</title>
        <meta name="description"
          content={`Scan result: ${verdict} — ScholarGuard fraud detector`} />
      </Head>

      <div style={styles.page}>
        {/* ── header ── */}
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <span style={styles.logo}>🛡 ScholarGuard</span>
            <button style={styles.backBtn} onClick={() => router.push("/")}>
              ← New scan
            </button>
          </div>
          <h1 style={styles.pageTitle}>Scan Report</h1>
          <p style={styles.scanId}>Report ID: <code style={styles.code}>{data.scan_id}</code></p>
        </div>

        {/* ── verdict hero ── */}
        <div style={{ ...styles.heroCard, borderColor: verdictColor + "44" }}>
          <div style={styles.heroLeft}>
            <span style={{ ...styles.verdictText, color: verdictColor }}>
              {verdict === "SAFE" ? "✅" : verdict === "SUSPICIOUS" ? "⚠️" : "🚨"} {verdict}
            </span>
            <p style={styles.heroSub}>
              {verdict === "SAFE"
                ? "No significant threats detected."
                : verdict === "SUSPICIOUS"
                ? "Some suspicious signals found. Review carefully."
                : "High-risk content detected. Do not trust this source."}
            </p>
          </div>
          <div style={styles.heroRight}>
            <span style={styles.scoreNum}>{score}<span style={styles.scoreMax}>/100</span></span>
            <span style={styles.scoreLabel}>Risk Score</span>
          </div>
        </div>

        {/* ── confidence bar ── */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Risk Confidence</h2>
          <ConfidenceBar score={score} />
        </div>

        {/* ── meta info ── */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Scan Details</h2>
          <MetaRow label="Type"      value={data.type === "pdf" ? "📄 PDF Document" : "🔗 URL"} />
          {data.filename && <MetaRow label="File"   value={data.filename} />}
          {data.url       && <MetaRow label="URL"   value={data.url} mono />}
          <MetaRow label="Scanned"   value={fmt(data.scanned_at)} />
          <MetaRow label="NLP Label" value={data.nlp?.label ?? "—"} />
          <MetaRow label="NLP Confidence" value={data.nlp?.confidence != null
            ? (data.nlp.confidence * 100).toFixed(1) + "%" : "—"} />
          {data.ssl_check && (
            <MetaRow label="SSL Valid" value={data.ssl_check.ssl_valid ? "Yes ✅" : "No ❌"} />
          )}
          {data.url_check && (
            <MetaRow label="Blacklisted" value={data.url_check.is_malicious ? "Yes 🚨" : "No ✅"} />
          )}
        </div>

        {/* ── flags ── */}
        {flags.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Why was this flagged?</h2>
            <FlagList flags={flags} />
          </div>
        )}

        {/* ── text preview ── */}
        {data.extracted_text_preview && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Document Preview</h2>
            <p style={styles.textPreview}>{data.extracted_text_preview}…</p>
          </div>
        )}

        {/* ── share ── */}
        <div style={styles.shareCard}>
          <div>
            <p style={styles.shareTitle}>Share this report</p>
            <p style={styles.shareSub}>
              Send this link to warn others about suspicious content
            </p>
          </div>
          <button style={styles.copyBtn} onClick={copyLink}>
            {copied ? "✅ Copied!" : "📋 Copy link"}
          </button>
        </div>

        <p style={styles.footer}>
          ScholarGuard · Protecting students from fraud · Report ID {data.scan_id}
        </p>
      </div>
    </>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f0f11",
    color: "#e8e8e8",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "0 0 60px",
  },
  header: {
    background: "#18181b",
    borderBottom: "1px solid #2a2a2e",
    padding: "20px 32px 24px",
    marginBottom: 24,
  },
  logoRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 12,
  },
  logo: { fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: -0.5 },
  pageTitle: { fontSize: 28, fontWeight: 700, margin: "0 0 4px", color: "#fff" },
  scanId: { fontSize: 13, color: "#71717a", margin: 0 },
  code: {
    background: "#27272a", padding: "2px 8px", borderRadius: 4,
    fontFamily: "monospace", fontSize: 12, color: "#a1a1aa",
  },

  /* hero */
  heroCard: {
    margin: "0 24px 16px",
    background: "#18181b",
    border: "1px solid #333",
    borderRadius: 14,
    padding: "24px 28px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    gap: 16,
  },
  heroLeft: { flex: 1 },
  verdictText: { fontSize: 28, fontWeight: 800, letterSpacing: -0.5 },
  heroSub: { margin: "6px 0 0", color: "#a1a1aa", fontSize: 14 },
  heroRight: {
    display: "flex", flexDirection: "column", alignItems: "center",
    background: "#09090b", borderRadius: 12, padding: "14px 20px",
    minWidth: 90,
  },
  scoreNum: { fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 },
  scoreMax: { fontSize: 16, color: "#52525b", fontWeight: 400 },
  scoreLabel: { fontSize: 11, color: "#71717a", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 },

  /* cards */
  card: {
    margin: "0 24px 16px",
    background: "#18181b",
    border: "1px solid #27272a",
    borderRadius: 14,
    padding: "20px 24px",
  },
  sectionTitle: { fontSize: 15, fontWeight: 600, color: "#d4d4d8", margin: "0 0 14px" },

  /* meta rows */
  metaRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "8px 0", borderBottom: "1px solid #27272a",
  },
  metaLabel: { fontSize: 13, color: "#71717a", flexShrink: 0, marginRight: 12 },
  metaValue: { fontSize: 13, color: "#d4d4d8", textAlign: "right", wordBreak: "break-all" },

  /* text preview */
  textPreview: {
    fontSize: 13, color: "#a1a1aa", lineHeight: 1.6, margin: 0,
    background: "#09090b", padding: "12px 16px", borderRadius: 8,
    fontFamily: "monospace", whiteSpace: "pre-wrap",
  },

  /* share */
  shareCard: {
    margin: "0 24px 16px",
    background: "#1a1f2e",
    border: "1px solid #2d3748",
    borderRadius: 14,
    padding: "20px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
  },
  shareTitle: { fontSize: 15, fontWeight: 600, color: "#d4d4d8", margin: "0 0 4px" },
  shareSub: { fontSize: 13, color: "#71717a", margin: 0 },
  copyBtn: {
    background: "#3b82f6", color: "#fff", border: "none",
    padding: "10px 20px", borderRadius: 8, fontSize: 14,
    fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
  },

  /* back button */
  backBtn: {
    background: "#27272a", color: "#a1a1aa", border: "none",
    padding: "8px 14px", borderRadius: 7, fontSize: 13,
    cursor: "pointer",
  },

  /* loading / error */
  center: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "#0f0f11", color: "#e8e8e8",
    fontFamily: "'Segoe UI', sans-serif",
  },
  spinner: {
    width: 36, height: 36,
    border: "3px solid #27272a", borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#71717a", fontSize: 14, marginTop: 14 },
  errorBox: {
    background: "#18181b", border: "1px solid #3f1d1d", borderRadius: 14,
    padding: "36px 40px", textAlign: "center", maxWidth: 360,
  },
  errorIcon: { fontSize: 36 },
  errorTitle: { fontSize: 20, fontWeight: 700, color: "#fff", margin: "12px 0 6px" },
  errorSub: { fontSize: 14, color: "#71717a", margin: "0 0 20px" },

  footer: { textAlign: "center", fontSize: 12, color: "#3f3f46", marginTop: 40 },
};