import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";

const input = { border: "1px solid #d1d5db", padding: "10px 12px", borderRadius: 6, fontSize: 15, width: "100%", outline: "none", fontFamily: "inherit" };

export default function AddCompanyForm() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    company_name: "", logo_url: "", rating: "", reviews: "",
    description: "", short_description: "", tags: [""], featured: false,
  });

  const set = (name, value) => {
    setFormData(p => ({ ...p, [name]: value }));
    if (name === "logo_url") setPreview(value);
  };
  const setTag = (i, v) => { const t = [...formData.tags]; t[i] = v; setFormData(p => ({ ...p, tags: t })); };
  const addTag = () => setFormData(p => ({ ...p, tags: [...p.tags, ""] }));
  const delTag = (i) => setFormData(p => ({ ...p, tags: p.tags.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/companies", { ...formData, tags: formData.tags.filter(Boolean) });
      toast.success("Company added successfully! 🎉");
      setFormData({ company_name:"", logo_url:"", rating:"", reviews:"", description:"", short_description:"", tags:[""], featured:false });
      setPreview("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Add New Company</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        <input style={input} placeholder="Company Name" value={formData.company_name}
          onChange={e => set("company_name", e.target.value)} required />

        <div>
          <input style={input} placeholder="Logo URL (https://...)" value={formData.logo_url}
            onChange={e => set("logo_url", e.target.value)} required />
          {preview && (
            <div style={{ marginTop: 8, border: "1px solid #e5e7eb", padding: 8, borderRadius: 6, display: "inline-block" }}>
              <img src={preview} alt="logo preview" style={{ height: 40, objectFit: "contain" }}
                onError={() => setPreview("")} />
            </div>
          )}
        </div>

        <input style={input} type="number" placeholder="Rating (0 - 5)" step="0.1" min="0" max="5"
          value={formData.rating} onChange={e => set("rating", e.target.value)} required />
        <input style={input} placeholder="Reviews (e.g. 45.3K)" value={formData.reviews}
          onChange={e => set("reviews", e.target.value)} required />
        <textarea style={{ ...input, minHeight: 60, resize: "vertical" }} placeholder="Short Description"
          value={formData.short_description} onChange={e => set("short_description", e.target.value)} />
        <textarea style={{ ...input, minHeight: 80, resize: "vertical" }} placeholder="Full Description"
          value={formData.description} onChange={e => set("description", e.target.value)} />

        {/* Tags */}
        <div>
          <label style={{ fontWeight: 600, fontSize: 14 }}>Tags</label>
          {formData.tags.map((tag, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input style={input} placeholder={`Tag ${i + 1}`} value={tag}
                onChange={e => setTag(i, e.target.value)} />
              {formData.tags.length > 1 &&
                <button type="button" onClick={() => delTag(i)}
                  style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "0 10px", cursor: "pointer" }}>✕</button>}
            </div>
          ))}
          <button type="button" onClick={addTag}
            style={{ marginTop: 8, background: "#f3f4f6", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 13 }}>
            + Add Tag
          </button>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 500 }}>
          <input type="checkbox" checked={formData.featured} onChange={e => set("featured", e.target.checked)} />
          Mark as Featured Company
        </label>

        <button type="submit" disabled={loading}
          style={{ background: "var(--primary)", color: "#fff", padding: "12px 0", borderRadius: 6, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Adding..." : "Add Company"}
        </button>
      </form>
    </div>
  );
}
