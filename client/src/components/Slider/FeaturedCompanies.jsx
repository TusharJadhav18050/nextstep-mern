import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import api from "../../utils/api";

function FeaturedCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/companies/featured")
      .then(res => setCompanies(res.data.companies))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const card = {
    flexShrink: 0, width: 250, display: "flex", flexDirection: "column",
    alignItems: "center", background: "#fff", borderRadius: 8, padding: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  return (
    <div className="scrollbar-hide" style={{ display: "flex", gap: 24, overflowX: "auto", padding: "20px 8px" }}>
      {loading
        ? Array(5).fill(0).map((_, i) => (
            <div key={i} style={card}>
              <Skeleton height={50} width={130} />
              <div style={{ marginTop: 8, width: "100%" }}><Skeleton height={25} /></div>
              <div style={{ marginTop: 12, width: "100%" }}><Skeleton count={2} height={15} /></div>
              <div style={{ marginTop: 16, width: 120 }}><Skeleton height={35} borderRadius={20} /></div>
            </div>
          ))
        : companies.map((company) => (
            <div key={company._id} style={card}>
              <img src={company.logo_url} alt={company.company_name}
                style={{ width: 130, height: 50, objectFit: "contain" }} />

              <div style={{ marginTop: 8, padding: "8px 16px", width: "100%", background: "var(--accent)", textAlign: "center", fontWeight: 600, borderRadius: 4 }}>
                <h3>{company.company_name}</h3>
                <div style={{ fontSize: 14, fontWeight: 400, display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 8 }}>
                  <FaStar style={{ color: "#facc15" }} />
                  <span>{company.rating}</span>
                  <span>|</span>
                  <span>{company.reviews} Reviews</span>
                </div>
              </div>

              {company.short_description && (
                <p style={{ marginTop: 20, fontSize: 14, color: "#6b7280", textAlign: "center" }}>
                  {company.short_description}
                </p>
              )}

              <div style={{ marginTop: 20 }}>
                <Link to="/jobs">
                  <div style={{ background: "var(--accent)", color: "var(--primary)", borderRadius: 9999, padding: "8px 32px", fontSize: 16, cursor: "pointer", transition: "all 0.3s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--primary)"; }}>
                    View Job
                  </div>
                </Link>
              </div>
            </div>
          ))}
    </div>
  );
}

export default FeaturedCompanies;
