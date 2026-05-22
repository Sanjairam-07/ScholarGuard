export default function ConfidenceBar({ score }) {
  const color = score >= 70 ? "#E24B4A" : score >= 30 ? "#BA7517" : "#639922";

  return (
    <div style={{ margin: "12px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", 
                    fontSize:"13px", marginBottom:"6px",
                    color:"var(--color-text-secondary)" }}>
        <span>Risk Score</span>
        <span style={{ fontWeight:500 }}>{score}%</span>
      </div>
      <div style={{ background:"#E5E5E5", borderRadius:"99px", height:"8px" }}>
        <div style={{
          width: `${score}%`, height: "8px",
          background: color, borderRadius: "99px",
          transition: "width 0.8s ease"
        }}/>
      </div>
    </div>
  );
}