# DeTalks' — Complete Feature Reference
### *A Journey Towards Finding You*
**Version 2.0 | Master Feature Document**
*Team: Mrunmayee Daware · Hassan Rehman | detalks1809@gmail.com | www.detalks.in*

---

> **How to read this document:** Every feature in DeTalks belongs to exactly one tier and one section. This document maps each feature, explains how it operates, and notes the visual/UX rules that govern it. Use this as the single source of truth for product, engineering, and design alignment.

---

## Table of Contents

1. [Platform Architecture Overview](#1-platform-architecture-overview)
2. [Tier 1 — Self-Guided (Free)](#2-tier-1--self-guided-free)
3. [Tier 2 — Community + Companion (Freemium)](#3-tier-2--community--companion-freemium)
4. [Tier 3 — Professional Therapy (Paid)](#4-tier-3--professional-therapy-paid)
5. [AI Agent System — Disha](#5-ai-agent-system--disha)
6. [AI Agent System — Kavach](#6-ai-agent-system--kavach)
7. [Session Architecture & Enforcement](#7-session-architecture--enforcement)
8. [Safety & Crisis Infrastructure](#8-safety--crisis-infrastructure)
9. [Companion (Student) Features](#9-companion-student-features)
10. [Business & Subscription Features](#10-business--subscription-features)
11. [Design System & UX Principles](#11-design-system--ux-principles)
12. [Technology Stack](#12-technology-stack)
13. [Feature Exclusion Log](#13-feature-exclusion-log)

---

## 1. Platform Architecture Overview

DeTalks is a **three-tier mental wellness platform** with a dual AI agent system. Every feature belongs to one tier. No tier bleeds into another in the user interface.

```
┌─────────────────────────────────────────────────────────┐
│                      DeTalks'                           │
│              "A Journey Towards Finding You"            │
├──────────────┬──────────────────┬───────────────────────┤
│   TIER 1     │     TIER 2       │       TIER 3          │
│  Self-Guided │ Community +      │   Professional        │
│   (Free)     │ Companion        │   Therapy (Paid)      │
│              │ (Freemium)       │                       │
├──────────────┴──────────────────┴───────────────────────┤
│              DISHA (Triage Agent) — Front Door          │
│              KAVACH (Guardian Agent) — Always On        │
└─────────────────────────────────────────────────────────┘
```

### Core Design Principles

- **One Primary Action per Screen** — the user never chooses between more than three things at once
- **Anti-Attachment by Design** — no persistent seeker-companion bonds, no 1-on-1 peer chat
- **Warm First, Clinical Never** — no "disorder," "symptoms," "diagnosis," "patient" anywhere in the UI
- **Progressive Disclosure** — platform depth reveals itself gradually as the user grows comfortable
- **The Soft Exit** — the user can leave at any point with zero guilt mechanics

---

## 2. Tier 1 — Self-Guided (Free)

**Who it's for:** People not ready to talk to anyone yet. Completely private, zero human involvement, zero cost. The entry point for everyone.

**Access:** No account required to explore. Account required to save progress.

---

### 2.1 Mood Tracker

**What it is:** A daily emotional check-in tool that builds a private longitudinal picture of how the user is feeling over time.

**How it operates:**
- User selects from a 5-point mood scale once per day (morning prompt optional)
- Each mood entry is timestamped and tagged with an optional short note
- Data is visualized as a private trend graph — the user sees their own emotional arc over days and weeks
- No mood data is shared publicly or with other users
- Kavach reads mood trajectory in the background (silently) to inform Disha's routing at session entry

**UI:** Mood selector is a 5-item horizontal row of 48px elements. Unselected state uses Warm Mist background with Fern Grey icons. Selected state switches to Forest Green background with Warm Ivory icon and a soft green ring. Emoji are not used — designed icons only.

**What it is NOT:** Not a clinical assessment. Not shared with anyone. Not used for advertising.

---

### 2.2 Guided Journaling

**What it is:** A structured private writing space with curated prompts that guide the user toward reflection without pressure.

**How it operates:**
- User is offered a daily featured prompt (e.g., "What's one thing that felt heavy today?")
- Prompts rotate daily, drawn from a library organized by emotional theme (transition, grief, stress, identity, gratitude)
- User can write freely or ignore the prompt
- All journal entries are stored locally encrypted and never shareable by default
- The user can optionally choose to share a specific journal entry as a post in a Community Circle — but this is opt-in, explicit, and one-directional only

**UI:** Featured journal prompt appears on the home screen as the Featured Journal Prompt Card — warm amber-sand background (`#F0E8C8`), DM Serif Display 22px headline in Ink Deep, 20px border radius, warm amber shadow. Tapping opens a full-screen writing area on Warm Sand canvas.

**Gold Moment:** First journal entry triggers a single Gold ring pulse — the platform's way of saying "you showed up."

---

### 2.3 Micro-Practices

**What it is:** A library of 2–5 minute self-guided wellness exercises requiring no human involvement and no external input.

**How it operates:**
Three categories of micro-practices are available:

**Breathing Exercises:**
- Belly Breathing
- Square Breathing (box breathing — 4-4-4-4)
- 4-7-8 Technique
- Each exercise displays a slow-expanding Forest Green circle on Warm Sand — inhale 4s, hold 2s, exhale 6s — with no text during the cycle, no distractions

**Grounding Exercises:**
- 5-4-3-2-1 Sensory grounding
- Body scan (audio-guided)
- Cold water grounding description

**Reflection Prompts:**
- Short 3-question reflection sequences
- Designed to take under 3 minutes
- Not saved unless the user chooses to log to journal

**UI:** Micro-practices appear as Tool Cards on the home screen — Warm Sand background sitting flush with the page, `1px solid #D4C9B8` border, `4px solid #2D6A2D` left accent stripe, 16px border radius. The breathing circle animation uses a `prefers-reduced-motion` fallback (instant fade, no movement).

---

### 2.4 Resource Library

**What it is:** A curated, India-specific collection of mental health articles, audio guides, and explainers.

**How it operates:**
- Content is organized by theme: academic pressure, relationship stress, grief, identity, loneliness, workplace burnout, family dynamics
- All content is reviewed for cultural relevance to the Indian context
- Audio guides are narrated in a calm voice — no clinical tone
- Articles use DeTalks' brand voice (warm, non-clinical, honest)
- Content is available offline after first load (cached locally)
- Language: English in Phase 1, Hindi and Marathi added in Phase 3

**What it does NOT include:** Clinical diagnostic information, PHQ-9/GAD-7 results display, any content that could substitute for professional assessment.

---

### 2.5 Progress Journey

**What it is:** A private, personal milestone tracker that celebrates showing up — not competitive performance.

**How it operates:**
- Tracks: days with a mood check-in, journal entries written, micro-practices completed, sessions attended
- Displayed as a personal visual journey — not a leaderboard, not a streak counter that shames for missing a day
- Milestones are marked privately with Gold Moment animations
- No comparison to other users, no public metrics, no visible counts to anyone but the user

**Gold Moments in Progress Journey:**
- First mood check-in
- First journal entry
- 7 consecutive days with any Tier 1 activity
- First micro-practice completed
- First companion session completed (bridges Tier 1 and 2)

**What it is NOT:** Not a gamification system. Not a leaderboard. Not a streak that penalizes absence.

---

## 3. Tier 2 — Community + Companion (Freemium)

**Who it's for:** People who want human presence without clinical pressure.

**Free allowance:** 4 companion sessions per month, unlimited community circle access.

**Paid upgrade (₹199–₹499/month):** More sessions per month, faster companion matching, voice escalation access.

---

### 3.1 Anonymous Community Circles

**What it is:** Group-based, topic-focused spaces where users share thoughts and feel less alone — without forming personal bonds.

**How it operates:**

**Entry:**
- User selects a topic circle from the available list
- Auto-assigned a warm alias (e.g., "WarmPebble," "CalmRiver," "SoftMoss") — different alias in each circle
- Alias rotates every 30 days — no cross-circle or cross-time recognition possible

**Interaction model:**
- Users post to the topic space — not to a specific person
- No reply threads between specific users
- No @mentions, no quote-replies, no identity chains
- Every post floats in the shared space — responded to by the group's energy, not by a named individual
- Asynchronous — not a live chat room

**Available circles (Phase 1):**
- Academic Pressure
- Loneliness

**Phase 2 additions:**
- Grief
- Relationship Transitions
- Work Stress
- Identity

**Moderation:**
- Kavach monitors all circles in real time for escalation signals
- Human moderators from the licensed supervisor network review flagged posts within 24 hours
- No contact information sharing allowed — Kavach flags and removes any post containing phone numbers, social media handles, or email addresses

**What community circles are NOT:**
- Not a social network
- Not a place to find a specific person to talk to
- Not a place where the same recognizable group gathers (alias rotation prevents this)
- No direct messaging between users — ever

---

### 3.2 Student Companion Sessions

**What it is:** Text-based conversations with verified, supervised psychology students — randomly assigned every session, time and message limited by design.

**How it operates:**

**Before the session:**
- Disha conducts a brief re-check (Pulse Check) before every new session
- If distress level has changed since last check, Disha re-routes appropriately
- Companion is randomly assigned from available pool — the last 3 companions the seeker has spoken to are explicitly excluded from the match pool

**During the session:**
- Text-based chat interface
- Kavach monitors silently from the moment the session begins
- Session limits are enforced server-side (cannot be bypassed client-side):
  - Maximum: 200 messages OR 45 minutes, whichever comes first
- When limit is approaching: a soft notification appears — *"You've been talking for a while. Take a breath — this session will close in 5 minutes."*
- When limit is reached: chat area fades to Warm Sand overlay with DM Serif Display text: *"This conversation has been saved to your journey."* — 1000ms fade, no abrupt cut

**After the session:**
- Seeker sees the session added to their private journey log (themes, emotional patterns — not verbatim transcript)
- Companion sees Kavach-generated learning brief (private, portfolio use)
- New session available immediately with a new randomly assigned companion (no cooldown for text sessions)

**Session History Rules:**
- Seeker CAN see their own session history privately
- Companion CANNOT see the seeker's history with other companions
- Each companion enters the session contextually fresh — no accumulated knowledge of the seeker's story

**Anti-Dependency Detection:**
- If a seeker attempts to game the system to reach the same companion repeatedly, Kavach flags the pattern
- Disha surfaces: *"It sounds like you might benefit from more consistent support. Would you like to explore a professional session?"* — routing toward Tier 3

---

### 3.3 Voice Escalation

**What it is:** A time-limited voice call triggered by Kavach or the student companion when text is insufficient — not freely accessible.

**How it operates:**
- Cannot be initiated by the seeker directly — must be triggered by Kavach alert or companion decision
- Maximum duration: 30 minutes
- Cooldown after voice session: 24 hours before next companion session
- After a voice session closes, a new session with a new companion can begin after the cooldown window

**Access:** Available to Tier 2 paid upgrade users (₹199–₹499/month).

---

### 3.4 Video Escalation

**What it is:** A time-limited video call triggered by Kavach in high-distress situations.

**How it operates:**
- Only activated in high-distress, Kavach-determined situations
- Cannot be freely accessed
- Maximum duration: 20 minutes
- Cooldown after video session: 24 hours before next companion session
- After video session, Kavach prepares a transition summary for potential Tier 3 handoff

---

## 4. Tier 3 — Professional Therapy (Paid)

**Who it's for:** People who need structured, ongoing professional support. Warm handoff from Tier 2.

---

### 4.1 Licensed Psychologist Sessions

**What it is:** Real therapy sessions with licensed psychologists — pay-per-session or subscription.

**How it operates:**
- Kavach prepares a session summary from the seeker's Tier 2 history before the first professional session
- The psychologist receives the summary — no cold start, no repeating the full story
- Summary is stripped of identifying personal details unless a safety concern is active
- Sessions are conducted via the same in-app communication layer (text/voice/video)
- Session content is end-to-end encrypted, stored securely, never used for advertising

**Pricing:**
- ₹500–₹1,500 per session (significantly below India market rate of ₹800–₹3,000)
- Subscription: ₹299–₹799/month for discounted session bundles

---

### 4.2 Priority Disha Routing

**What it is:** Faster, deeper Pulse Check for users entering Tier 3.

**How it operates:**
- Disha's Pulse Check at Tier 3 entry is extended and more nuanced
- Routing speed is prioritized — match to available psychologist happens faster
- Disha carries context from the seeker's full journey history (with consent)

---

### 4.3 Session History & Reports

**What it is:** A private, secure log of all professional sessions — shareable with external providers by the seeker's choice.

**How it operates:**
- All sessions logged with themes, dates, notes (not verbatim transcript by default)
- User can generate a shareable mood/session report for external therapist collaboration
- Reports are encrypted in transit and at rest
- Sharing requires explicit user action — never automatic

---

## 5. AI Agent System — Disha

**Disha is the face of DeTalks. The user knows Disha is there.**

### 5.1 What Disha Is

Disha is a conversational AI triage agent built on the Claude API (claude-sonnet) with a custom system prompt calibrated against triage assessment frameworks. Her personality is warm, curious, and unhurried — like a thoughtful friend who asks the right questions.

She is not a chatbot. She does not respond to free-form queries. She conducts a structured but warm Pulse Check conversation and makes a routing decision.

---

### 5.2 When Disha Activates

- When a new user opens DeTalks for the first time (onboarding)
- At the start of every new session (including re-entry after a gap)
- Before any companion session begins (brief re-check)
- After a crisis event resolves, to re-assess the user's current state
- When Kavach flags a dependency-seeking pattern (re-routing prompt)

---

### 5.3 The Pulse Check (How Disha Operates)

Duration: 3–5 minutes, conversational — not a form, not a questionnaire.

Disha asks open-ended, warm questions and listens for:
- **Emotional urgency** — how distressing is the situation right now?
- **Complexity** — situational stress vs. deeper, recurring patterns?
- **Preference** — tools / community / companion / professional?
- **Language and communication comfort**

The Pulse Check feels like being genuinely asked "How are you doing?" — not completing an intake form.

---

### 5.4 Disha's Routing Levels

| Level | What It Means | Routes To |
|-------|--------------|-----------|
| Level 0 | Low distress, wants self-guided tools | Tier 1 — Self-Guided |
| Level 1 | Wants community presence, not ready to talk | Tier 2 — Community Circle |
| Level 2 | Wants to talk, low-moderate complexity | Tier 2 — Companion Session |
| Level 3 | Moderate-high complexity, recurring issues | Tier 3 — Licensed Psychologist |
| Level 4 | Crisis signals detected | Immediate escalation + crisis helpline |

**Critical design principle:** Routing is invisible to the user. They don't see "you are Level 2." They feel heard, then gently guided. Disha never labels, never diagnoses, never tells the user what is wrong with them.

---

### 5.5 Disha's Interface

- Full-screen background: Warm Sand (`#F5EFE6`) with subtle radial glow from `#EDE7DC` at center
- Greeting text: 28px DM Serif Display, Ink Deep, centered, line-height 1.40
- Question text: 18px DM Sans weight 400, Sage Mid, centered, max-width 320px
- Response input: Full-width textarea, 16px border radius, Warm Ivory background
- Progress: Three soft dots in Forest Green at 40% opacity
- Typing indicator: "Listening..." (not "Typing...") — 2000ms pulse cycle

---

## 6. AI Agent System — Kavach

**Kavach is the guardian. The user knows Kavach exists but never feels it in the moment.**

### 6.1 What Kavach Is

Kavach is a fine-tuned NLP model for real-time distress signal detection on message streams. Alert thresholds are calibrated with licensed psychologists. It also runs on community circle posts asynchronously.

It is not shown to the seeker. It speaks only to the student companion and supervisors when needed.

---

### 6.2 When Kavach Activates

- The moment a companion session begins
- The moment a user enters a Community Circle
- During any voice/video escalation call

---

### 6.3 What Kavach Monitors For (Safety)

Kavach detects linguistic patterns associated with escalating distress:
- Self-harm ideation signals
- Hopelessness language ("there's no point," "I don't want to be here")
- Mentions of specific plans or intent
- Sudden emotional spikes after calm conversation
- Contact information sharing in community circles (phone, social media, email)
- Dependency-seeking behavioral patterns (attempting to re-reach the same companion)

---

### 6.4 Kavach's Response Ladder

When a signal is detected:
1. **Gentle alert to student companion** — in-app notification, visible only to companion
2. **Simultaneous flag to licensed supervisor** — for review
3. **If critical:** Prompt the student to offer voice/video escalation to the seeker
4. **If student cannot handle it:** Facilitate warm handoff to licensed psychologist
5. **Level 4:** Disha surfaces crisis helplines immediately — Kavach flags supervisor

---

### 6.5 What Kavach Does for Learning (Companion Side)

After every companion session:
- Takes structured session notes automatically
- Identifies key emotional themes discussed
- Highlights moments where the student responded well vs. moments for improvement
- Generates a post-session learning brief for the student (private, portfolio use)
- Tracks student development across multiple sessions

---

### 6.6 What Kavach Does for Continuity (Tier 3 Handoff)

When a seeker escalates to a licensed psychologist:
- Kavach prepares a session summary from all Tier 2 session themes
- Summary is stripped of identifying personal details unless a safety concern is active
- The psychologist enters the conversation already briefed — no cold start for the seeker

---

### 6.7 Privacy Rules for Kavach

- Kavach's analysis is never shown to the seeker
- Seekers are informed at consent that an AI safety system monitors sessions — full transparency before agreement
- Kavach's analysis pipeline is sandboxed from user-facing data
- Session content is never used for advertising, never shared with third parties

---

## 7. Session Architecture & Enforcement

### 7.1 Session Flow (Full)

```
User Opens App
      ↓
DISHA activates — Pulse Check (3–5 mins, conversational)
      ↓
Routing Decision (Levels 0–4)
      ↓

[Level 0] → Tier 1: Self-Guided Tools
              No agents active. Private.

[Level 1] → Tier 2: Community Circle
              KAVACH activates silently to monitor.

[Level 2] → Tier 2: Companion Session
              Disha brief re-check → Random companion assigned
              KAVACH activates the moment session begins
                    ↓
              ┌─────────┴───────────┐
          No Signals          Signal Detected
              ↓                     ↓
       Session continues    Kavach → Companion Alert
              ↓             + Supervisor Flag
       Session ends at              ↓
       200 msg / 45 min    Option: Voice Escalation (30 min)
              ↓                     ↓
       Kavach: learning    Option: Video Escalation (20 min)
       brief for student            ↓
       (private)           Option: Warm Handoff → Tier 3
                                    ↓
                           Kavach prepares transition
                           summary for psychologist

[Level 3] → Tier 3: Licensed Psychologist
              Kavach summary ready. No cold start.

[Level 4] → Crisis:
              Disha surfaces helplines immediately
              iCall: 9152987821
              Vandrevala Foundation: 1860-2662-345
              Kavach flags supervisor.
```

---

### 7.2 Session Limits Summary

| Session Type | Message Limit | Time Limit | Cooldown |
|-------------|--------------|-----------|---------|
| Text Companion Session | 200 messages | 45 minutes | None — new session immediate with new companion |
| Voice Escalation | — | 30 minutes | 24 hours before next companion session |
| Video Escalation | — | 20 minutes | 24 hours before next companion session |
| Community Circle Posts | No hard limit | No hard limit | Kavach-monitored continuously |
| Licensed Psychologist Session | No hard limit | Per booking | Per booking |

**Enforcement:** All session limits are enforced server-side at API level — cannot be bypassed client-side.

---

### 7.3 Communication Channel Logic

| Stage | Medium | Reason |
|-------|--------|--------|
| Entry / Onboarding | Text (Disha) | Lowest friction, least intimidating |
| Standard companion session | Text chat | Analyzable by Kavach, comfortable for seekers |
| Emotional escalation | Voice call (time-limited) | More human presence when distress rises |
| Crisis or deep complexity | Video call (time-limited) | Full human connection for hardest moments |
| Community | Async text posts | No real-time pressure, reflective |
| Post-session | Async text | Reflection, resources, follow-up |

---

## 8. Safety & Crisis Infrastructure

### 8.1 The Four Non-Negotiables

1. **DeTalks never claims to be a replacement for clinical therapy.** Every session begins with clear framing: *"This is a supportive conversation, not a diagnosis or treatment."*
2. **Students never operate alone.** Every student companion has an assigned licensed supervisor who reviews flagged sessions within 24 hours.
3. **Crisis is never managed within the platform alone.** Level 4 always includes a prompt to contact a licensed crisis helpline.
4. **No persistent seeker-companion bonds.** Random assignment and session limits are safety architecture, not feature restrictions.

---

### 8.2 Crisis Helplines (Always Surfaced at Level 4)

- **iCall:** 9152987821
- **Vandrevala Foundation:** 1860-2662-345

These are displayed as Kavach Escalation Alert slides up from the bottom of screen with:
- Background: Warm Ivory
- Border-top: `3px solid #E8A020` (Escalation Amber — warm, not alarming)
- Border Radius: 20px 20px 0px 0px
- Heading: "A gentle reminder" — never "ALERT" or "WARNING"
- Two actions: "I've got this" (secondary) / "Connect with support" (primary Forest Green)

---

### 8.3 Informed Consent Architecture

- Seekers are told before beginning any Tier 2 session that Kavach (an AI safety system) monitors conversations
- Consent is explicit — the user actively agrees, not buried in terms
- No session begins without consent
- The consent language is warm and honest: *"Your conversation is supported by Kavach, our AI safety system, to make sure you're always in the right hands."*

---

### 8.4 Data Privacy Rules

- End-to-end encryption: all session content encrypted in transit and at rest
- Session data isolated per user — no cross-user data leakage
- Session content never used for advertising
- Session content never shared with third parties
- HIPAA-aligned data practices regardless of local mandate
- ISO 27001 and GDPR alignment in compliance standards

---

### 8.5 Anti-Attachment Design

**Why it exists:** People in distress are in a neurologically heightened state of attachment-seeking. A platform that allows vulnerable people to repeatedly bond with non-professional support figures can become a new dependency — not a bridge to healing.

**Mechanisms:**
- Random companion assignment (explicit exclusion of last 3 companions from match pool)
- Session limits (200 messages / 45 minutes — enforced server-side)
- No 1-on-1 peer messaging between seekers — ever
- Alias rotation in community circles every 30 days
- Kavach pattern detection flags dependency-seeking behavior
- Disha re-routes dependency seekers toward Tier 3 (appropriate for ongoing relational support)

---

## 9. Companion (Student) Features

### 9.1 Companion Verification & Onboarding

**How it operates:**
- Student verifies enrollment via college email or student ID
- Completes a mandatory 2-hour orientation module before first session
- Assigned a licensed supervisor upon verification
- Must complete ethics module — cannot begin sessions without ethics clearance

---

### 9.2 Companion Session Handling

**During sessions:**
- Random seeker assigned — companion does not choose who they speak with
- Companion cannot see the seeker's history with other companions
- Each session is contextually fresh for the companion
- Kavach monitors in real time — companion receives gentle alerts if escalation signals are detected
- Companion follows escalation protocol: offer voice call → flag supervisor → facilitate handoff if needed

---

### 9.3 Kavach Learning Briefs

**After every session:**
- Kavach auto-generates a structured session note
- Notes identify: key emotional themes, moments of effective response, areas for improvement
- Learning brief is private to the companion — not shared with seekers, not public
- Briefs accumulate into a portfolio of supervised practice hours

---

### 9.4 Companion Portfolio

**What it tracks:**
- Total practice hours across all sessions
- Supervisor approval notes
- Growth trajectory markers (Kavach-generated)
- Ethics compliance record

**Gold Moment for Companions:**
- 10 practice hours logged: single gold ring pulse
- First escalation navigated successfully: gold acknowledgment in portfolio

**Use:** The portfolio is a credentialed record usable for academic credit at partner institutions and for professional development documentation.

---

### 9.5 Student Accountability

- Students violating ethical guidelines are immediately suspended
- Supervisors review at minimum one session per student per month
- All students complete ethics module before first session
- Students cannot see a seeker's history with other companions — only their own Kavach-generated session notes

---

## 10. Business & Subscription Features

### 10.1 Three-Tier Pricing Structure

| Tier | Price | What's Included |
|------|-------|-----------------|
| Tier 1 — Free | ₹0 | All self-guided tools, mood tracker, journaling, micro-practices, resource library, progress journey |
| Tier 2 — Freemium Base | ₹0 | 4 companion sessions/month, unlimited community circles, Kavach protection, Disha routing |
| Tier 2 — Companion+ | ₹199–₹499/month | More sessions/month, faster matching, voice escalation access |
| Tier 3 — Per Session | ₹500–₹1,500/session | Licensed psychologist, warm handoff, Kavach summary prepared |
| Tier 3 — Subscription | ₹299–₹799/month | Discounted session bundles |

---

### 10.2 Student Discount

**Displayed on:** Subscription screen only — where the financial decision is being made.

**How it operates:**
- Student verifies enrollment via college email or student ID
- Tier 2 (Companion+) unlocked at ₹99/month instead of ₹199–₹499
- 30% off all Tier 3 professional sessions
- Access to government scheme information surfaced on subscription screen

---

### 10.3 Government Scheme Information

**When shown:** Only to verified students, only on the subscription screen.

**Schemes surfaced:**
- **Ayushman Bharat – PM-JAY:** Mental health coverage provisions that may offset Tier 3 session costs (where applicable)
- **National Mental Health Programme (NMHP):** Referral pathway information for institutions with active NMHP district partnerships
- **State Student Welfare Funds:** Maharashtra, Karnataka, Tamil Nadu, and other states — eligibility information and links to apply through student's institution
- **UGC Mental Health Guidelines (2023):** Partner colleges may provide subsidized access under UGC peer support recommendations
- **CSR-Sponsored Access:** Students at partner institutions with active corporate CSR wellness partnerships may be eligible for fully sponsored Tier 2 or Tier 3 access

**Important:** Information is displayed as informational cards — not automatically applied. One-tap pathway to learn more or apply.

---

### 10.4 Scholarship Access

**What it is:** A quiet link at the bottom of the subscription screen — not promoted, but always present.

**Text:** *"Can't afford a session right now? Apply for access."*

**How it operates:**
- Application reviewed within 48 hours by the DeTalks access team
- No student is turned away from professional support because of money
- Not featured prominently — respects dignity, but always accessible

---

### 10.5 B2B Revenue Streams

**College & University Partnerships:**
- DeTalks as a student wellness benefit — annual flat fee per institution
- Psychology departments get a supervised practice platform
- Student discount automatically applied for enrolled students

**Corporate Wellness Programs:**
- Employee wellness programs
- HR dashboard with aggregate (anonymous) wellness trends — no individual data

**Psychology College Partnerships:**
- Colleges pay a platform fee for students using DeTalks as supervised practice
- Students receive credentialed portfolios usable for academic credit

---

## 11. Design System & UX Principles

### 11.1 Color Palette

| Color Name | Hex | Role |
|-----------|-----|------|
| Forest Green | `#2D6A2D` | Primary brand, CTAs, active states |
| Dark Green | `#1A3D1A` | Headers, depth, emphasis |
| Gold Accent | `#F5C518` | Milestones only — rarest color |
| Warm Sand | `#F5EFE6` | Primary page background |
| Warm Ivory | `#FAF6F0` | Card surfaces |
| Warm Mist | `#EDE7DC` | Secondary surfaces, inactive states |
| Amber Sand | `#F0E8C8` | Featured journal prompt card only |
| Canopy Dark | `#0F2210` | Dark section backgrounds |
| Ink Deep | `#1C2B1A` | Primary body text |
| Sage Mid | `#4A6B4A` | Secondary text |
| Fern Grey | `#7A907A` | Tertiary text, timestamps |
| Sand Text | `#8C7B6A` | Warm-neutral captions on beige |
| Escalation Amber | `#E8A020` | Gentle alert only |
| Crisis Warm Red | `#C0392B` | Level 4 crisis only — never decorative |

---

### 11.2 Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| Display Hero | DM Serif Display | 56px | 400 |
| Section Heading | DM Serif Display | 40px | 400 |
| Sub-heading Large | DM Serif Display | 28px | 400 |
| Sub-heading | DM Sans | 22px | 600 |
| Body Large | DM Sans | 18px | 400 |
| Body | DM Sans | 16px | 400 |
| Label | DM Sans | 13px | 500 |
| Caption | DM Sans | 12px | 400 |

**Rules:** DM Serif Display is used only for emotional headlines — never for navigation. DM Sans weight 400 is the ceiling for all body content. Bold DM Serif Display is never used.

---

### 11.3 Calming Animations

Every animation has one job: reduce psychological arousal. None are decorative.

| Animation | Behavior | Duration |
|-----------|----------|---------|
| Breathing Canvas | Subtle radial pulse on Warm Sand, 2% opacity shift | 8-second cycle |
| Screen Fade-In | Opacity + translateY 8px → 0 | 500ms |
| Disha Typing | Three dots + "Listening..." label | 2000ms cycle |
| Card Lift | 4px upward lift + shadow deepens | 350ms ease-in-out |
| Session Close | Chat fades to Warm Sand overlay with serif message | 1000ms fade |
| Gold Ring Pulse | Single gold ring outward — once only | Single pulse |
| Breathing Circle | Expanding Forest Green circle — inhale 4s, hold 2s, exhale 6s | Per cycle |
| Loading States | Parchment Deep skeleton screens — no spinners | — |

All animations respect `prefers-reduced-motion` — degrade to instant fades only.

---

### 11.4 Voice & Language Rules

| Situation | Use | Avoid |
|-----------|-----|-------|
| Starting a session | "Let's talk" / "I'm here" | "Connect now" / "Start session" |
| Loading/waiting | "Finding the right space for you..." | "Loading..." |
| Completing an action | "Done. Take a breath." | "Success! ✓" |
| Escalation prompt | "A gentle reminder" | "ALERT" / "WARNING" |
| Crisis resource | "Connect with support" | "EMERGENCY" / "CALL NOW" |
| Encouragement | "You showed up today. That matters." | "Great job! 🎉 Keep it up!" |
| Empty state | "Your conversations will live here — take the first step when you're ready." | "No data available" |
| Error state | "Something went a little sideways. Let's try again." | "ERROR: Request failed" |

**Banned clinical language (never used anywhere in UI):** disorder, symptoms, diagnosis, patient.

---

### 11.5 Layout Rules

- **One primary action per screen** — never two Forest Green buttons on the same screen
- **Minimum 48px vertical breathing room** between content blocks
- **Warm Sand (`#F5EFE6`) always** as page background — never pure white
- **Two-tone editorial rhythm:** Warm Sand sections alternate with Canopy Dark sections (like chapters)
- **No sharp corners** — minimum 8px border radius on all interactive elements
- **No red** except Level 4 crisis escalation
- **No emoji in clinical contexts** — designed icons only for mood selectors

---

## 12. Technology Stack

### 12.1 Frontend

- **React Native** — Cross-platform mobile (iOS + Android)
- **NativeWind** — Consistent Tailwind-based styling
- **React Navigation** — In-app navigation
- **Lottie / React Native Reanimated** — Calming animation layer

### 12.2 Backend

- **Node.js + Express** — API server
- **PostgreSQL** — Relational data (users, sessions, routing history)
- **Redis** — Real-time session state and presence management

### 12.3 AI Agents

- **Disha:** Claude API (claude-sonnet) with custom system prompt calibrated on triage assessment frameworks
- **Kavach:** Fine-tuned NLP model for distress signal detection; threshold calibrated with licensed psychologists; also runs on community circle posts asynchronously
- **Session Note Generation:** LLM-based structured summarization pipeline (Kavach post-session output)
- **Alias Generator:** Deterministic warm-noun-phrase engine (e.g., "CalmRiver," "WarmPebble") — resets per circle per 30 days

### 12.4 Communication

- **WebSocket (Socket.io)** — Real-time text chat
- **WebRTC / Daily.co** — In-app voice and video calls (escalation layer only)

### 12.5 Session Enforcement

- Server-side session timers — message count and duration enforced at API level
- Random assignment engine — explicitly excludes last 3 companions server-side
- Anti-repeat logic — Kavach flags dependency patterns; Disha re-routes

### 12.6 Infrastructure & Security

- **AWS / Google Cloud** — Scalable cloud hosting
- End-to-end encryption — all session content encrypted in transit and at rest
- HIPAA-aligned data practices
- JWT-based authentication
- Session data isolated per user — no cross-user data leakage
- Kavach analysis pipeline sandboxed from user-facing data

---

## 13. Feature Exclusion Log

Features explicitly considered and deliberately excluded — with reasoning.

| Feature | Why Excluded |
|---------|-------------|
| 1-on-1 Peer Chat Between Seekers | Creates dependency between two people in distress without professional supervision — clinically harmful |
| Persistent Companion Assignment | Creates emotional dynamic the student is not trained to manage; replaces rather than bridges to professional support |
| Merging Disha and Kavach | Different jobs, different activation contexts, different trust relationships — merging compromises both |
| Leaderboards & Competitive Gamification | You do not put someone in a depressive episode on a leaderboard |
| Dream Analysis | Scientifically contested; dilutes product story; requires deep clinical expertise |
| Open Social Feed | Social mechanics in mental health platforms consistently cause harm without enormous moderation investment |
| Family/Caregiver Features (Phase 1) | In the Indian context, family can be the primary source of stigma — requires careful qualitative research first |
| Clinical Assessment Score Display (PHQ-9/GAD-7 in self-guided UI) | Showing clinical scores without trained interpretation creates liability and psychological harm risk |
| Government Scheme Section in Main App | Financial/institutional language belongs at the subscription screen — not in the therapeutic space |
| Public Community Feed | Requires enormous moderation; replaced with structured, anonymous, asynchronous Community Circles |
| Streaks That Shame Absence | The app does not reward power users — it rewards people who show up at all |

---

## Appendix: Roadmap Summary

| Phase | Timeline | Key Features Shipping |
|-------|----------|-----------------------|
| Phase 1 | Months 1–3 | Core app, Disha Pulse Check, text companion sessions, mood tracker, journaling, Kavach MVP, 2 community circles, subscription screen, student verification |
| Phase 2 | Months 4–6 | Voice/video escalation, warm handoff, licensed psychologist onboarding, Kavach learning briefs, CBT modules, corporate wellness pilot, scholarship access |
| Phase 3 | Months 7–12 | Hindi + Marathi language support, 5 community circles, college partnerships (5 institutions), Kavach v2 (voice tone analysis), insurance exploration |
| Phase 4 | Year 2+ | Southeast Asia expansion, child/adolescent track, research partnerships, DeTalks Foundation (pro bono access) |

---

*Document compiled: April 2026*
*DeTalks' | Zeal Institute, Pune*
*detalks1809@gmail.com | www.detalks.in*

---

> *"The first conversation should never cost you anything — not money, not your dignity, not your identity."*
