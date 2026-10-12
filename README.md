# Kampus.VC — AI Content Creator Marketplace

A responsive full-stack prototype with React + Vite frontend and Express backend. The API uses MongoDB when `MONGODB_URI` is configured, and falls back to in-memory sample data for a quick demo.

## Requirements
- Node.js 18+
- npm
- Optional: MongoDB local or Atlas URI

## 1. Install dependencies
Open a terminal in this folder:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API runs at `http://localhost:5000`.

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## 2. MongoDB (optional)
Add your MongoDB connection string to `backend/.env`:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/kampus_vc
PORT=5000
```
Restart the backend. Without a URI, the app works with in-memory demo data. In-memory data resets when the server restarts.

## Included
- Creator search by name, skill, tool, specialty, and content type
- Specialty/content-type filters and empty states
- Creator portfolio profile modal
- Brief creation form with aspect ratio, deadline, budget, usage rights, and revisions
- Demo AI brief builder (template-based, no paid AI API required)
- Dashboard with saved briefs and status
- Responsive dark charcoal / acid-lime / violet design

## API routes
- `GET /api/health`
- `GET /api/creators?q=&specialization=&contentType=&tool=`
- `GET /api/creators/:id`
- `GET /api/briefs`
- `POST /api/briefs`
- `POST /api/briefs/assist` — turns a rough idea into a structured draft
- `PATCH /api/briefs/:id/status`

## Notes
This is a hackathon prototype, not a production deployment. Authentication, file uploads, payment processing, email notifications, and legal review of licensing terms are not implemented. Verification labels on sample creators are demo data and do not represent real verification.
