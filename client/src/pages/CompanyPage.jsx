import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaRegBookmark, FaStar } from "react-icons/fa";
import { RiMoneyEuroBoxFill } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import api from "../utils/api";

export default function CompanyPage() {
  const { slug } = useParams();
  const [company,  setCompany]  = useState(null);
  const [jobs,     setJobs]     = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/companies/${slug}`),
      api.get("/jobs"),
      api.get("/companies/featured"),
    ])
    .then(([c, j, f]) => {
      const comp = c.data.company;
      setCompany(comp);
      setFeatured(f.data.companies);
      // filter jobs belonging to this company
      const myJobs = j.data.jobs.filter(job =>
        job.company?._id === comp._id || job.company?.slug === comp.slug
      );
      setJobs(myJobs);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ width:"80%", margin:"40px auto", display:"flex", gap:20, flexWrap:"wrap" }}>
      <div style={{ flex:"1 1 400px", display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ background:"#fff", borderRadius:8, padding:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", gap:16, alignItems:"center" }}>
            <Skeleton width={140} height={60} />
            <div style={{ flex:1 }}><Skeleton height={24} width="60%" /><Skeleton height={14} width="50%" style={{ marginTop:8 }} /></div>
          </div>
          <Skeleton count={3} style={{ marginTop:12 }} />
        </div>
        {Array(3).fill(0).map((_,i)=>(
          <div key={i} style={{ background:"#fff", borderRadius:8, padding:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <Skeleton height={20} width="60%" /><Skeleton height={14} width="40%" style={{ marginTop:8 }} />
          </div>
        ))}
      </div>
      <div style={{ flex:"0 1 280px", background:"#fff", borderRadius:8, padding:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
        <Skeleton height={24} width="70%" style={{ marginBottom:12 }} />
        {Array(4).fill(0).map((_,i)=>(
          <div key={i} style={{ display:"flex", gap:12, marginBottom:12 }}><Skeleton width={80} height={40}/><div style={{ flex:1 }}><Skeleton height={18}/><Skeleton height={14} width="60%" style={{ marginTop:4 }}/></div></div>
        ))}
      </div>
    </div>
  );

  if (!company) return (
    <div style={{ width:"80%", margin:"40px auto", background:"#fff", borderRadius:8, padding:24, textAlign:"center", color:"#9ca3af" }}>
      Company not found.
    </div>
  );

  return (
    <div style={{ width:"100%", maxWidth:"80%", margin:"0 auto", padding:"16px 0 40px" }}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:20 }}>

        {/* Left */}
        <div style={{ flex:"1 1 400px", display:"flex", flexDirection:"column", gap:16 }}>

          {/* Company Header */}
          <div style={{ background:"#fff", borderRadius:8, padding:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", gap:16, alignItems:"center" }}>
              <div style={{ border:"1px solid #e5e7eb", padding:8, borderRadius:6 }}>
                <img src={company.logo_url} alt={company.company_name} style={{ width:120, height:50, objectFit:"contain" }} />
              </div>
              <div>
                <h1 style={{ fontWeight:700, fontSize:"clamp(20px,3vw,28px)" }}>{company.company_name}</h1>
                <div style={{ display:"flex", gap:8, alignItems:"center", color:"#6b7280", fontSize:14, marginTop:4 }}>
                  <FaStar style={{ color:"#facc15" }} />{company.rating} | {company.reviews} Reviews
                </div>
              </div>
            </div>
            <p style={{ fontSize:15, color:"#6b7280", marginTop:16, lineHeight:1.7 }}>
              {company.description || "No description available."}
            </p>
          </div>

          {/* Jobs by this company */}
          <div style={{ background:"#fff", borderRadius:8, padding:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontWeight:700, fontSize:20, marginBottom:12 }}>
              Jobs Offered By {company.company_name}
            </h2>
            {jobs.length === 0
              ? <p style={{ color:"#9ca3af", fontSize:14 }}>No jobs found for this company.</p>
              : <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {jobs.map(job => (
                    <Link key={job._id} to={`/job/${job.slug}`}>
                      <div style={{ background:"#fff", padding:16, borderRadius:8, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", gap:16 }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, fontSize:17, display:"flex", gap:6, flexWrap:"wrap" }}>
                              <span>{job.title}</span><span>|</span><span>{company.company_name}</span>
                            </div>
                            <div style={{ fontSize:12, color:"#9ca3af", display:"flex", gap:6, marginTop:4 }}>
                              <FaStar style={{ color:"#facc15" }} />{company.rating} | {company.reviews} reviews
                            </div>
                            <div style={{ display:"flex", gap:12, marginTop:8, flexWrap:"wrap" }}>
                              <span style={{ fontSize:13, color:"#9ca3af", display:"flex", gap:4, alignItems:"center" }}>
                                <FaMapMarkerAlt size={12}/>{job.job_location}
                              </span>
                              <span style={{ fontSize:13, color:"#9ca3af", display:"flex", gap:4, alignItems:"center" }}>
                                <RiMoneyEuroBoxFill size={17}/>{job.salary} LPA
                              </span>
                            </div>
                          </div>
                          <div style={{ border:"1px solid #e5e7eb", padding:8, borderRadius:8, flexShrink:0 }}>
                            <img src={company.logo_url} alt={company.company_name} style={{ width:70, height:35, objectFit:"contain" }} />
                          </div>
                        </div>
                        <p style={{ fontSize:14, color:"#6b7280", marginTop:10 }}>{job.short_description}</p>
                        <div style={{ fontSize:13, color:"#9ca3af", marginTop:10, display:"flex", justifyContent:"space-between" }}>
                          <span>{job.post_date}</span>
                          <span style={{ display:"flex", gap:6, alignItems:"center" }}><FaRegBookmark /> Save</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>}
          </div>
        </div>

        {/* Right - Featured Companies */}
        <div style={{ flex:"0 1 280px" }}>
          <div style={{ background:"#fff", borderRadius:8, padding:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontWeight:700, fontSize:18, marginBottom:12 }}>Check out Jobs from Featured Companies</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {featured.map(c => (
                <Link key={c._id} to={`/company/${c.slug}`}>
                  <div style={{ background:"#fff", padding:16, borderRadius:8, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                      <div style={{ border:"1px solid #e5e7eb", padding:6, borderRadius:8 }}>
                        <img src={c.logo_url} alt={c.company_name} style={{ width:80, height:32, objectFit:"contain" }} />
                      </div>
                      <div>
                        <h3 style={{ fontWeight:700, fontSize:15 }}>{c.company_name}</h3>
                        <div style={{ fontSize:12, color:"#9ca3af", display:"flex", gap:4, alignItems:"center", marginTop:2 }}>
                          <FaStar style={{ color:"#facc15" }}/>{c.rating} | {c.reviews} Reviews
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
