# CareFlow AI - Production Deployment Guide

This guide provides end-to-end instructions for deploying CareFlow AI across Vercel (Frontend), Render (Backend), and Supabase (PostgreSQL Database).

---

## 1. Database Deployment (Supabase PostgreSQL)

1. **Create Supabase Project**:
   - Go to [Supabase](https://supabase.com) and create a new project.
   - Choose your preferred cloud region and secure database password.

2. **Run Initial Schema Migration**:
   - In your Supabase Dashboard, navigate to **SQL Editor** (`/project/<id>/sql`).
   - Open and copy the contents of `database/migrations/001_initial_schema.sql`.
   - Paste into the query editor and click **Run**.
   - Verify that all 24 operational tables (e.g. `patients`, `beds`, `doctors`, `tasks`, `approvals`, `inventory_items`, `ambulances`, `audit_logs`) are created.

3. **Populate Synthetic Seed Data**:
   - In SQL Editor, open a new tab.
   - Copy the contents of `database/seed/seed.sql` and click **Run**.
   - This populates demo hospital departments, bed pods, synthetic patients, emergency supplies, and ambulances.

4. **Obtain Supabase Connection Credentials**:
   - Go to **Project Settings** → **API**.
   - Copy:
     - `Project URL` → Set as `SUPABASE_URL`
     - `anon public` key → Set as `SUPABASE_ANON_KEY`
     - `service_role secret` key → Set as `SUPABASE_SERVICE_ROLE_KEY` (Backend ONLY!)

---

## 2. Backend Deployment (Render)

1. **Create New Web Service**:
   - Sign in to [Render](https://render.com).
   - Click **New** → **Web Service** and connect your GitHub repository.
   - Specify the root directory as `careflow-ai/backend`.

2. **Build & Runtime Settings**:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (or `node dist/server.js`)
   - **Health Check Path**: `/api/health`

3. **Configure Backend Environment Variables** (Render Dashboard → Environment):
   ```env
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-careflow-frontend.vercel.app

   # Google Gemini API (Backend Only)
   GEMINI_API_KEY=your_google_gemini_api_key

   # Supabase Configuration (Backend Only)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Government Open Data API (data.gov.in)
   GOV_DATA_API_KEY=your_gov_api_key_optional
   ```

4. **Deploy & Verify**:
   - Click **Create Web Service**.
   - Once deployed, visit `https://<your-render-service>.onrender.com/api/health`.
   - Verify it responds with `{ status: "healthy", system: "CareFlow AI..." }`.

---

## 3. Frontend Deployment (Vercel)

1. **Import Repository in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com) and click **Add New** → **Project**.
   - Select your CareFlow AI repository.
   - Set **Root Directory** to `careflow-ai/frontend`.

2. **Framework Preset & Build Commands**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Configure Environment Variables**:
   ```env
   VITE_API_URL=https://<your-render-service>.onrender.com/api
   ```
   > [!IMPORTANT]
   > NEVER add `GEMINI_API_KEY`, Supabase secret keys, or database credentials to Vercel environment variables. All AI parsing and database access are strictly routed through the Render Express backend.

4. **SPA Rewrite Configuration**:
   Vercel will serve `index.html` for client-side routing. A `vercel.json` file in `frontend/` ensures all paths route cleanly to `/index.html`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 4. Verification Checklist

- [x] `GET /api/health` returns `healthy` status.
- [x] Frontend landing page (`/`) loads without login.
- [x] Dashboard (`/dashboard`) shows live patient count, bed occupancy, and low-stock telemetry.
- [x] AI Command Center (`/ai-command-center`) successfully processes:
  - `"Admit patient Rahul Sharma to Cardiology."`
  - `"Schedule a health checkup for Rahul."` (correctly prompts missing department/time)
  - `"Check which inventory items are below minimum stock."`
- [x] Hospital Network directory loads and displays source attribution from Open Government Data (`data.gov.in`).
