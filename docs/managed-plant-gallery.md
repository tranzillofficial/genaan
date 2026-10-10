# Managed plant gallery

Use **Plants & photos** (`/admin/plants`) in the dashboard. Add or edit the Arabic name, optional English name, plant/palm category, photo, visibility and display order. Upload JPG/PNG/WebP/AVIF up to 4 MB or paste an HTTPS photo URL. Save to publish the record. Delete removes the record and its photo from the gallery; stored upload files are retained so deleting one entry cannot break other entries sharing its photo.

The dedicated `genaan_plants` table is authoritative. The initial migration preserves all 17 existing entries. Hidden entries are readable only by database administrators. Public pages show only active records ordered by display order and creation time; counts are derived from the records. Empty catalogs remain empty and are never repopulated by a code fallback.

Mutations use the existing validated user token and immutable `genaan_admins` membership. RLS independently enforces administrator writes. No service-role key is added to the frontend or Next routes. Existing authenticated storage policies protect photo uploads. Saving or deleting expires the commercial cache and revalidates the home and packages pages.

## Validation

- Next production build and TypeScript passed.
- Public API and server-rendered gallery returned all 17 migrated entries, including 5 palms.
- Unauthenticated admin GET/POST/DELETE returned 401.
- Direct anonymous Data API insert/update/delete were rejected; public select returned active entries.
- Grants, RLS policies and security advisors were inspected.
- `database/tests/plant-gallery-rls.sql` supplies rollback-only administrator CRUD and non-admin denial checks. The MCP runner failed with `Invalid or expired requestState` before returning a test result; these checks were not reported as passed. No QA rows remain. Authenticated dashboard editing/upload has not been exercised in a browser session here.
