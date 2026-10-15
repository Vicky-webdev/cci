# Deployment

> Nothing has been deployed by this migration. Choosing the host is a business decision (ADR-002).

## Requirements

* Node.js ≥ 20.9 (long-running process, not PHP shared hosting)
* PostgreSQL 14+ (managed service recommended), reachable only from the app
* A persistent, backed-up directory for `UPLOAD_DIR`
* ~1.2 GB disk for the repository (legacy assets) + build output
* HTTPS termination and `www` redirect at the proxy/host (legacy did this in `.htaccess`)

## Hosting options

| Option | Fits? | Notes |
|---|---|---|
| Single VM/VPS (e.g. Ubuntu + Nginx + systemd/PM2) | ✔ recommended | Simplest; local upload driver works; Nginx terminates TLS and can serve `/images` and `/docs` directly |
| PaaS with persistent disk (Render, Railway, Fly.io volume) | ✔ | Mount a volume at `UPLOAD_DIR` |
| Docker on any container host | ✔ | Use `next build` output; mount `UPLOAD_DIR` |
| Serverless (Vercel/Netlify) | ✘ today | Needs an object-storage upload driver and moving 1.1 GB of assets to blob/CDN storage |

## First deployment

```bash
git clone <repo> /srv/cci && cd /srv/cci
npm ci
cp .env.example .env && chmod 600 .env     # fill in production values (docs/ENVIRONMENT_VARIABLES.md)
npx prisma migrate deploy
npm run db:seed
npm run import:legacy                      # one time; creates content + registers media
npm run admin:create -- --email=… --name="…"   # first Super Admin (password prompted)
npm run build                              # runs assets:sync + prisma generate + next build
NODE_ENV=production npm start              # behind the proxy, e.g. PORT=3000
```

Example Nginx (outline):

```nginx
server { listen 80; server_name craftscouncilofindia.in www.craftscouncilofindia.in; return 301 https://www.craftscouncilofindia.in$request_uri; }
server {
  listen 443 ssl http2; server_name craftscouncilofindia.in;
  return 301 https://www.craftscouncilofindia.in$request_uri;
}
server {
  listen 443 ssl http2; server_name www.craftscouncilofindia.in;
  client_max_body_size 30m;
  location /images/ { alias /srv/cci/public/images/; expires 30d; }
  location /docs/   { alias /srv/cci/public/docs/;   expires 30d; }
  location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host $host;
               proxy_set_header X-Forwarded-For $remote_addr; proxy_set_header X-Forwarded-Proto https; }
}
```

With this proxy set `TRUST_PROXY=true` (it overwrites `X-Forwarded-For` with the real client IP).

## Updating

```bash
git pull && npm ci
npx prisma migrate deploy        # review migrations first (docs/BACKUP_AND_RESTORE.md: back up before)
npm run build && systemctl restart cci   # or your process manager
```

Never run `npm run import:legacy -- --refresh` in production (it is refused when `SITE_ENV=production`).

## Cut-over plan

1. Deploy to a staging host with `SITE_ENV=staging` (noindex); import; staff review content and the admin.
2. Freeze edits on the legacy site; re-run the import on production if legacy files changed (create-missing only).
3. Switch DNS; set `SITE_ENV=production`; verify `robots.txt`, `sitemap.xml`, a sample of redirects.
4. Submit the sitemap; monitor errors/404s (`docs/seo/SEO_MIGRATION_CHECKLIST.md`).
5. Keep the legacy hosting account read-only for at least 30 days as a rollback path.

## Rollback

* **Application**: redeploy the previous git tag and rebuild; database migrations are additive so far.
* **Content**: per-record History → Restore; full restore from backup (`BACKUP_AND_RESTORE.md`).
* **Whole site**: point DNS back to the legacy hosting (unchanged files in `_public_html/` are also in git).
