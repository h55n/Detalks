# DeTalks — A Journey Towards Finding You

**Live app:** [detalks.vercel.app](https://detalks.vercel.app)

DeTalks is a calm, three-tier mental wellness platform that addresses two deeply interconnected crises simultaneously: the vast majority of people struggling with mental health who cannot access support, and the thousands of psychology students who graduate every year without real supervised clinical practice. DeTalks connects them — carefully, anonymously, and with strict boundaries by design.

It is not a social network, not a chatbot, and not a therapy replacement. It is a structured pathway from self-help tools through anonymous community support and supervised student-led conversations to professional therapy — where every step is warm, human, and affordable.

> *"A world where no one suffers in silence because support was too expensive, too far away, or too scary to ask for — and where every psychology student graduates having genuinely changed lives."*

---

## Why DeTalks Exists

| Stat | Context |
|------|---------|
| 1 in 4 people globally | struggle with mental health |
| >80% treatment gap in India | 4 out of 5 people who need support never receive it |
| 10,000+ psychology students/year | graduate with no real supervised practice ground |

Five failures converge on the same population — people in genuine distress with nowhere to turn:

1. **The Silence Majority** — stigma, fear of judgment, and high emotional friction prevent help-seeking.
2. **Cost & Accessibility** — a single therapy session costs ₹800–₹3,000; nothing affordable exists in between AI chatbots and licensed therapists.
3. **Stigma** — platforms that feel clinical or medicalized make this worse, not better.
4. **No Practice Ground for Students** — psychology graduates complete 3–5 years of theory with minimal supervised clinical exposure.
5. **Parasocial Risk** — existing peer support platforms allow dependency-forming bonds; DeTalks corrects this from the ground up with anti-attachment architecture.

---

## The Solution — Three Tiers, No Clutter

Every feature belongs to exactly one tier. There is no overlap and no cross-clutter.

### Tier 1 — Self-Guided (Free)
For people who are not ready to talk to anyone yet. Completely private, zero human involvement, zero cost.

| Feature | Details |
|---------|---------|
| Mood Tracker | Daily check-in, longitudinal visualisation, entirely private |
| Guided Journaling | Structured prompts, private, not shareable by default |
| Micro-Practices | 2–5 minute breathing, grounding, and reflection exercises |
| Resource Library | Curated India-specific mental health content |
| Progress Journey | Private personal milestones — no leaderboard, no streaks that shame |

### Tier 2 — Community & Companion (Freemium)
For people who want human presence without clinical pressure. Anonymous community circles and supervised student companion conversations — structured so that no personal bonds form.

| Feature | Details | Limit |
|---------|---------|-------|
| Anonymous Community Circles | Topic-based group spaces, moderated, no direct messaging | Up to 3 circles |
| Student Companion Sessions | Text chat, randomly assigned, never consecutively repeated | 4 free/month, 45 min, 200 messages |
| Kavach Monitoring | Silent real-time session guardian | Always on |
| Disha Re-check | Brief check-in before each new companion session | Always on |
| Escalation Support | Kavach and supervisor flag when needed | Automatic |

Freemium upgrade at ₹199–₹499/month (student pricing: ₹99/month) unlocks more sessions, faster matching, and voice escalation.

### Tier 3 — Professional Therapy (Paid)
| Feature | Details |
|---------|---------|
| Licensed Psychologist Sessions | ₹500–₹1,500/session — below market rate of ₹800–₹3,000 |
| Subscription Plans | ₹299–₹799/month for discounted session bundles |
| Warm Handoff | Kavach-prepared session summary travels with the user |
| Session History | Private, secure, exportable for external collaboration |

---

## The Dual AI Agent System — Disha and Kavach

Two agents. Two roles. Never merged.

### Disha — Triage & Routing
Warm, curious, unhurried. Conducts a short 3–5 minute conversational Pulse Check — not a form, not a questionnaire, but a warm open-ended conversation. Routes users invisibly to the right tier without labelling, diagnosing, or telling the user what is wrong with them.

| Level | Meaning | Routes To |
|-------|---------|-----------|
| 0 | Low distress, wants self-guided tools | Tier 1 |
| 1 | Wants community presence, not ready to talk | Tier 2 — Community Circle |
| 2 | Wants to talk, low to moderate complexity | Tier 2 — Companion Session |
| 3 | Moderate to high complexity, recurring issues | Tier 3 — Licensed Psychologist |
| 4 | Crisis signals detected | Immediate escalation + crisis helpline |

### Kavach — Real-Time Session Guardian
Silent. Protective. Never interrupts the user. Only communicates with the student companion or supervisor when needed.

- **For Safety** — monitors conversation text in real time, detects self-harm ideation, flags emotional spikes, notifies the student companion and a licensed supervisor simultaneously, facilitates warm handoff when needed.
- **For Learning** — generates structured post-session learning briefs for the student companion, tracks development across sessions.
- **For Continuity** — prepares a session summary when a seeker escalates to a licensed psychologist so there is no cold start.

> *Disha is the front door. Kavach is the guardian inside. They never overlap — Disha's job ends when the session begins; Kavach's job begins exactly there.*

---

## What DeTalks Is Not

- Not a clinical dashboard — no alarming charts, no red flags shown to users
- Not a social feed — no likes, no follower counts, no public metrics
- Not a productivity app — no streaks that shame you for missing a day
- Not a tech product wearing a wellness costume — no cold blues, no neon, no purple gradients
- Not a replacement for licensed professional therapy at any tier

---

## Tech Stack

This repository is the TypeScript front-end.

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

> The broader product integrates with external services (databases, auth, payments, messaging, and AI providers). Refer to the code and environment configuration for the exact integrations used in this repo.

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm (or your preferred Node package manager)

### Install

```bash
git clone https://github.com/h55n/Detalks.git
cd Detalks
npm install
```

### Run locally

```bash
npm run dev
```

Then open the URL printed by Vite (typically http://localhost:5173).

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Configuration

If the app requires environment variables (API keys, endpoints, etc.), create a local `.env` file and populate the required values.

- Check for example files such as `.env.example`
- Search the codebase for `import.meta.env`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests/lint if available
4. Open a pull request

## License

If you plan to open-source this project, add a LICENSE file and reference it here.