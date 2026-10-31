# DeTalks release checks

This remains a wellness pilot, not a clinically validated service. Do not launch it as medical care, human-supervised counselling or an emergency service.

## Implemented

- Cookie authentication and owner-scoped private data; no demo moods, journal entries or sessions on new accounts.
- Durable auth rate limiting: fixed-window buckets stored in Postgres, so brute-force limits hold across serverless instances and cold starts. Limits are per client IP per endpoint and fail closed with a busy signal if the limiter cannot reach the database.
- Groq Disha replies, with a labelled scripted prompt if the provider is unavailable.
- Kavach rule-first safety screening plus additive model screening. Rules cannot be unflagged by the model. Provider failures fall back to rules, not a claim that a message is safe.
- Consent explaining Groq processing, storage and the limits of automated safety screening.
- Mood check-in, journal create/edit/delete, guided reflection saved to journal, session history, post-session reflection, export and account deletion.
- Email verification tokens: hashed, 30-minute expiry, account-bound and single-use. Unverified accounts cannot post or react in shared circles.
- Password reset by email: hashed, 30-minute, single-use tokens. A successful reset ends every existing session and burns outstanding reset links. Requests never reveal whether an email owns an account. Shares the verification sender gate: without a configured sender the app says reset is unavailable instead of pretending a link was sent.
- Service worker caches static assets only. No API responses or writes are cached; old caches are removed.
- Public resource notes have distinct topic content and are labelled editorial reflections, not external authorship or clinical guidance.

## Environment

- `DATABASE_URL`: PostgreSQL.
- `GROQ_API_KEY`: server-side only. `GROQ_MODEL` defaults to `openai/gpt-oss-20b`.
- `APP_ORIGIN`: canonical app origin, used for verification links.
- `RESEND_API_KEY` and `VERIFICATION_FROM`: optional, only after verifying a sending domain. Without these, verification requests return an honest unavailable message and shared posting remains locked. Do not use `onboarding@resend.dev` for production recipients.

## Remaining launch gates

1. Set up a DeTalks-owned transactional sending domain and verify mail delivery. Email verification and password-reset code are ready, but outbound mail is not live until the sender is configured.
2. Independent clinical/safety review and a larger multilingual crisis/benign test set. Automated screening can miss or overflag messages. Human companion matching, human moderation and therapist booking are not implemented.
3. Broader abuse controls before opening the pilot to broad traffic. Auth endpoints now have durable cross-instance rate limiting, but circle posting, Disha chat and signup volume have no per-account or per-IP quotas yet.
4. Managed database backup/restore drill, TLS CA verification, retention policy and an incident response owner. The current managed database connection retains the existing encrypted-but-unverified TLS configuration; this is a launch gate, not a security guarantee.
5. Groq free-tier quota is shared with other use of the account. The app must stay on the free plan unless its owner explicitly approves otherwise. Test outage behavior when limits are reached.

## Database capacity checks

Vercel Fluid Compute uses `attachDatabasePool` so idle clients close before an instance suspends. Each connection also sets a 60-second server-side `idle_session_timeout`; this never kills an active query or transaction. Keep the per-instance pool small. The current shared free Aiven service has a 20-connection cap. A final smoke test exposed and recovered exhausted idle DeTalks connections, so sustained/concurrent load and a dedicated pooler remain launch gates. Do not restart the shared service or terminate other applications' connections as a shortcut.

## Current sources checked 2026-10-19

- Vercel pool lifecycle: https://vercel.com/kb/guide/connection-pooling-with-functions
- Groq models: https://console.groq.com/docs/models
- Groq data handling: https://console.groq.com/docs/your-data
- Resend test-domain restriction: https://resend.com/docs/knowledge-base/403-error-resend-dev-domain
- Tele-MANAS: https://telemanas.mohfw.gov.in/home
- Emergency 112: https://112.gov.in/
- iCall: https://icallhelpline.org/ (its own site lists Mon-Sat, 8am-9pm; other institutional pages have conflicting hours)
- Vandrevala: https://www.vandrevalafoundation.com/free-counseling
- KIRAN phased into Tele-MANAS: https://www.biospectrumindia.com/news/98/24217/govt-merges-kiran-mental-health-rehabilitation-helpline-with-telemanas.html

Verify current phone details before a future release. Never test a helpline by placing an unnecessary call.

## Test commands

```
pnpm install --frozen-lockfile --prod=false
pnpm run typecheck
pnpm --filter @workspace/api-server test
pnpm --filter detalks run build
pnpm --filter @workspace/api-server run build
```

Inspect the deployed app at 390px and 1280px. Exercise signup, check-in, journal, reflection, consent/session, crisis card, practices, resources, history, profile, verification-unavailable state, export and deletion with disposable synthetic data. Never post release-test content to shared circles.
