# DeTalks

DeTalks is a mobile-first mental wellness app prototype for students in India. It is built with React, Vite and TypeScript, with an Express API in the same repository. Live prototype: https://detalks.vercel.app

The tone is calm and non-clinical: warm cream background, forest green, serif headings.

## Status

This is a prototype. The frontend covers the full flow. The API currently exposes only a health route, so screens run on local and seeded data. Do not treat it as a medical or crisis service.

## What is in the app

- Onboarding, consent and a daily pulse check
- Mood tracker, journal and progress view
- Breathing and grounding exercises, plus a practices library
- Talk: text sessions with supervised companions, session history and reflection
- Community circles
- Professional help and resources
- Installable as a PWA

All screens live in `artifacts/detalks/src/pages`.

## Repository layout

```
artifacts/detalks        React + Vite + Tailwind web app (wouter routing, framer-motion)
artifacts/api-server     Express 5 API (pino logging), health route only for now
artifacts/mockup-sandbox Component preview sandbox
lib/api-spec             OpenAPI spec
lib/api-zod              Generated Zod schemas
lib/api-client-react     Generated API hooks
lib/db                   PostgreSQL schema with Drizzle ORM
scripts                  Workspace scripts
```

## Run it locally

This is a pnpm workspace. Use pnpm, because `npm install` is blocked by the preinstall script.

```bash
pnpm install
pnpm run typecheck
pnpm --filter detalks run dev                 # web app
pnpm --filter @workspace/api-server run dev   # API
```

`pnpm run build` typechecks and builds every package. The API needs a PostgreSQL connection for database work; push schema changes in development with `pnpm --filter @workspace/db run push`.

## Contribution split

Contribution plan (50/50): Hassan Rehman focuses on the frontend and UI; Mrunmayee Daware focuses on the remaining software work, including backend/API, integrations, testing, and documentation.

## License

MIT
