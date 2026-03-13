import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import "react-circular-progressbar/dist/styles.css";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const statusColors = {
  applied:     { bg: "#dbeafe", color: "#1d4ed8" },
  reviewed:    { bg: "#fef9c3", color: "#92400e" },
  shortlisted: { bg: "#dcfce7", color: "#166534" },
  rejected:    { bg: "#fee2e2", color: "#991b1b" },
};

export default function SeekerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role === "recruiter") { navigate("/recruiter-dashboard"); return; }
    api.get("/resume/my-applications")
      .then(r => setApplications(r.data.applications))
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setLoading(false));
  }, [user,navigate]);

  const scoreColor = (score) => {
    if (score >= 70) return "#16a34a";
    if (score >= 50) return "#d97706";
    return "#dc2626";
  };

  const avgScore = applications.length
    ? Math.round(applications.reduce((s, a) => s + a.score, 0) / applications.length)
    : 0;

  return (
    <div style={{ width: "100%", maxWidth: "90%", margin: "0 auto", padding: "20px 0 40px" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #275df5, #1a3fa0)", borderRadius: 12, padding: "24px 32px", color: "#fff", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>👤 My Dashboard</h1>
        <p style={{ opacity: 0.85, marginTop: 4 }}>Welcome, {user?.name}! Track your job applications here.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Applied",  value: applications.length,                                          icon: "📋", color: "#dbeafe" },
          { label: "Shortlisted",    value: applications.filter(a => a.status === "shortlisted").length,  icon: "⭐", color: "#dcfce7" },
          { label: "Reviewed",       value: applications.filter(a => a.status === "reviewed").length,     icon: "👀", color: "#fef9c3" },
          { label: "Avg Score",      value: `${avgScore}/100`,                                            icon: "📊", color: "#f3e8ff" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 28 }}>{stat.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 8 }}>{stat.value}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Find More Jobs Button */}
      <div style={{ marginBottom: 20 }}>
        <Link to="/jobs">
          <button style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 15 }}>
            <FaBriefcase /> Browse More Jobs
          </button>
        </Link>
      </div>

      {/* Applications List */}
      <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>My Applications</h2>

      {loading ? (
        Array(3).fill(0).map((_, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 10, padding: 20, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <Skeleton height={20} width="50%" /><Skeleton height={14} width="70%" style={{ marginTop: 8 }} />
          </div>
        ))
      ) : applications.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 10, padding: 40, textAlign: "center", color: "#9ca3af", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 16, marginBottom: 16 }}>You haven't applied to any jobs yet!</p>
          <Link to="/jobs">
            <button style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
              Browse Jobs Now
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {applications.map(app => {
            const sColor = statusColors[app.status] || statusColors.applied;
            return (
              <div key={app._id} style={{ background: "#fff", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>

                  {/* Score Circle */}
                  <div style={{ width: 70, height: 70, flexShrink: 0 }}>
                    <CircularProgressbar
                      value={app.score}
                      text={`${app.score}`}
                      styles={buildStyles({
                        pathColor: scoreColor(app.score),
                        textColor: "#111827",
                        trailColor: "#e5e7eb",
                        textSize: "22px",
                      })}
                    />
                  </div>

                  {/* Job Info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <Link to={`/job/${app.job?.slug}`}>
                      <h3 style={{ fontWeight: 700, fontSize: 17, color: "var(--primary)" }}>{app.job?.title}</h3>
                    </Link>
                    <p style={{ color: "#6b7280", fontSize: 14, marginTop: 2 }}>{app.job?.company?.company_name}</p>
                    <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
                        <FaMapMarkerAlt size={11} />{app.job?.job_location}
                      </span>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>
                        Applied: {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <span style={{ background: sColor.bg, color: sColor.color, padding: "6px 16px", borderRadius: 9999, fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
                      {app.status}
                    </span>
                    <span style={{ fontSize: 12, color: scoreColor(app.score), fontWeight: 600 }}>
                      {app.score >= 70 ? "✅ Strong Match" : app.score >= 50 ? "⚡ Average Match" : "⚠️ Weak Match"}
                    </span>
                  </div>
                </div>

                {/* Suggestions */}
                {app.suggestions?.length > 0 && (
                  <div style={{ marginTop: 16, background: "#f9fafb", borderRadius: 8, padding: 12, borderLeft: "3px solid var(--primary)" }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 8 }}>💡 Tips to improve your resume:</p>
                    <ul style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                      {app.suggestions.slice(0, 3).map((s, i) => (
                        <li key={i} style={{ fontSize: 13, color: "#6b7280" }}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
