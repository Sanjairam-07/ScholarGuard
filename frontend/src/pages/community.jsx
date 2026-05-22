import { useState, useEffect } from "react";
import RiskBadge from "../components/RiskBadge";

const MOCK_REPORTS = [
  {
    id: 1,
    type: "url",
    value: "http://scholarship-apply-now.tk/register",
    verdict: "DANGER",
    score: 88,
    reason: ["Blacklisted domain", "No SSL", "Domain age < 7 days"],
    reported_by: "Anonymous",
    time: "2 hours ago",
    upvotes: 14,
  },
  {
    id: 2,
    type: "pdf",
    value: "Fake_Internship_Offer_TCS.pdf",
    verdict: "SUSPICIOUS",
    score: 55,
    reason: ["Urgency language detected", "Requests bank details"],
    reported_by: "Anonymous",
    time: "5 hours ago",
    upvotes: 9,
  },
  {
    id: 3,
    type: "url",
    value: "http://free-scholarship-india.xyz/apply",
    verdict: "DANGER",
    score: 92,
    reason: ["VirusTotal flagged", "Spoofed domain", "Phishing pattern"],
    reported_by: "Anonymous",
    time: "1 day ago",
    upvotes: 31,
  },
  {
    id: 4,
    type: "pdf",
    value: "AICTE_Grant_Letter_2024.pdf",
    verdict: "SUSPICIOUS",
    score: 42,
    reason: ["Suspicious sender domain", "Urgency keywords found"],
    reported_by: "Anonymous",
    time: "2 days ago",
    upvotes: 7,
  },
];

export default function Community() {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [submitValue, setSubmitValue] = useState("");
  const [submitType, setSubmitType] = useState("url");
  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [upvoted, setUpvoted] = useState({});

  const stats = {
    total: reports.length,
    danger: reports.filter((r) => r.verdict === "DANGER").length,
    suspicious: reports.filter((r) => r.verdict === "SUSPICIOUS").length,
  };

  const filtered =
    filter === "ALL" ? reports : reports.filter((r) => r.verdict === filter);

  const handleSubmit = () => {
    if (!submitValue.trim()) return;

    const newReport = {
      id: Date.now(),
      type: submitType,
      value: submitValue.trim(),
      verdict: "SUSPICIOUS",
      score: 50,
      reason: ["Manually reported by community"],
      reported_by: "Anonymous",
      time: "Just now",
      upvotes: 0,
    };

    setReports([newReport, ...reports]);
    setSubmitValue("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleUpvote = (id) => {
    if (upvoted[id]) return;
    setUpvoted({ ...upvoted, [id]: true });
    setReports(
      reports.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Header */}
    <nav
    style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: "#fff",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        zIndex: 100,
    }}
    >
    {/* Logo */}
    <div
        style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        }}
    >
        <span style={{ fontSize: "18px" }}>🛡️</span>

        <span
        style={{
            fontSize: "14px",
            fontWeight: "800",
            color: "#1a1a2e",
        }}
        >
        Scholar<span style={{ color: "#4f46e5" }}>Guard</span>
        </span>
    </div>

    {/* Right Side */}
    <div
        style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        }}
    >
        <span
        style={{
            fontSize: "12px",
            color: "#888",
        }}
        >
        Community Reports
        </span>

        <a
        href="/"
        style={{
            fontSize: "11px",
            padding: "5px 10px",
            background: "#4f46e5",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            whiteSpace: "nowrap",
        }}
        >
        ← Scan
        </a>
    </div>
    </nav>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 16px" }}>

        {/* Stats Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {[
            { label: "Total Reports", value: stats.total, color: "#6366f1", bg: "#eef2ff" },
            { label: "Dangerous", value: stats.danger, color: "#dc2626", bg: "#fef2f2" },
            { label: "Suspicious", value: stats.suspicious, color: "#d97706", bg: "#fffbeb" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: s.bg,
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "28px", fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Submit a Report */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600, color: "#111827" }}>
            🚨 Report a Suspicious Link or Document
          </h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <select
              value={submitType}
              onChange={(e) => setSubmitType(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                color: "#374151",
                background: "#fff",
              }}
            >
              <option value="url">URL</option>
              <option value="pdf">PDF Name</option>
            </select>
            <input
              type="text"
              value={submitValue}
              onChange={(e) => setSubmitValue(e.target.value)}
              placeholder={submitType === "url" ? "Paste suspicious URL..." : "Enter PDF filename..."}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                minWidth: "200px",
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                background: "#6366f1",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Report
            </button>
          </div>
          {submitted && (
            <div
              style={{
                marginTop: "12px",
                color: "#16a34a",
                fontSize: "13px",
                background: "#f0fdf4",
                padding: "8px 12px",
                borderRadius: "8px",
              }}
            >
              ✅ Thank you! Your report has been added to the community feed.
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {["ALL", "DANGER", "SUSPICIOUS"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 16px",
                borderRadius: "99px",
                border: "1px solid",
                borderColor: filter === f ? "#6366f1" : "#e5e7eb",
                background: filter === f ? "#6366f1" : "#fff",
                color: filter === f ? "#fff" : "#6b7280",
                fontWeight: filter === f ? 600 : 400,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Reports Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filtered.map((report) => (
            <div
              key={report.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #e5e7eb",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}
            >
              {/* Upvote */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: "40px" }}>
                <button
                  onClick={() => handleUpvote(report.id)}
                  style={{
                    background: upvoted[report.id] ? "#eef2ff" : "#f9fafb",
                    border: "1px solid",
                    borderColor: upvoted[report.id] ? "#6366f1" : "#e5e7eb",
                    borderRadius: "8px",
                    width: "36px",
                    height: "36px",
                    cursor: upvoted[report.id] ? "default" : "pointer",
                    fontSize: "16px",
                  }}
                >
                  ▲
                </button>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{report.upvotes}</span>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span
                    style={{
                      background: report.type === "url" ? "#ede9fe" : "#fef3c7",
                      color: report.type === "url" ? "#5b21b6" : "#92400e",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "99px",
                    }}
                  >
                    {report.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#111827", wordBreak: "break-all" }}>
                    {report.value}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                  {report.reason.map((r, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#f3f4f6",
                        color: "#4b5563",
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      ⚠️ {r}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <RiskBadge verdict={report.verdict} score={report.score} />
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                    Reported by {report.reported_by} · {report.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}