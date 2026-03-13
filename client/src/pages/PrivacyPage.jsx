import React from "react";
export default function PrivacyPage() {
  return (
    <div style={{ width:"80%", maxWidth:800, margin:"40px auto", background:"#fff", borderRadius:12, padding:40, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
      <h1 style={{ fontSize:32, fontWeight:700, color:"var(--primary)" }}>Privacy Policy</h1>
      <p style={{ color:"#6b7280", marginTop:16, lineHeight:1.8 }}>Last updated: {new Date().getFullYear()}</p>
      <p style={{ color:"#6b7280", marginTop:16, lineHeight:1.8, fontSize:15 }}>
        NextStep is committed to protecting your privacy. We collect only the information necessary to provide our services,
        including your name, email, and resume data. Your data is never sold to third parties.
      </p>
      <h2 style={{ fontSize:20, fontWeight:700, marginTop:24 }}>Data We Collect</h2>
      <ul style={{ color:"#6b7280", marginTop:12, paddingLeft:20, lineHeight:2, fontSize:15 }}>
        <li>Account information (name, email, password)</li>
        <li>Resume files uploaded for analysis</li>
        <li>Job application history</li>
      </ul>
    </div>
  );
}
