export default function RiskBadge({ verdict }) {
  const styles = {
    SAFE:       { bg: "#EAF3DE", color: "#3B6D11", label: "✓ Safe" },
    SUSPICIOUS: { bg: "#FAEEDA", color: "#854F0B", label: "⚠ Suspicious" },
    DANGEROUS:  { bg: "#FCEBEB", color: "#A32D2D", label: "✕ Dangerous" },
  };

  const s = styles[verdict] || styles["SUSPICIOUS"];

  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "4px 14px", borderRadius: "99px",
      fontWeight: 500, fontSize: "14px"
    }}>
      {s.label}
    </span>
  );
}