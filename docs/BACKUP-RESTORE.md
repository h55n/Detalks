# Backup and restore

## What protects the data

1. **Aiven managed backups.** The `mneme-pg` service (PostgreSQL 18.6,
   DigitalOcean blr) keeps continuous backups: console showed the latest
   backup 6 hours old, oldest 14 days, 649 MB stored, on 2026-11-02. Restore
   and fork operations run from the Aiven console (service > Backups).
2. **Logical dumps with `pg_dump`.** Use a client at least as new as the
   server (18.x; older pg_dump refuses). Runbook below.

## Dump / restore runbook

```bash
# 1. Dump (custom format). Keep the file private, delete it after.
pg_dump "$DATABASE_URL" --format=custom --file=detalks.dump

# 2. Restore into a scratch database on the same service - never over the
#    live `detalks` database.
psql "$ADMIN_URL" -c "CREATE DATABASE detalks_restore_drill"
pg_restore --no-owner --no-privileges --dbname="$DRILL_URL" detalks.dump

# 3. Compare every table's row count against the source, spot-check foreign
#    keys (e.g. session_messages without a parent session must be 0), then:
psql "$ADMIN_URL" -c "DROP DATABASE detalks_restore_drill"
rm detalks.dump
```

## Drill log

**2026-11-02 (drill 1, passed).** pg_dump 18.6 of the live `detalks`
database; restored into scratch database `detalks_restore_drill` on the same
service. All 12 table row counts matched the source exactly (5 users,
5 auth sessions, 9 session messages, 3 talk sessions, 1 journal entry,
1 mood entry, 5 applied migrations, and the empty tables at 0); zero orphaned
session messages; scratch database dropped and the dump file deleted after
the check. Note for next time: the Ubuntu 22.04 system pg_dump (14) refuses
server 18.6 - use the PGDG 18 client.
