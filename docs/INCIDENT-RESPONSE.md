# Incident response

**Owner: Hassan Rehman (@h55n), confirmed by him on 2026-11-02.** He decides, he communicates, he closes the
incident. If he is unreachable, the safest default for any suspected data or
safety incident is to take the app offline (pause the Vercel deployment)
rather than leave a suspected harm running.

DeTalks is a wellness pilot. The two incident classes that matter most are
**someone's private words leaking** and **someone in crisis getting a harmful
or missing safety response**.

## Severity

- **S1 - active harm risk:** safety screening failing open, crisis replies
  leaking model text, private journal/session data exposed to another user,
  credentials or tokens leaked. Act now.
- **S2 - degraded trust:** Disha or Kavach provider down, email sender
  misconfigured, login broken. Fix within a day.
- **S3 - everything else.**

## S1 playbook

1. **Contain first, understand second.** Options, fastest first:
   - Vercel: pause or roll back the deployment.
   - Revoke and reissue anything leaked: `DATABASE_URL` user password (Aiven
     console), `GROQ_API_KEY` (Groq console), `CRON_SECRET`, Resend key.
   - Aiven: the service can be powered off from the console if the database
     itself is the problem.
2. **Assess blast radius.** Which users, which tables, what time window.
   Aiven keeps 14 days of backups (see BACKUP-RESTORE.md) for comparison or
   point-in-time recovery.
3. **Tell affected users honestly** what happened, what data, what was done.
   A mental-health app does not get to be vague about this.
4. **Close with a written note:** cause, fix, and the one change that stops a
   repeat. Add a regression test.

## Safety-screening incidents

Kavach is rule-first: provider failures fall back to rules, never to silence.
If a reply is ever harmful anyway: capture the exact message pair, add it to
the crisis/benign test set, fix the rules before the model, and re-run the
suite. Crisis replies always route to Tele-MANAS 14416 and 112.

## Contacts and consoles

- App host: Vercel (project `detalks`) - deployments, env, pause/rollback.
- Database: Aiven (service `mneme-pg`, project `mneme`) - backups, users,
  power. Do not restart the shared service or terminate other applications'
  connections without checking; MNEME shares it.
- AI: Groq console - keys, quota.
- Secrets: Instinct vault entries named `DeTalks ...`.
