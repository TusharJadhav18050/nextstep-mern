import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const quickLinks    = [{ title: "About Us", url: "/about-us" }, { title: "Contact Us", url: "/contact-us" }, { title: "Jobs", url: "/jobs" }, { title: "Companies", url: "/companies" }];
const conditionLinks = [{ title: "Privacy Policy", url: "/privacy-policy" }, { title: "Terms & Conditions", url: "/terms-conditions" }];

function Footer() {
  return (
    <div style={{ background: "#fff", padding: "32px 0", borderTop: "1px solid #e5e7eb" }}>
      <footer style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 40 }}>

          {/* Logo & Social */}
          <div style={{ minWidth: 200, flex: "1 1 200px" }}>
            <Link to="/"><h2 style={{ fontWeight: 700, fontSize: 28, color: "var(--primary)" }}>NextStep</h2></Link>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 12, maxWidth: 240 }}>
              Empowering your career with opportunities that fit your future.
            </p>
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 24 }}>Connect With Us</div>
            <div style={{ display: "flex", gap: 12, marginTop: 8, color: "var(--primary)" }}>
              <FaFacebook size={20} style={{ cursor: "pointer" }} />
              <FaTwitter  size={20} style={{ cursor: "pointer" }} />
              <FaInstagram size={20} style={{ cursor: "pointer" }} />
              <FaLinkedin size={20} style={{ cursor: "pointer" }} />
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ minWidth: 140, flex: "1 1 140px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: 12, fontSize: 16 }}>Quick Links</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {quickLinks.map((item, idx) => (
                <li key={idx} style={{ fontSize: 15, color: "#6b7280" }}>
                  <Link to={item.url} style={{ color: "#6b7280" }}
                    onMouseEnter={e => e.target.style.color="#111"}
                    onMouseLeave={e => e.target.style.color="#6b7280"}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms */}
          <div style={{ minWidth: 160, flex: "1 1 160px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: 12, fontSize: 16 }}>Terms & Conditions</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {conditionLinks.map((item, idx) => (
                <li key={idx} style={{ fontSize: 15, color: "#6b7280" }}>
                  <Link to={item.url} style={{ color: "#6b7280" }}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile App */}
          <div style={{ flex: "1 1 280px", background: "var(--accent)", padding: 16, borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <img src="/mobile-job.png" alt="mobile app" style={{ width: "100%", maxWidth: 280, height: 140, objectFit: "contain" }} />
            <p style={{ fontSize: 14, color: "#374151", fontWeight: 500, marginTop: 16 }}>
              Get the app to explore jobs on the go!
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
              <img src="/googlestore.png" alt="Google Play" style={{ height: 40, objectFit: "contain", cursor: "pointer" }} />
              <img src="/appstore.png"    alt="App Store"   style={{ height: 40, objectFit: "contain", cursor: "pointer" }} />
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #d1d5db", marginTop: 40, paddingTop: 20, textAlign: "center", color: "#6b7280", fontSize: 13 }}>
          All trademarks are the property of their respective owners.<br />
          All rights reserved © {new Date().getFullYear()} NextStep
        </div>
      </footer>
    </div>
  );
}

export default Footer;
