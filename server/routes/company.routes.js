const router = require("express").Router();
const Company = require("../models/Company");
const slugify = require("slugify");
const { verifyToken } = require("../middleware/auth.middleware");

const makeSlug = (name) =>
  slugify(name, { lower: true, strict: true });

// GET /api/companies — all companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json({ companies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/companies/featured — only featured
router.get("/featured", async (req, res) => {
  try {
    const companies = await Company.find({ featured: true }).sort({ createdAt: -1 });
    res.json({ companies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/companies/:slug
router.get("/:slug", async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/companies — add company (protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { company_name, logo_url, rating, reviews, tags, description, short_description, featured } = req.body;
    if (!company_name || !logo_url)
      return res.status(400).json({ message: "Name and logo are required" });

    const slug = makeSlug(company_name);
    const exists = await Company.findOne({ slug });
    if (exists) return res.status(400).json({ message: "Company with this name already exists" });

    const company = await Company.create({
      company_name, slug, logo_url,
      rating:            Number(rating) || 0,
      reviews:           reviews || "0",
      tags:              Array.isArray(tags) ? tags.filter(Boolean) : [],
      description:       description || "",
      short_description: short_description || "",
      featured:          featured || false,
    });
    res.status(201).json({ company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/companies/:id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
