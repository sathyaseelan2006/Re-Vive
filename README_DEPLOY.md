Deployment Guide — Re:Vive Indian Heritage Platform

This document explains how to deploy the project to a production environment.

Prerequisites
- Node.js 18+ and npm
- MongoDB (Atlas recommended) or connection string
- A hosting target for the frontend (Vercel, Netlify, or CDN) and backend (Render, DigitalOcean App Platform, VM)
- Environment variables set (see `.env.example`)

Quick deploy (recommended: Vercel + Render)
1. Frontend: Vercel
   - Create a new Vercel project linked to this repo and set the build command (if any) for the static frontend. Vite or your bundler should output to `dist/`.
   - Set environment variable `FRONTEND_ORIGIN` to your deployed frontend url in your backend.

   **Vercel automated deploy (recommended)**

   1. Create a new project on Vercel and link your GitHub repository.
   2. In your GitHub repository settings, add the following repository secrets (Settings → Secrets → Actions):
      - `VERCEL_TOKEN` — create a Personal Token from https://vercel.com/account/tokens
      - `VERCEL_ORG_ID` — from your Vercel organization settings
      - `VERCEL_PROJECT_ID` — from your Vercel project settings
      - `GEMINI_API_KEY` — server-side AI key (do NOT expose to client)
      - `MONGODB_URI` — your MongoDB Atlas connection string
      - `FRONTEND_ORIGIN` — e.g., `https://your-vercel-domain.vercel.app`

   3. The included GitHub Actions workflow (`.github/workflows/ci-deploy.yml`) runs on push to `main`, builds the project, and triggers a Vercel deploy using the secrets above.

   4. After the workflow succeeds, visit your Vercel project URL and verify the site. For backend hosting consider Render or a managed VM; set the same `GEMINI_API_KEY` and `MONGODB_URI` in the backend provider's environment secret settings.

2. Backend: Render (or other)
   - Create a new Web Service on Render, connect to GitHub repo and set the start command (e.g., `npm run start` in `backend/`)
   - Set environment variables on the Render dashboard: `MONGODB_URI`, `GEMINI_API_KEY`, `FRONTEND_ORIGIN`, and any provider tokens.

3. Secrets and tokens
   - Do NOT commit API keys. Use the hosting provider's secret management (Vercel/Render secrets / GitHub secrets for Actions).

4. CDN & assets
   - Host large assets (AR models, images) on a CDN or object store (S3 + CloudFront) and update asset URLs accordingly.

CI/CD
- A sample `.github/workflows/deploy.yml` is included to build the frontend and run linters/tests; configure to deploy to your provider using secrets.

Security notes
- Ensure `GEMINI_API_KEY` is only set on the server and never exposed to clients.
- Use HTTPS in production and enforce HSTS.

Troubleshooting
- If the chatbot returns 500: check server logs for GEMINI API errors and ensure the model name is allowed for your key.
- If TTS playback fails for Tamil on some devices: server-side TTS is recommended for consistent quality.

Further automation
- If you want, I can add a GitHub Actions workflow to automatically deploy to Render/Vercel when pushing to `main` once you provide the provider API key as a repository secret.
