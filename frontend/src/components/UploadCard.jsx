import { useState, useRef } from "react";

export default function UploadCard({ onScanComplete, isLoading, setIsLoading }) {
  const [dragOver, setDragOver]   = useState(false);
  const [fileName, setFileName]   = useState("");
  const [error, setError]         = useState("");
  const [urlInput, setUrlInput]   = useState("");
  const [mode, setMode]           = useState("pdf"); // "pdf" | "url"
  const fileRef = useRef();

  // ── PDF Upload ──────────────────────────────────────────────
  const handleFile = (file) => {
    setError("");
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are allowed.");
      return;
    }
    setFileName(file.name);
    uploadPDF(file);
  };

  const uploadPDF = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res  = await fetch("http://localhost:8000/api/scan/pdf", {
        method: "POST",
        body:   formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Scan failed");
      onScanComplete({ type: "pdf", result: data });
    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  // ── URL Scan ────────────────────────────────────────────────
  const scanURL = async () => {
    setError("");
    const trimmed = urlInput.trim();
    if (!trimmed) { setError("Please enter a URL."); return; }
    if (!/^https?:\/\//i.test(trimmed)) {
      setError("URL must start with http:// or https://");
      return;
    }

    setIsLoading(true);
    try {
      const res  = await fetch("http://localhost:8000/api/scan/url", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Scan failed");
      onScanComplete({ type: "url", result: data });
    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Drag & Drop handlers ────────────────────────────────────
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div style={{ width: "100%", maxWidth: 560, margin: "0 auto" }}>

      {/* Mode Toggle */}
      <div style={{
        display:       "flex",
        gap:           0,
        marginBottom:  24,
        border:        "1px solid #e2e8f0",
        borderRadius:  10,
        overflow:      "hidden",
      }}>
        {["pdf", "url"].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(""); setFileName(""); }}
            style={{
              flex:            1,
              padding:         "10px 0",
              background:      mode === m ? "#6366f1" : "#fff",
              color:           mode === m ? "#fff" : "#64748b",
              border:          "none",
              fontWeight:      600,
              fontSize:        14,
              cursor:          "pointer",
              transition:      "all .2s",
            }}
          >
            {m === "pdf" ? "📄  PDF / Offer Letter" : "🔗  URL / Link"}
          </button>
        ))}
      </div>

      {/* PDF Drop Zone */}
      {mode === "pdf" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !isLoading && fileRef.current.click()}
          style={{
            border:       `2px dashed ${dragOver ? "#6366f1" : "#cbd5e1"}`,
            borderRadius: 14,
            padding:      "48px 24px",
            textAlign:    "center",
            cursor:       isLoading ? "not-allowed" : "pointer",
            background:   dragOver ? "#eef2ff" : "#f8fafc",
            transition:   "all .2s",
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            {isLoading ? "⏳" : fileName ? "✅" : "📂"}
          </div>
          <p style={{ margin: 0, fontWeight: 600, color: "#1e293b", fontSize: 16 }}>
            {isLoading
              ? "Scanning…"
              : fileName
              ? fileName
              : "Drag & drop a PDF here"}
          </p>
          <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: 13 }}>
            {!isLoading && !fileName && "or click to browse — PDF only"}
          </p>
        </div>
      )}

      {/* URL Input Row */}
      {mode === "url" && (
        <>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              width: "100%",
              boxSizing: "border-box",
              flexWrap: "nowrap",
            }}
          >
            <input
              type="text"
              placeholder="https://example.com/scholarship"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                padding: "13px 14px",
                fontSize: "14px",
                border: "1.5px solid #dbe3f0",
                borderRadius: "12px",
                outline: "none",
                background: "#fff",
                color: "#111827",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            />

            <button
              onClick={scanURL}
              style={{
                flexShrink: 0,
                padding: "13px 18px",
                background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(79,70,229,0.25)",
              }}
            >
              {isLoading ? "Scanning…" : "Scan URL"}
            </button>
          </div>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            Paste any link — scholarship page, internship offer, email link
          </p>
        </>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop:    14,
          padding:      "10px 16px",
          background:   "#fef2f2",
          border:       "1px solid #fecaca",
          borderRadius: 8,
          color:        "#dc2626",
          fontSize:     13,
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}