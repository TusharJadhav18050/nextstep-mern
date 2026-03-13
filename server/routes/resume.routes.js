const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { scoreResume } = require("../utils/nlpScorer");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { verifyToken } = require("../middleware/auth.middleware");

// ── Multer — local disk storage ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `resume_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error("Only PDF, DOC, DOCX files are allowed"));
  },
});

// ── Extract text ─────────────────────────────────────────────────────────────
async function extractText(filePath, ext) {
  if (ext === ".pdf") {
    const buf = fs.readFileSync(filePath);
    const data = await pdfParse(buf);
    return data.text;
  }
  if (ext === ".docx" || ext === ".doc") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  return "";
}

// ── POST /api/resume/analyze ─────────────────────────────────────────────────
router.post("/analyze", verifyToken, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const ext        = path.extname(req.file.originalname).toLowerCase();
    const resumeText = await extractText(req.file.path, ext);
    const resumeFile = req.file.filename; // e.g. resume_1234567890.pdf

    if (!resumeText.trim())
      return res.status(400).json({ message: "Could not extract text from resume" });

    let jobText = "";
    let jobId   = null;
    const { job_slug } = req.query;

    if (job_slug) {
      const job = await Job.findOne({ slug: job_slug });
      if (job) {
        jobId   = job._id;
        jobText = [
          job.title, job.short_description, job.about_the_role,
          ...(job.key_responsibilities || []),
          ...(job.qualifications || []),
          job.category,
        ].join(" ");
      }
    }

    if (!jobText)
      jobText = "skills experience developer engineer software technical programming";

    const { score, suggestions } = scoreResume(resumeText, jobText);

    if (jobId && req.user?.id) {
      await Application.findOneAndUpdate(
        { job: jobId, applicant: req.user.id },
        {
          job:        jobId,
          applicant:  req.user.id,
          score,
          suggestions,
          resumeText: resumeText.substring(0, 1000),
          resumeFile: resumeFile,
          status:     "applied",
        },
        { upsert: true, new: true }
      );
    }

    res.json({ score, suggestions, resumeLength: resumeText.length });
  } catch (err) {
    res.status(500).json({ message: "Analysis failed", error: err.message });
  }
});

// ── GET /api/resume/download/:applicationId ──────────────────────────────────
router.get("/download/:applicationId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "recruiter")
      return res.status(403).json({ message: "Only recruiters can download resumes" });

    const app = await Application.findById(req.params.applicationId)
      .populate("applicant", "name");

    if (!app)            return res.status(404).json({ message: "Application not found" });
    if (!app.resumeFile) return res.status(404).json({ message: "No resume file found" });

    const filePath = path.join(__dirname, "../uploads", app.resumeFile);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "Resume file not found on server" });

    const candidateName = (app.applicant?.name || "candidate").replace(/\s+/g, "_");
    const ext           = path.extname(app.resumeFile);

    res.setHeader("Content-Disposition", `attachment; filename="${candidateName}_resume${ext}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/resume/my-applications ─────────────────────────────────────────
router.get("/my-applications", verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({ path: "job", populate: { path: "company" } })
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/resume/all-applicants ───────────────────────────────────────────
router.get("/all-applicants", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "recruiter")
      return res.status(403).json({ message: "Only recruiters can view applicants" });
    const applications = await Application.find()
      .populate("applicant", "name email")
      .populate({ path: "job", populate: { path: "company" } })
      .sort({ score: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/resume/status/:applicationId ──────────────────────────────────
router.patch("/status/:applicationId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "recruiter")
      return res.status(403).json({ message: "Only recruiters can update status" });
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.applicationId, { status }, { new: true }
    )
      .populate("applicant", "name email")
      .populate({ path: "job", populate: { path: "company" } });
    res.json({ application: app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;