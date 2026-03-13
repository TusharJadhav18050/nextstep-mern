import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { RiMoneyEuroBoxFill } from "react-icons/ri";
import { MdOutlineContactPage } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import ResumeUpload from "../components/Resume/ResumeUpload";
import CampusBanner from "../components/Statics/CampusBanner";
import api from "../utils/api";

export default function JobDetailPage() {
  const { slug } = useParams();
  const [job,      setJob]      = useState(null);
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/jobs/${slug}`), api.get("/companies/featured")])
      .then(([j, f]) => { setJob(j.data.job); setFeatured(f.data.companies); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ width:"80%", margin:"0 auto", padding:"40px 0", display:"flex", gap:20, flexWrap:"wrap" }}>
      <div style={{ flex:"1 1 400px", display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ background:"#fff", borderRadius:8, padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <Skeleton height={28} width="60%" /><Skeleton height={16} width="40%" style={{marginTop:8}} />
          <Skeleton count={3} style={{marginTop:12}} />
        </div>
        <div style={{ background:"#fff", borderRadius:8, padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <Skeleton height={20} width={150} /><Skeleton count={2} style={{marginTop:8}} />
          <Skeleton height={40} style={{marginTop:8}} />
        </div>
      </div>
      <div style={{ flex:"0 1 320px" }}>
        <div style={{ background:"#fff", borderRadius:8, padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <Skeleton height={24} width="70%" style={{marginBottom:12}} />
          {Array(3).fill(0).map((_, i) => <div key={i} style={{display:"flex", gap:12, marginBottom:12, alignItems:"center"}}><Skeleton width={80} height={40}/><div style={{flex:1}}><Skeleton height={18}/><Skeleton height={14} width="60%" style={{marginTop:4}}/></div></div>)}
        </div>
      </div>
    </div>
  );

  if (!job) return (
    <div style={{ width:"80%", margin:"40px auto", background:"#fff", borderRadius:8, padding:24, textAlign:"center", color:"#9ca3af" }}>
      Job not found.
    </div>
  );

  const company = job.company;

  return (
    <div style={{ width:"100%", maxWidth:"80%", margin:"0 auto", padding:"16px 0 40px" }}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:20 }}>

        {/* Left Column */}
        <div style={{ flex:"1 1 400px", display:"flex", flexDirection:"column", gap:16 }}>

          {/* Job Header Card */}
          <div style={{ background:"#fff", borderRadius:8, padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ flex:1 }}>
                <h1 style={{ fontSize:"clamp(18px,3vw,24px)", fontWeight:700 }}>{job.title}</h1>
                <div style={{ display:"flex", gap:8, alignItems:"center", fontSize:14, color:"#6b7280", marginTop:8 }}>
                  <span style={{ fontWeight:500 }}>{company?.company_name}</span>
                  <span>|</span>
                  {company?.rating && (
                    <div style={{ color:"#facc15", display:"flex", alignItems:"center", gap:4 }}>
                      <FaStar size={14} />
                      <span style={{ color:"#6b7280" }}>{company.rating} ({company.reviews})</span>
                    </div>
                  )}
                </div>
              </div>
              {company?.logo_url && (
                <img src={company.logo_url} alt={company.company_name} style={{ width:120, height:40, objectFit:"contain" }} />
              )}
            </div>

            <div style={{ display:"flex", flexWrap:"wrap", gap:16, marginTop:16, color:"#6b7280", fontSize:15 }}>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><FaMapMarkerAlt />{job.job_location}</span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><RiMoneyEuroBoxFill size={18}/>{job.salary} LPA</span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><MdOutlineContactPage size={18}/>Experience: {job.experience} Yrs</span>
            </div>
            <p style={{ marginTop:16, fontSize:15, color:"#374151", lineHeight:1.7 }}>{job.short_description}</p>
            <p style={{ marginTop:8, fontSize:13, color:"#9ca3af" }}>Posted on: {job.post_date}</p>
          </div>

          {/* Resume Upload with NLP */}
          <div style={{ background:"#fff", borderRadius:8, padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontWeight:700, fontSize:18 }}>Upload Your Resume</h2>
            <p style={{ color:"#6b7280", fontSize:14, marginTop:4 }}>Our AI will score your resume against this job</p>
            <ResumeUpload jobSlug={slug} />
          </div>

          {/* About the Job */}
          <div style={{ background:"#fff", borderRadius:8, padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontWeight:700, fontSize:18 }}>About the Job</h2>
            <p style={{ color:"#6b7280", fontSize:14, marginTop:8, lineHeight:1.7 }}>{job.about_the_role}</p>

            {job.key_responsibilities?.length > 0 && <>
              <h2 style={{ fontWeight:700, fontSize:18, marginTop:20 }}>Key Responsibilities</h2>
              <ul style={{ color:"#6b7280", fontSize:14, marginTop:8, paddingLeft:20, display:"flex", flexDirection:"column", gap:6 }}>
                {job.key_responsibilities.map((k, i) => <li key={i}>{k}</li>)}
              </ul>
            </>}

            {job.qualifications?.length > 0 && <>
              <h2 style={{ fontWeight:700, fontSize:18, marginTop:20 }}>Qualifications</h2>
              <ul style={{ color:"#6b7280", fontSize:14, marginTop:8, paddingLeft:20, display:"flex", flexDirection:"column", gap:6 }}>
                {job.qualifications.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </>}
          </div>
        </div>

        {/* Right Column - Featured Companies */}
        <div style={{ flex:"0 1 300px" }}>
          <div style={{ background:"#fff", borderRadius:8, padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", position:"sticky", top:16 }}>
            <h2 style={{ fontWeight:700, fontSize:18, marginBottom:16 }}>Check out Jobs from Featured Companies</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {featured.map(c => (
                <Link key={c._id} to={`/company/${c.slug}`}>
                  <div style={{ background:"#fff", padding:16, borderRadius:8, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                      <div style={{ border:"1px solid #e5e7eb", padding:6, borderRadius:8 }}>
                        <img src={c.logo_url} alt={c.company_name} style={{ width:80, height:36, objectFit:"contain" }} />
                      </div>
                      <div>
                        <h3 style={{ fontWeight:700, fontSize:16 }}>{c.company_name}</h3>
                        <div style={{ fontSize:13, color:"#9ca3af", display:"flex", gap:4, alignItems:"center", marginTop:2 }}>
                          <FaStar style={{ color:"#facc15" }} />{c.rating} | {c.reviews} Reviews
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

      <div style={{ marginTop:40 }}><CampusBanner /></div>
    </div>
  );
}
