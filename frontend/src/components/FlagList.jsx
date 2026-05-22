import ConfidenceBar from "./ConfidenceBar";
import RiskBadge from "./RiskBadge";

export default function FlagList({ patterns, nlp, ssl_check }) {
  const flags = [];

  if (patterns?.urgency_words?.length > 0)
    flags.push(`Urgency language detected: "${patterns.urgency_words.slice(0,3).join('", "')}"`);
  if (patterns?.suspicious_phrases?.length > 0)
    flags.push("Contains suspicious phrases");
  if (nlp?.label === "PHISHING")
    flags.push(`NLP model flagged as phishing (${(nlp.confidence * 100).toFixed(1)}% confidence)`);
  if (ssl_check?.is_expired)
    flags.push("SSL certificate is expired");
  if (ssl_check?.domain_age_days < 30)
    flags.push(`Domain is only ${ssl_check.domain_age_days} days old`);

  if (flags.length === 0)
    return <p style={{ color:"#3B6D11", fontSize:"14px" }}>No suspicious signals found.</p>;

  return (
    <ul style={{ paddingLeft:"18px", margin:0 }}>
      {flags.map((f, i) => (
        <li key={i} style={{ fontSize:"14px", color:"var(--color-text-secondary)", 
                              marginBottom:"6px" }}>{f}</li>
      ))}
    </ul>
  );
}

