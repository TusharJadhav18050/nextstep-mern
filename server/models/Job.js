const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title:             { type: String, required: true },
    slug:              { type: String, required: true, unique: true },
    experience:        { type: String, required: true },
    salary:            { type: String, required: true },
    job_location:      { type: String, required: true },
    short_description: { type: String, required: true },
    about_the_role:    { type: String, default: "" },
    key_responsibilities: [{ type: String }],
    qualifications:    [{ type: String }],
    post_date:         { type: String },
    category:          { type: String, default: "" },
    company:           { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
