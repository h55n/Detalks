# Data retention

DeTalks holds as little as it needs, for as long as it is useful. Two rules
cover everything:

1. **A person's content belongs to them.** Moods, journal entries, companion
   sessions, reflections and circle posts stay until the account holder
   exports or deletes them. Account deletion cascades through every content
   table. Nothing here expires on a timer, because losing a journal or a mood
   history would harm the person the app exists for.
2. **Operational state expires.** Rows that exist to make a feature work are
   deleted once they stop being useful:

| Data | Lifetime | Why |
| --- | --- | --- |
| `auth_sessions` | until expiry | a dead login session can never authenticate again |
| `email_verifications` | 30 minutes after issue | single-use, hashed tokens; expired rows are pure residue |
| `password_resets` | 30 minutes after issue | same |
| `rate_limit_buckets` | end of the window | counters for finished windows have no effect |

The retention pass is `runRetention` in `artifacts/api-server/src/lib/retention.ts`.
It runs two ways:

- **Daily, automatically.** Vercel cron calls `GET /api/internal/retention`
  at 03:00 UTC with `Authorization: Bearer $CRON_SECRET` (configured in
  `vercel.json`; `CRON_SECRET` is set in the Vercel project). Without the
  secret the endpoint answers like any unknown route.
- **By hand.** `DATABASE_URL=... pnpm --filter @workspace/api-server run retention`.

The auth limiter also deletes expired buckets opportunistically (2% of
requests), so the scheduled pass is the backstop, not the only cleaner.
