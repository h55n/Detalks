# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## DeTalks App (`artifacts/detalks`)

Mobile-first mental wellness web app for India. React + Vite + Tailwind v4, wouter routing, framer-motion, lucide-react.

### Design System
- **Background**: `hsl(39 38% 86%)` (#EADCBF warm beige)
- **Typography**: DM Serif Display (headings) + DM Sans (body)
- **Primary**: Forest Green (`hsl(120 41% 31%)`)
- **Gold**: `#F5C518` milestone-only accent
- **Cards**: `bg-card rounded-[20-24px] border border-border/60` with `rgba(100,70,30,0.06) 0px 4px 24px` shadow
- **CTA card**: `background: linear-gradient(180deg, #F2E9CE 0%, #ECE0BD 100%)`
- **Section labels**: `font-sans text-[11px] font-medium text-[#8C7B6A] uppercase tracking-[0.18em]`
- **Headers**: Typography-first, inline (not sticky), `px-6 pt-10 pb-4` — NO sticky bg-card bars
- **Tab bar**: Floating pill `bg-card/85 backdrop-blur-md border border-border/60 rounded-full` with active pill highlight
- **Icons**: lucide-react at `strokeWidth={1.5}`
- **Mood selectors**: emoji-only (😣😔😐🙂😄) with ring-1 active state — NO red accents
- **Buttons (primary)**: `bg-foreground text-background rounded-[14px] py-4` (dark, not green)
- **No**: clinical language, mascots, red outside crisis, emoji outside mood selectors

### Pages
Home, Talk, Journal, JournalWrite, Progress, Profile, Practices, Breathe, Grounding, Reflection, Resources, Professional, MoodTracker, CommunityCircle, ActiveSession, SessionHistory, SessionReflection, Consent, PreCheck, Subscription, Splash, Onboarding1-3, Auth, PulseCheck
