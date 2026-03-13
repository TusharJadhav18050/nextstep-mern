import React from "react";
export default function TermsPage() {
  return (
    <div style={{ width:"80%", maxWidth:800, margin:"40px auto", background:"#fff", borderRadius:12, padding:40, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
      <h1 style={{ fontSize:32, fontWeight:700, color:"var(--primary)" }}>Terms & Conditions</h1>
      <p style={{ color:"#6b7280", marginTop:16, lineHeight:1.8 }}>Last updated: {new Date().getFullYear()}</p>
      <p style={{ color:"#6b7280", marginTop:16, lineHeight:1.8, fontSize:15 }}>
        By using NextStep, you agree to these terms. You must be at least 18 years old to use this platform.
        You are responsible for maintaining the confidentiality of your account credentials.
      </p>
      <h2 style={{ fontSize:20, fontWeight:700, marginTop:24 }}>Acceptable Use</h2>
      <ul style={{ color:"#6b7280", marginTop:12, paddingLeft:20, lineHeight:2, fontSize:15 }}>
        <li>Post only genuine job listings</li>
        <li>Do not misrepresent your qualifications</li>
        <li>Respect the privacy of other users</li>
      </ul>
    </div>
  );
}
