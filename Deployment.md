# CareFlow AI — Quick Deployment Checklist

This document summarizes deployment steps for CareFlow AI across Vercel (Frontend), Render (Backend), and Supabase (PostgreSQL Database).

For comprehensive explanations, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

---

## 1. Supabase (Database)
1. Create a Supabase project at https://supabase.com.
2. In SQL Editor, run `supabase/migrations/001_initial_schema.sql`.
3. In SQL Editor, run `supabase/seed/seed.sql` to populate synthetic operational data.
4. Copy `SUPABASE_URL` and `SUPABASE_ANON_KEY` to backend environment variables.

---

## 2. Render (Backend)
1. Create a Web Service connected to this repository with root directory `backend`.
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `FRONTEND_URL=https://<your-app>.vercel.app`
   - `AI_PROVIDER=gemini`
   - `AI_FALLBACK_PROVIDER=groq`
   - `GEMINI_API_KEY=<your-key>`
   - `GROQ_API_KEY=<your-key>`
   - `SUPABASE_URL=<supabase-url>`
   - `SUPABASE_ANON_KEY=<supabase-key>`
   - `GOV_DATA_API_KEY=<gov-key>`

---

## 3. Vercel (Frontend)
1. Import repository on Vercel with root directory `frontend`.
2. Framework: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set Environment Variable:
   - `VITE_API_URL=https://<your-render-service>.onrender.com/api`

---

## 4. Verification Check
- Health: `GET https://<your-backend>.onrender.com/api/health`
- AI Command: `POST https://<your-backend>.onrender.com/api/ai/command`
