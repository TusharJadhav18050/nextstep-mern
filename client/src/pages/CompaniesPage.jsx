import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import api from "../utils/api";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    api.get("/companies")
      .then(r => setCompanies(r.data.companies))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grid = { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:20, marginTop:20 };

  return (
    <div style={{ width:"100%", maxWidth:"80%", margin:"0 auto", padding:"12px 0 40px" }}>
      <h1 style={{ fontWeight:700, fontSize:"clamp(20px,3vw,28px)" }}>Top Companies Hiring</h1>

      {loading ? (
        <div style={grid}>
          {Array(10).fill(0).map((_, i) => (
            <div key={i} style={{ background:"#fff", padding:16, borderRadius:8, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", display:"flex", gap:16, alignItems:"center" }}>
              <div style={{ border:"1px solid #e5e7eb", padding:8, borderRadius:8 }}>
                <Skeleton width={120} height={50} />
              </div>
              <div style={{ flex:1 }}>
                <Skeleton height={20} width={140} />
                <Skeleton height={14} width={100} style={{ marginTop:8 }} />
                <div style={{ display:"flex", gap:8, marginTop:10 }}>
                  <Skeleton width={50} height={20} borderRadius={20} />
                  <Skeleton width={70} height={20} borderRadius={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={grid}>
          {companies.map(company => (
            <Link key={company._id} to={`/company/${company.slug}`}>
              <div style={{ background:"#fff", padding:16, borderRadius:8, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", cursor:"pointer" }}>
                <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                  <div style={{ border:"1px solid #e5e7eb", padding:8, borderRadius:8, flexShrink:0 }}>
                    <img src={company.logo_url} alt={company.company_name}
                      style={{ width:120, height:50, objectFit:"contain" }} />
                  </div>
                  <div>
                    <h2 style={{ fontWeight:700, fontSize:18 }}>{company.company_name}</h2>
                    <div style={{ fontSize:13, color:"#9ca3af", display:"flex", gap:6, alignItems:"center", marginTop:4 }}>
                      <FaStar style={{ color:"#facc15" }} />
                      {company.rating} | {company.reviews} Reviews
                    </div>
                    {company.tags?.length > 0 && (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:10 }}>
                        {company.tags.map((tag, i) => (
                          <span key={i} style={{ border:"1px solid #d1d5db", borderRadius:9999, padding:"2px 10px", fontSize:11, color:"#6b7280" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
