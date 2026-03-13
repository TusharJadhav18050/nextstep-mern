# 🚀 NextStep — MERN Stack Intelligent Recruitment Platform

Converted from Next.js + Firebase to **React.js + Node.js + Express + MongoDB** with real NLP resume scoring.

---

## 📁 Project Structure

```
nextstep/
├── server/          ← Node.js + Express + MongoDB backend
│   ├── index.js
│   ├── .env
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   └── Job.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── company.routes.js
│   │   ├── job.routes.js
│   │   └── resume.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   └── utils/
│       └── nlpScorer.js     ← TF-IDF + Cosine Similarity NLP
│
└── client/          ← React.js frontend (same UI as original)
    ├── public/
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        └── utils/
```

---

## ⚙️ Setup Instructions

### Step 1 — Prerequisites
- Node.js v18+ installed
- MongoDB running locally OR MongoDB Atlas account

### Step 2 — Setup Backend (Server)

```bash
cd server
npm install
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/nextstep
JWT_SECRET=nextstep_super_secret_key_2025
CLIENT_URL=http://localhost:3000
```

Start the server:
```bash
npm run dev     # development (with nodemon)
npm start       # production
```

Server runs on: **http://localhost:5000**

---

### Step 3 — Setup Frontend (Client)

```bash
cd client
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | Get all jobs |
| GET | /api/jobs/:slug | Get single job |
| GET | /api/jobs/categories | Get all categories |
| POST | /api/jobs | Add new job (auth required) |
| DELETE | /api/jobs/:id | Delete job (auth required) |

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/companies | Get all companies |
| GET | /api/companies/featured | Get featured companies |
| GET | /api/companies/:slug | Get single company |
| POST | /api/companies | Add company (auth required) |
| DELETE | /api/companies/:id | Delete company (auth required) |

### Resume NLP
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/resume/analyze?job_slug=xxx | Upload & analyze resume |

---

## 🤖 NLP Resume Scoring

The resume analysis uses real **TF-IDF + Cosine Similarity** (not random!):

1. Resume file (PDF/DOCX) → text extraction
2. Job description → tokenized
3. Both texts → TF-IDF vectors
4. Cosine similarity → score 0-100
5. Personalized suggestions based on score

---

## 📄 Pages

| Page | Route |
|------|-------|
| Home | / |
| Jobs (with filters) | /jobs |
| Job Detail + Resume Upload | /job/:slug |
| Companies | /companies |
| Company Profile + Jobs | /company/:slug |
| Login | /login |
| Register | /register |
| Add Job | /add-job |
| Add Company | /add-company |
| About Us | /about-us |
| Contact | /contact-us |
| Privacy Policy | /privacy-policy |
| Terms | /terms-conditions |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6 |
| Styling | Tailwind-equivalent inline styles + CSS vars |
| UI Libraries | Swiper.js, Lottie-React, React Icons, React Hot Toast, React Loading Skeleton |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| NLP | natural (TF-IDF + Cosine Similarity) |
| File Parsing | pdf-parse, mammoth |

---

## 🌐 Deployment

### Backend → Render.com
1. Push `server/` folder to GitHub
2. New Web Service on render.com
3. Build: `npm install` | Start: `npm start`
4. Add env vars: MONGO_URI, JWT_SECRET, CLIENT_URL, PORT

### Frontend → Vercel
1. Push `client/` folder to GitHub
2. New Project on vercel.com
3. Add env: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

---

All rights reserved © 2025 NextStep
