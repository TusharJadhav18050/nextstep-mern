import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaUserTie, FaBriefcase, FaBuilding, FaDownload } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const statusColors = {
  applied:     { bg: "#dbeafe", color: "#1d4ed8" },
  reviewed:    { bg: "#fef9c3", color: "#92400e" },
  shortlisted: { bg: "#dcfce7", color: "#166534" },
  rejected:    { bg: "#fee2e2", color: "#991b1b" },
};

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobs,         setJobs]         = useState([]);
  const [companies,    setCompanies]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState("applicants");
  const [selectedJob,  setSelectedJob]  = useState("all");
  

  useEffect(() => {
  if (!user || user.role !== "recruiter") {
    toast.error("Access denied! Recruiters only.");
    navigate("/");
    return;
  }
  fetchAll();
}, [user, navigate]); 

  const fetchAll = async () => {
    try {
      const [appRes, jobRes, compRes] = await Promise.all([
        api.get("/resume/all-applicants"),
        api.get("/jobs"),
        api.get("/companies"),
      ]);
      setApplications(appRes.data.applications);
      setJobs(jobRes.data.jobs);
      setCompanies(compRes.data.companies);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/resume/status/${appId}`, { status });
      setApplications(prev =>
        prev.map(a => a._id === appId ? { ...a, status } : a)
      );
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };


  const filteredApps = selectedJob === "all"
    ? applications
    : applications.filter(a => a.job?._id === selectedJob);

  const scoreColor = (score) => {
    if (score >= 70) return "#16a34a";
    if (score >= 50) return "#d97706";
    return "#dc2626";
  };

  const rankBadge = (idx) => {
    if (idx === 0) return { icon: "🥇", color: "#f59e0b" };
    if (idx === 1) return { icon: "🥈", color: "#9ca3af" };
    if (idx === 2) return { icon: "🥉", color: "#b45309" };
    return { icon: `#${idx + 1}`, color: "#6b7280" };
  };

  return (
    <div style={{ width: "100%", maxWidth: "90%", margin: "0 auto", padding: "20px 0 40px" }}>

      {/* Header */}
      <div style={{ background: "var(--primary)", borderRadius: 12, padding: "24px 32px", color: "#fff", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>👔 Recruiter Dashboard</h1>
            <p style={{ opacity: 0.85, marginTop: 4 }}>Welcome back, {user?.name}! Manage your jobs and candidates.</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/add-company">
              <button style={{ background: "#fff", color: "var(--primary)", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <FaBuilding /> Add Company
              </button>
            </Link>
            <Link to="/add-job">
              <button style={{ background: "var(--secondary)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <FaBriefcase /> Post Job
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Jobs",       value: jobs.length,         icon: "💼" },
          { label: "Total Companies",  value: companies.length,    icon: "🏢" },
          { label: "Total Applicants", value: applications.length, icon: "👥" },
          { label: "Shortlisted",      value: applications.filter(a => a.status === "shortlisted").length, icon: "⭐" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 28 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{stat.value}</div>
            <div style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#fff", padding: 4, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", width: "fit-content" }}>
        {["applicants", "jobs", "companies"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, textTransform: "capitalize",
              background: activeTab === tab ? "var(--primary)" : "transparent",
              color: activeTab === tab ? "#fff" : "#6b7280" }}>
            {tab === "applicants" ? "👥 Applicants" : tab === "jobs" ? "💼 My Jobs" : "🏢 Companies"}
          </button>
        ))}
      </div>

      {/* ── APPLICANTS TAB ── */}
      {activeTab === "applicants" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
              style={{ border: "1px solid #d1d5db", padding: "8px 16px", borderRadius: 8, fontSize: 14, outline: "none", background: "#fff" }}>
              <option value="all">All Jobs</option>
              {jobs.map(j => <option key={j._id} value={j._id}>{j.title} — {j.company?.company_name}</option>)}
            </select>
            <span style={{ marginLeft: 12, color: "#6b7280", fontSize: 14 }}>
              {filteredApps.length} applicant{filteredApps.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 10, padding: 20, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <Skeleton height={20} width="40%" /><Skeleton height={14} width="60%" style={{ marginTop: 8 }} />
              </div>
            ))
          ) : filteredApps.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 10, padding: 40, textAlign: "center", color: "#9ca3af", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p>No applicants yet. Share your job listings to get candidates!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredApps.map((app, idx) => {
                const badge  = rankBadge(idx);
                const sColor = statusColors[app.status] || statusColors.applied;
          

                return (
                  <div key={app._id} style={{ background: "#fff", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>

                    {/* Rank */}
                    <div style={{ fontSize: 24, minWidth: 40, textAlign: "center", fontWeight: 700, color: badge.color }}>
                      {badge.icon}
                    </div>

                    {/* Candidate Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        <FaUserTie style={{ color: "var(--primary)" }} />
                        {app.applicant?.name}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{app.applicant?.email}</div>
                      <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
                        Applied for: <b style={{ color: "#374151" }}>{app.job?.title}</b> at {app.job?.company?.company_name}
                      </div>
                      <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>
                        Applied on: {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: "center", minWidth: 80 }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(app.score) }}>{app.score}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>/ 100</div>
                      <div style={{ fontSize: 11, color: scoreColor(app.score), fontWeight: 600, marginTop: 2 }}>
                        {app.score >= 70 ? "Strong" : app.score >= 50 ? "Average" : "Weak"}
                      </div>
                    </div>

                    {/* Status + Download */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 150 }}>
                      <span style={{ background: sColor.bg, color: sColor.color, padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600, textAlign: "center", textTransform: "capitalize" }}>
                        {app.status}
                      </span>
                      <select value={app.status} onChange={e => updateStatus(app._id, e.target.value)}
                        style={{ border: "1px solid #d1d5db", padding: "6px 8px", borderRadius: 6, fontSize: 12, outline: "none", cursor: "pointer" }}>
                        <option value="applied">Applied</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>

                
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── JOBS TAB ── */}
      {activeTab === "jobs" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {jobs.map(job => {
            const jobApps = applications.filter(a => a.job?._id === job._id);
            return (
              <div key={job._id} style={{ background: "#fff", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>{job.title}</h3>
                    <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{job.company?.company_name}</p>
                    <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>{job.job_location} • {job.salary} LPA</p>
                  </div>
                  {job.company?.logo_url && (
                    <img src={job.company.logo_url} alt={job.company.company_name} style={{ width: 60, height: 30, objectFit: "contain" }} />
                  )}
                </div>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
                    {jobApps.length} Applicant{jobApps.length !== 1 ? "s" : ""}
                  </span>
                  <button onClick={() => { setActiveTab("applicants"); setSelectedJob(job._id); }}
                    style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                    View Applicants
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── COMPANIES TAB ── */}
      {activeTab === "companies" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {companies.map(company => (
            <div key={company._id} style={{ background: "#fff", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ border: "1px solid #e5e7eb", padding: 8, borderRadius: 8 }}>
                  <img src={company.logo_url} alt={company.company_name} style={{ width: 80, height: 36, objectFit: "contain" }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16 }}>{company.company_name}</h3>
                  <div style={{ fontSize: 13, color: "#9ca3af", display: "flex", gap: 4, alignItems: "center", marginTop: 4 }}>
                    <FaStar style={{ color: "#facc15" }} />{company.rating} | {company.reviews} Reviews
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                {company.tags?.map((tag, i) => (
                  <span key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 9999, padding: "2px 10px", fontSize: 11, color: "#6b7280" }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}