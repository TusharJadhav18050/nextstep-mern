import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaMapMarkerAlt, FaRegBookmark, FaStar } from "react-icons/fa";
import { RiMoneyEuroBoxFill } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import CampusBanner from "../components/Statics/CampusBanner";
import FeaturedBanner from "../components/Statics/FeaturedBanner";
import api from "../utils/api";

export default function JobsPage() {
  const [jobs, setJobs]     = useState([]);
  const [cats, setCats]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    Promise.all([api.get("/jobs"), api.get("/jobs/categories")])
      .then(([j, c]) => { setJobs(j.data.jobs); setCats(c.data.categories); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(job => {
    const matchCat = selected ? job.category === selected : true;
    const matchQ   = q ? (
      job.title.toLowerCase().includes(q.toLowerCase()) ||
      job.company?.company_name?.toLowerCase().includes(q.toLowerCase()) ||
      job.job_location?.toLowerCase().includes(q.toLowerCase())
    ) : true;
    return matchCat && matchQ;
  });

  return (
    <div style={{ width: "100%", maxWidth: "80%", margin: "0 auto", padding: "12px 0" }}>
      <div style={{ margin: "20px 0" }}><CampusBanner /></div>

      {loading ? (
        <div style={{ display: "flex", gap: 24, margin: "40px 0", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 220px", background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <Skeleton height={20} width="60%" style={{ marginBottom: 12 }} />
            {Array(6).fill(0).map((_, i) => <Skeleton key={i} height={32} style={{ marginBottom: 8 }} />)}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            {Array(5).fill(0).map((_, i) => (
              <div key={i} style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <Skeleton height={20} width="60%" /><Skeleton height={14} width="40%" style={{ marginTop: 8 }} />
                <Skeleton height={14} width="90%" style={{ marginTop: 12 }} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 20, margin: "40px 0", flexWrap: "wrap" }}>

          {/* Filters Sidebar */}
          <div style={{ flex: "0 0 200px" }}>
            <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "sticky", top: 16 }}>
              <h2 style={{ fontWeight: 600, fontSize: 20, color: "#374151", marginBottom: 12 }}>Filters</h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {cats.map((cat, i) => (
                  <li key={i} onClick={() => setSelected(selected === cat ? null : cat)}
                    style={{ cursor: "pointer", padding: "8px 12px", borderRadius: 6, border: "1px solid #6b7280", fontSize: 14,
                      background: selected === cat ? "var(--primary)" : "#f9fafb",
                      color: selected === cat ? "#fff" : "#374151" }}>
                    {cat}
                  </li>
                ))}
              </ul>
              {selected && (
                <button onClick={() => setSelected(null)}
                  style={{ marginTop: 12, width: "100%", background: "#f3f4f6", border: "none", padding: "8px 0", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Jobs List */}
          <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 16 }}>
            {q && <p style={{ color: "#6b7280", fontSize: 14 }}>Showing results for: <b>{q}</b></p>}
            {filtered.length === 0
              ? <p style={{ color: "#9ca3af", fontSize: 14 }}>No jobs found.</p>
              : filtered.map(job => (
                  <Link key={job._id} to={`/job/${job.slug}`}>
                    <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontWeight: 700, fontSize: 17 }}>
                            <span>{job.title}</span><span>|</span><span>{job.company?.company_name}</span>
                          </div>
                          {job.company && (
                            <div style={{ fontSize: 12, color: "#9ca3af", display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                              <FaStar style={{ color: "#facc15" }} />
                              {job.company.rating} | {job.company.reviews} reviews
                            </div>
                          )}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
                            <span style={{ fontSize: 13, color: "#9ca3af", display: "flex", gap: 4, alignItems: "center" }}>
                              <FaMapMarkerAlt size={12} />{job.job_location}
                            </span>
                            <span style={{ fontSize: 13, color: "#9ca3af", display: "flex", gap: 4, alignItems: "center" }}>
                              <RiMoneyEuroBoxFill size={17} />{job.salary} LPA
                            </span>
                          </div>
                        </div>
                        {job.company?.logo_url && (
                          <div style={{ border: "1px solid #e5e7eb", padding: 8, borderRadius: 8, flexShrink: 0 }}>
                            <img src={job.company.logo_url} alt={job.company.company_name} style={{ width: 80, height: 40, objectFit: "contain" }} />
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: 14, color: "#6b7280", marginTop: 10 }}>{job.short_description}</p>
                      <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                        <span>{job.post_date}</span>
                        <span style={{ display: "flex", gap: 6, alignItems: "center" }}><FaRegBookmark /> Save</span>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          {/* Right sidebar */}
          <div style={{ flex: "0 0 180px" }}>
            <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <FeaturedBanner />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
