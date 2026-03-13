import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Skeleton from "react-loading-skeleton";
import "react-circular-progressbar/dist/styles.css";

export default function ResumeUpload({ jobSlug }) {
  const [file, setFile]         = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState("");
  const [analysis, setAnalysis]   = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [suggestionsToShow, setSuggestionsToShow] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  const animateScore = (targetScore) => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= targetScore) { current = targetScore; clearInterval(interval); }
      setAnimatedScore(current);
    }, 30);
  };

  const showSuggestionsGradually = (suggestions) => {
    suggestions.forEach((s, idx) => {
      setTimeout(() => {
        setSuggestionsToShow(prev => [...prev, s]);
        if (idx === suggestions.length - 1) setAnalyzing(false);
      }, 600 + idx * 600);
    });
  };

  const resetAll = () => {
    setFile(null); setFileName(""); setProgress(0);
    setError(""); setAnalysis(null); setAnimatedScore(0);
    setSuggestionsToShow([]); setAnalyzing(false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const allowed = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type)) { setError("Only PDF, DOC, or DOCX files are allowed."); return; }
    setError(""); setFile(f); setFileName(f.name);
  };

const handleUpload = async () => {
  if (!file) { setError("Please select a resume file first."); return; }
  setUploading(true); setProgress(0); setError("");
  setAnalysis(null); setSuggestionsToShow([]); setAnimatedScore(0);

  const formData = new FormData();
  formData.append("resume", file);

  const fakeProgress = setInterval(() => setProgress(p => p < 85 ? p + 5 : p), 120);

  try {

    
  const token = localStorage.getItem("nextstep_token");
const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const res = await fetch(
  `${baseUrl}/resume/analyze${jobSlug ? `?job_slug=${jobSlug}` : ""}`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }
);

    
    clearInterval(fakeProgress); setProgress(100);

    if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Analysis failed"); }

    const data = await res.json();
    setUploading(false);
    setAnalyzing(true);
    setSuggestionsToShow([]);
    animateScore(data.score);
    showSuggestionsGradually(data.suggestions);
    setAnalysis(data);
  } catch (err) {
    clearInterval(fakeProgress);
    setUploading(false);
    setError(err.message || "Upload failed. Please try again.");
  }
};
  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: 12, padding: 16, marginTop: 16, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange}
          style={{ flex: 1, border: "1px solid #d1d5db", padding: 8, borderRadius: 8, color: "#6b7280" }} />
        <button onClick={handleUpload} disabled={uploading || !file}
          style={{ background: "var(--primary)", color: "#fff", padding: "8px 16px", borderRadius: 8, fontWeight: 600, border: "none", cursor: "pointer", opacity: (uploading || !file) ? 0.6 : 1 }}>
          {uploading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>

      {fileName && <p style={{ marginTop: 8, color: "#374151", fontSize: 14 }}>Selected: {fileName}</p>}
      {error    && <p style={{ color: "#ef4444", fontSize: 14, marginTop: 8 }}>{error}</p>}

      {uploading && (
        <div style={{ width: "100%", background: "#e5e7eb", borderRadius: 9999, height: 8, marginTop: 12 }}>
          <div style={{ background: "var(--primary)", height: 8, borderRadius: 9999, width: `${progress}%`, transition: "width 0.3s" }} />
        </div>
      )}

      {(analyzing || analysis) && (
        <div style={{ marginTop: 20, background: "#f9fafb", padding: 16, borderRadius: 8, border: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 80, height: 80 }}>
              <CircularProgressbar
                value={animatedScore}
                text={`${animatedScore}/100`}
                styles={buildStyles({
                  pathColor: animatedScore >= 70 ? "#16a34a" : animatedScore >= 50 ? "#facc15" : "#ef4444",
                  textColor: "#111827", trailColor: "#e5e7eb",
                  textSize: "14px", pathTransitionDuration: 0.1,
                })}
              />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151" }}>Resume Score</h3>
              <p style={{ color: "#6b7280", fontSize: 14 }}>Here's how you can improve it:</p>
              {analysis && (
                <p style={{ fontSize: 13, color: analysis.score >= 70 ? "#16a34a" : analysis.score >= 50 ? "#d97706" : "#dc2626", fontWeight: 600, marginTop: 4 }}>
                  {analysis.score >= 70 ? "✅ Great match!" : analysis.score >= 50 ? "⚡ Good — can be improved" : "⚠️ Needs improvement"}
                </p>
              )}
            </div>
          </div>

          <ul style={{ marginTop: 16, paddingLeft: 20, color: "#374151", fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {suggestionsToShow.length === 0 && analyzing
              ? Array(5).fill(0).map((_, i) => <li key={i}><Skeleton width={`${65 + i * 7}%`} height={14} /></li>)
              : suggestionsToShow.map((s, i) => <li key={i}>{s}</li>)}
          </ul>

          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={resetAll}
              style={{ background: "#e5e7eb", padding: "8px 16px", borderRadius: 8, color: "#374151", border: "none", cursor: "pointer" }}>
              Upload Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
