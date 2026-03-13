const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    company_name:      { type: String, required: true, trim: true },
    slug:              { type: String, required: true, unique: true },
    logo_url:          { type: String, required: true },
    rating:            { type: Number, default: 0 },
    reviews:           { type: String, default: "0" },
    tags:              [{ type: String }],
    description:       { type: String, default: "" },
    short_description: { type: String, default: "" },
    featured:          { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
