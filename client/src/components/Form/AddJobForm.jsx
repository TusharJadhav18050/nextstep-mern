import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";

const input = { border: "1px solid #d1d5db", padding: "10px 12px", borderRadius: 6, fontSize: 15, width: "100%", outline: "none", fontFamily: "inherit" };

export default function AddJobForm() {
  const [companies,  setCompanies]  = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [formData, setFormData] = useState({
    title: "", experience: "", salary: "", job_location: "",
    short_description: "", about_the_role: "",
    key_responsibilities: [""], qualifications: [""],
    category: "", company_id: "",
  });

  useEffect(() => {
    api.get("/companies").then(r => setCompanies(r.data.companies)).catch(console.error);
    api.get("/jobs/categories").then(r => setCategories(r.data.categories)).catch(console.error);
  }, []);

  const set = (name, value) => setFormData(p => ({ ...p, [name]: value }));
  const setArr = (field, idx, val) => {
    const a = [...formData[field]]; a[idx] = val;
    setFormData(p => ({ ...p, [field]: a }));
  };
  const addArr  = (field) => setFormData(p => ({ ...p, [field]: [...p[field], ""] }));
  const delArr  = (field, idx) => setFormData(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_id) { toast.error("Please select a company"); return; }
    setLoading(true);
    try {
      await api.post("/jobs", {
        ...formData,
        key_responsibilities: formData.key_responsibilities.filter(Boolean),
        qualifications: formData.qualifications.filter(Boolean),
      });
      toast.success("Job added successfully! 🎉");
      setFormData({ title:"", experience:"", salary:"", job_location:"", short_description:"",
        about_the_role:"", key_responsibilities:[""], qualifications:[""], category:"", company_id:"" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Add New Job</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input style={input} placeholder="Job Title"      value={formData.title}       onChange={e => set("title", e.target.value)} required />
        <input style={input} placeholder="Experience (e.g. 2 - 5 Yrs)" value={formData.experience} onChange={e => set("experience", e.target.value)} required />
        <input style={input} placeholder="Salary (e.g. 8 - 15 LPA)"   value={formData.salary}     onChange={e => set("salary", e.target.value)} required />
        <input style={input} placeholder="Job Location"  value={formData.job_location} onChange={e => set("job_location", e.target.value)} required />
        <textarea style={{ ...input, minHeight: 80, resize: "vertical" }} placeholder="Short Description" value={formData.short_description} onChange={e => set("short_description", e.target.value)} required />
        <textarea style={{ ...input, minHeight: 80, resize: "vertical" }} placeholder="About the Role"    value={formData.about_the_role}    onChange={e => set("about_the_role", e.target.value)} required />

        {/* Key Responsibilities */}
        <div>
          <label style={{ fontWeight: 600, fontSize: 14 }}>Key Responsibilities</label>
          {formData.key_responsibilities.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input style={{ ...input }} placeholder={`Responsibility ${i + 1}`} value={r}
                onChange={e => setArr("key_responsibilities", i, e.target.value)} />
              {formData.key_responsibilities.length > 1 &&
                <button type="button" onClick={() => delArr("key_responsibilities", i)}
                  style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "0 10px", cursor: "pointer" }}>✕</button>}
            </div>
          ))}
          <button type="button" onClick={() => addArr("key_responsibilities")}
            style={{ marginTop: 8, background: "#f3f4f6", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 13 }}>
            + Add Responsibility
          </button>
        </div>

        {/* Qualifications */}
        <div>
          <label style={{ fontWeight: 600, fontSize: 14 }}>Qualifications</label>
          {formData.qualifications.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input style={input} placeholder={`Qualification ${i + 1}`} value={q}
                onChange={e => setArr("qualifications", i, e.target.value)} />
              {formData.qualifications.length > 1 &&
                <button type="button" onClick={() => delArr("qualifications", i)}
                  style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "0 10px", cursor: "pointer" }}>✕</button>}
            </div>
          ))}
          <button type="button" onClick={() => addArr("qualifications")}
            style={{ marginTop: 8, background: "#f3f4f6", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 13 }}>
            + Add Qualification
          </button>
        </div>

        {/* Select Company */}
        <select style={input} value={formData.company_id} onChange={e => set("company_id", e.target.value)} required>
          <option value="">Select Company</option>
          {companies.map(c => <option key={c._id} value={c._id}>{c.company_name}</option>)}
        </select>

        {/* Category (free text or from existing) */}
        <input style={input} placeholder="Category (e.g. Engineering, Marketing)"
          value={formData.category} onChange={e => set("category", e.target.value)}
          list="categories-list" />
        <datalist id="categories-list">
          {categories.map((c, i) => <option key={i} value={c} />)}
        </datalist>

        <button type="submit" disabled={loading}
          style={{ background: "var(--primary)", color: "#fff", padding: "12px 0", borderRadius: 6, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Adding..." : "Add Job"}
        </button>
      </form>
    </div>
  );
}
