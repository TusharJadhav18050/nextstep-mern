const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job:        { type: mongoose.Schema.Types.ObjectId, ref: "Job",  required: true },
    applicant:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score:      { type: Number, default: 0 },
    suggestions: [{ type: String }],
    resumeText: { type: String, default: "" },
    resumeFile: { type: String, default: "" }, // stores filename e.g. resume_1234567890.pdf
    resumeFile:     { type: String, default: "" },  // Cloudinary URL
    resumePublicId: { type: String, default: "" },  // Cloudinary public_id
    status:     { type: String, enum: ["applied", "reviewed", "shortlisted", "rejected"], default: "applied" },
  },
  { timestamps: true }
);

// One application per job per user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);