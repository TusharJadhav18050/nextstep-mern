const router = require("express").Router();
const Job = require("../models/Job");
const Company = require("../models/Company");
const slugify = require("slugify");
const { verifyToken } = require("../middleware/auth.middleware");

const makeSlug = (title, companyName) =>
  slugify(`${title}-${companyName}`, { lower: true, strict: true });

// GET /api/jobs — all jobs populated with company
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("company").sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/categories — unique categories
router.get("/categories", async (req, res) => {
  try {
    const cats = await Job.distinct("category");
    res.json({ categories: cats.filter(Boolean) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/:slug
router.get("/:slug", async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug }).populate("company");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs — add job (protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      title, experience, salary, job_location, short_description,
      about_the_role, key_responsibilities, qualifications,
      category, company_id,
    } = req.body;

    if (!title || !company_id)
      return res.status(400).json({ message: "Title and company are required" });

    const company = await Company.findById(company_id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const slug = makeSlug(title, company.company_name);

    const now = new Date();
    const post_date = now.toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });

    const job = await Job.create({
      title, slug, experience, salary, job_location,
      short_description, about_the_role,
      key_responsibilities: key_responsibilities || [],
      qualifications: qualifications || [],
      post_date, category: category || "",
      company: company._id,
    });

    const populated = await job.populate("company");
    res.status(201).json({ job: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
