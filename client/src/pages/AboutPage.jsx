import React from "react";
export default function AboutPage() {
  return (
    <div style={{ width:"80%", maxWidth:800, margin:"40px auto", background:"#fff", borderRadius:12, padding:40, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
      <h1 style={{ fontSize:32, fontWeight:700, color:"var(--primary)" }}>About NextStep</h1>
      <p style={{ color:"#6b7280", marginTop:16, lineHeight:1.8, fontSize:16 }}>
        NextStep is an intelligent recruitment platform that connects talented job seekers with top companies.
        Our platform uses AI-powered resume analysis and smart job matching to help you find the right opportunity faster.
      </p>
      <p style={{ color:"#6b7280", marginTop:12, lineHeight:1.8, fontSize:16 }}>
        Whether you are a fresh graduate or an experienced professional, NextStep is designed to simplify your job search
        and give you the tools you need to take the next step in your career.
      </p>
      <h2 style={{ fontSize:22, fontWeight:700, marginTop:32 }}>Our Mission</h2>
      <p style={{ color:"#6b7280", marginTop:12, lineHeight:1.8, fontSize:16 }}>
        To democratize employment opportunities by connecting people with meaningful work through technology and intelligence.
      </p>
    </div>
  );
}
