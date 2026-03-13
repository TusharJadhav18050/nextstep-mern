import React, { useState } from "react";
import toast from "react-hot-toast";
const inp = { border:"1px solid #d1d5db", padding:"10px 12px", borderRadius:6, fontSize:15, width:"100%", outline:"none", fontFamily:"inherit" };
export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const handleSubmit = (e) => { e.preventDefault(); toast.success("Message sent! We will get back to you soon."); setForm({ name:"", email:"", message:"" }); };
  return (
    <div style={{ width:"80%", maxWidth:600, margin:"40px auto", background:"#fff", borderRadius:12, padding:40, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
      <h1 style={{ fontSize:32, fontWeight:700, color:"var(--primary)" }}>Contact Us</h1>
      <p style={{ color:"#6b7280", marginTop:8, marginBottom:28 }}>Have questions? We'd love to hear from you.</p>
      <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <input style={inp} placeholder="Your Name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required />
        <input style={inp} type="email" placeholder="Email Address" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required />
        <textarea style={{ ...inp, minHeight:120, resize:"vertical" }} placeholder="Your Message" value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} required />
        <button type="submit" style={{ background:"var(--primary)", color:"#fff", padding:"12px 0", borderRadius:6, fontWeight:700, fontSize:16, border:"none", cursor:"pointer" }}>
          Send Message
        </button>
      </form>
    </div>
  );
}
