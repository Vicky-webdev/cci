# Backup and Restore

## What to back up

| Data | Location | Frequency |
|---|---|---|
| Database (content, users, enquiries, audit, revisions) | PostgreSQL | Daily full + before every migration/deploy |
| CMS uploads | `UPLOAD_DIR` | Daily (incremental) |
| Environment file | `.env` on the server | On change, in a password manager / secrets vault (never in git) |
| Legacy assets + code | Git repository | Already versioned |

Keep at least 30 daily and 12 monthly copies off-site.

## Database

```bash
# Backup (custom format, compressed)
pg_dump --format=custom --no-owner --file=cci-$(date +%F).dump "$DATABASE_URL"

# Restore into a NEW empty database first, verify, then switch DATABASE_URL
createdb cci_restore
pg_restore --no-owner --dbname=postgresql://…/cci_restore cci-YYYY-MM-DD.dump
```

Restoring over the live database is destructive — only do it during an approved maintenance window, after
taking a fresh backup of the current state.

## Uploads

```bash
rsync -a --delete "$UPLOAD_DIR"/ backup-host:/backups/cci-uploads/      # backup
rsync -a backup-host:/backups/cci-uploads/ "$UPLOAD_DIR"/               # restore
```

Database `Media` rows and files must come from backups taken around the same time; files without rows are
ignored, rows without files show broken images (fix by restoring the file or removing the reference).

## Single-record recovery (no backup needed)

Open the record → **History** → **Restore this version**. Deleted records leave a final snapshot in the
`Revision` table (`note = 'Deleted'`); a developer can recreate them from that JSON.

## Restore test (do quarterly)

1. Restore the latest dump into a scratch database and uploads into a scratch directory.
2. Start the app against them (`DATABASE_URL`, `UPLOAD_DIR`, `SITE_ENV=staging`).
3. Check: sign in, home page, an event with gallery, a newsletter PDF, an uploaded image, enquiries list.
4. Record the result and duration in `docs/CHANGELOG.md`.

The automated integration test (`tests/integration/import.test.ts`) already proves that a fresh database can be
rebuilt from migrations + the legacy importer.
