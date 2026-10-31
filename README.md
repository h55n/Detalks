# DeTalks

DeTalks is a mobile-first mental wellness app for students in India. React, Vite and TypeScript on the front, an Express API and PostgreSQL on the back. Live prototype: https://detalks.vercel.app

The tone is calm and non-clinical: warm cream background, forest green, serif headings.

**DeTalks is a wellness companion, not a medical or crisis service.** In crisis, call Tele-MANAS 14416 (free, 24/7) or 112.

## What is in the app

- Email sign-up with an anonymous alias; shared-circle writes require email verification
- Password reset by email with single-use links; resets sign out every other session (live once a sending domain is configured)
- Durable, database-backed rate limiting on the auth endpoints
- Onboarding, consent and a daily pulse check
- Mood tracker, journal and a progress view built from real activity
- Breathing and grounding exercises, plus a practices library
- Talk: text sessions with Disha, an AI companion. Kavach, a safety guardian, screens every message and answers crisis language with verified Indian helplines instead of the model
- Anonymous community circles, also screened by Kavach
- Your data: download everything as JSON, or delete the account for good
- Professional help page with verified helplines
- Installable as a PWA

All screens live in `artifacts/detalks/src/pages`.

## Repository layout

```
artifacts/detalks        React + Vite + Tailwind web app (wouter routing, framer-motion)
artifacts/api-server     Express 5 API: auth, moods, journal, progress, sessions, circles
artifacts/mockup-sandbox Component preview sandbox
lib/api-spec             OpenAPI spec
lib/api-zod              Generated Zod schemas
lib/api-client-react     Generated API hooks
lib/db                   PostgreSQL schema (Drizzle) and hand-written migrations
scripts                  Workspace scripts
```

## Run it locally

This is a pnpm workspace. Use pnpm, because `npm install` is blocked by the preinstall script.

```bash
pnpm install
pnpm run typecheck

# API (needs a PostgreSQL connection string)
DATABASE_URL=postgres://... PORT=8080 pnpm --filter @workspace/api-server run dev

# Web app (proxies /api to localhost:8080)
pnpm --filter detalks run dev
```

`pnpm run build` typechecks and builds every package. `pnpm --filter @workspace/api-server test` runs the API test suite against an in-memory Postgres (PGlite). The server applies pending migrations on boot.

## Environment

- `DATABASE_URL` — PostgreSQL connection string (required)
- `GROQ_API_KEY`, `GROQ_MODEL` - Groq Disha and additive Kavach screening (server-side secrets only)
- `APP_ORIGIN`, `RESEND_API_KEY`, `VERIFICATION_FROM` - email verification and password reset, requiring a verified sending domain
- `DATABASE_CA_CERT` - optional managed-Postgres CA (PEM); upgrades the database connection to full TLS chain verification
- `HF_TOKEN` — Hugging Face inference token for Disha's replies (optional)
- `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` — any OpenAI-compatible provider instead of Hugging Face (optional). Without a key Disha answers with a theme-aware reflective listener
- `PORT` — listen port (required)
- `CORS_ORIGIN` — only needed if the frontend is served from another origin

## Deployment

The current live app uses Vercel, with `vercel.json` building the web app and serverless Express API. Set server-side environment variables in the Vercel project; GitHub main is linked to production.

Alternative: `render.yaml` deploys the whole app as one free Render web service: it builds the frontend, bundles the API, and serves both from a single origin. Provision a free Postgres, set `DATABASE_URL` (and `HF_TOKEN`), done.

See [RELEASE-CHECKLIST.md](./RELEASE-CHECKLIST.md) for current launch gates. This is a working pilot, not a clinically validated production service.

## Contribution split

Contribution plan (50/50): Hassan Rehman focuses on the frontend and UI; Mrunmayee Daware focuses on the remaining software work, including backend/API, integrations, testing, and documentation.

## License

MIT
