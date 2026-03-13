import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import Skeleton from "react-loading-skeleton";
import CompanySlider from "../components/Slider/CompanySlider";
import FeaturedCompanies from "../components/Slider/FeaturedCompanies";
import CampusBanner from "../components/Statics/CampusBanner";

export default function HomePage() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/lottie/hero-section.json")
      .then(r => r.json())
      .then(d => setAnimationData(d))
      .catch(() => {});
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: "80%", margin: "0 auto", padding: "12px 0" }}>

      {/* Hero */}
      <div style={{ display: "flex", flexWrap: "wrap-reverse", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div style={{ flex: "1 1 320px", maxWidth: 520 }}>
          <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: 18 }}>
            Step into Your Future
          </span>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(22px, 4vw, 36px)", lineHeight: 1.2, marginTop: 8 }}>
            Take the Next Step in Your Career
          </h2>
          <p style={{ color: "#6b7280", marginTop: 16, fontSize: 15, lineHeight: 1.7 }}>
            Discover a wide range of job opportunities tailored to your skills and interests.
            With <b>NextStep</b>, you can easily upload your resume, showcase your strengths,
            and get noticed by companies that truly value your potential.
          </p>
          <p style={{ color: "#6b7280", marginTop: 12, fontSize: 15, lineHeight: 1.7 }}>
            Whether you&apos;re a student, a recent graduate, or a professional taking the next leap,{" "}
            <b>NextStep</b> simplifies your career journey and helps you move forward with confidence.
          </p>

          <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
            <Link to="/login" style={{ flex: "1 1 130px", textAlign: "center", textDecoration: "none" }}>
              <div style={{
                border: "2px solid var(--primary)", color: "var(--primary)",
                borderRadius: 9999, padding: "10px 20px", fontWeight: 600, cursor: "pointer"
              }}>
                Login
              </div>
            </Link>
            <Link to="/register" style={{ flex: "1 1 130px", textAlign: "center", textDecoration: "none" }}>
              <div style={{
                background: "var(--primary)", color: "#fff",
                borderRadius: 9999, padding: "10px 20px", fontWeight: 600, cursor: "pointer"
              }}>
                Get Started
              </div>
            </Link>
          </div>
        </div>

        <div style={{ flex: "1 1 300px", maxWidth: 480 }}>
          {animationData
            ? <Lottie animationData={animationData} loop autoplay />
            : <Skeleton height={400} />}
        </div>
      </div>

      {/* Company Logos Slider */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: "clamp(20px, 3vw, 28px)", textAlign: "center", marginBottom: 8 }}>
          Top Companies Hiring Now
        </h2>
        <CompanySlider />
      </div>

      {/* Featured Companies */}
      <div style={{ margin: "40px 0" }}>
        <h2 style={{ fontWeight: 700, fontSize: "clamp(20px, 3vw, 28px)", textAlign: "center" }}>
          Featured Companies Actively Hiring
        </h2>
        <FeaturedCompanies />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <Link to="/register">
            <span style={{
              border: "1px solid var(--primary)", color: "var(--primary)",
              padding: "8px 24px", borderRadius: 9999, cursor: "pointer", fontSize: 15,
              textDecoration: "none", display: "inline-block"
            }}
              onMouseEnter={e => { e.target.style.background = "var(--primary)"; e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "var(--primary)"; }}>
              Join Now to Explore →
            </span>
          </Link>
        </div>
        <div style={{ marginTop: 60, padding: "0 8px" }}>
          <CampusBanner />
        </div>
      </div>
    </div>
  );
}