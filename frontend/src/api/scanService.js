const API_BASE = "";  // Empty = uses same port as frontend (3000)

export async function scanURL(url) {
  const res = await fetch(`${API_BASE}/api/scan/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("URL scan failed");
  return res.json();
}

export async function scanPDF(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/scan/pdf`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("PDF scan failed");
  return res.json();
}