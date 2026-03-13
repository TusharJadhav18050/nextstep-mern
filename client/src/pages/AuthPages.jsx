// LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const inp = { border:"1px solid #d1d5db", padding:"10px 12px", borderRadius:6, fontSize:15, width:"100%", outline:"none", fontFamily:"inherit" };

export function LoginPage() {
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
if (data.user.role === "recruiter") {
  navigate("/recruiter-dashboard");
} else {
  navigate("/my-dashboard");
}
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:420, background:"#fff", borderRadius:12, padding:32, boxShadow:"0 4px 20px rgba(0,0,0,0.10)" }}>
        <h1 style={{ fontSize:28, fontWeight:700, color:"var(--primary)", marginBottom:8 }}>NextStep</h1>
        <p style={{ color:"#6b7280", marginBottom:24, fontSize:15 }}>Sign in to your account</p>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <input style={inp} type="email" placeholder="Email address" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required />
          <input style={inp} type="password" placeholder="Password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required />
          <button type="submit" disabled={loading}
            style={{ background:"var(--primary)", color:"#fff", padding:"12px 0", borderRadius:6, fontWeight:700, fontSize:16, border:"none", cursor:"pointer", opacity:loading?0.6:1 }}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p style={{ textAlign:"center", marginTop:20, fontSize:14, color:"#6b7280" }}>
          Don't have an account? <Link to="/register" style={{ color:"var(--primary)", fontWeight:600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"seeker" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.token, data.user);
     toast.success(`Welcome to NextStep, ${data.user.name}! 🎉`);
if (data.user.role === "recruiter") {
  navigate("/recruiter-dashboard");
} else {
  navigate("/my-dashboard");
}
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:440, background:"#fff", borderRadius:12, padding:32, boxShadow:"0 4px 20px rgba(0,0,0,0.10)" }}>
        <h1 style={{ fontSize:28, fontWeight:700, color:"var(--primary)", marginBottom:8 }}>NextStep</h1>
        <p style={{ color:"#6b7280", marginBottom:24, fontSize:15 }}>Create your account</p>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <input style={inp} type="text" placeholder="Full Name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required />
          <input style={inp} type="email" placeholder="Email address" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required />
          <input style={inp} type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} minLength={6} required />
          <select style={inp} value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
            <option value="seeker">Job Seeker</option>
            <option value="recruiter">Recruiter / Company</option>
          </select>
          <button type="submit" disabled={loading}
            style={{ background:"var(--secondary)", color:"#fff", padding:"12px 0", borderRadius:6, fontWeight:700, fontSize:16, border:"none", cursor:"pointer", opacity:loading?0.6:1 }}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p style={{ textAlign:"center", marginTop:20, fontSize:14, color:"#6b7280" }}>
          Already have an account? <Link to="/login" style={{ color:"var(--primary)", fontWeight:600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
