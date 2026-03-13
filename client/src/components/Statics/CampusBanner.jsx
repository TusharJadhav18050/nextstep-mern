import React from "react";

function CampusBanner() {
  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div style={{ width: 160, height: 140 }}>
          <img src="/campus-banner.png" alt="campus-banner" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div style={{ flex: "1 1 300px" }}>
          <h3 style={{ fontWeight: 700, fontSize: 20 }}>
            Introducing a career platform for college students & fresh grads
          </h3>
          <p style={{ fontSize: 15, color: "#6b7280", marginTop: 8 }}>
            Explore contests, webinars, take aptitude test, prepare for your dream career & find jobs & internships
          </p>
          <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Internships", "Contests", "Experts", "Pathfinder", "NCAT"].map((t) => (
              <span key={t} style={{ border: "1px solid #d1d5db", borderRadius: 9999, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>
                {t} &gt;
              </span>
            ))}
          </div>
        </div>
        <div style={{ flex: "0 1 180px" }}>
          <div style={{ background: "var(--primary)", color: "#fff", padding: "10px 20px", borderRadius: 4, textAlign: "center", cursor: "pointer" }}>
            Launching Soon
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampusBanner;
