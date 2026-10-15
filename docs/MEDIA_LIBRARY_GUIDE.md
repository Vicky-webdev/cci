# Media Library Guide

## Two kinds of files

| Source | Where | Can be deleted in the CMS? |
|---|---|---|
| **Legacy site files** (≈3,970 images, PDFs, videos) | `_public_html/images`, `_public_html/docs`, served at their original URLs `/images/…`, `/docs/…` | No — originals are protected |
| **CMS uploads** | `UPLOAD_DIR` (default `storage/uploads/YYYY/MM/…`), served at `/uploads/…` | Yes, if not used anywhere |

## Uploading

**Media library → Upload files** (several at once), or **Choose… → Upload new** from any image/file field.
Accepted: JPEG, PNG, GIF, WebP, AVIF, PDF, MP4, WebM, up to 25 MB (configurable). The file type is checked
from the file's contents, so renamed files are refused. SVG and HTML are not accepted for security reasons.
Uploading a byte-identical file again reuses the existing copy instead of creating a duplicate.
File names are made URL-safe and prefixed with a random code; the original name is kept as the title.

## Describing files

Open a file to edit **Alt text** (required for meaningful images — describe what it shows), title, caption
and folder. Tiles marked "no alt" still need alt text.

## Finding where a file is used

The file page lists every page, event, news item, press item, publication, award, council, crafts-map state,
process and setting that references it. Files in use cannot be deleted — remove them from those places first.

## Optimisation

Originals are never altered. Prefer WebP/JPEG under 500 KB for photos (≈2000 px wide). The legacy galleries
use the original files, as on the old site.

## Backups

Uploads live on disk (`UPLOAD_DIR`); include that directory in backups (see `BACKUP_AND_RESTORE.md`).
