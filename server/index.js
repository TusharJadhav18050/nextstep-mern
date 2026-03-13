const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth",      require("./routes/auth.routes"));
app.use("/api/jobs",      require("./routes/job.routes"));
app.use("/api/companies", require("./routes/company.routes"));
app.use("/api/resume",    require("./routes/resume.routes"));

// ── MongoDB ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 10000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
