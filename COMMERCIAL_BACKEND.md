# Genaan commercial packages

The active application and backend live in **tranzillofficial/genaan**. No old backend repository is used. The dedicated Supabase project is `hybybaqjoivioinudefl`.

## What is deployed

- Database schema: `database/commercial-backend.sql` (migration `genaan_commercial_packages_backend`).
- Legacy profile/role protections: `database/harden-legacy-admin-functions.sql`.
- Edge Function: `supabase/functions/genaan-enquiry/`, deployed as `genaan-enquiry`, JWT verification enabled.
- Five editable, published packages with 5/10/18/30/50 plants and indicative areas of 15–30/30–60/60–100/100–180/180–300 m².
- Existing `admin@genaan.com` retained. Its existing password is unchanged.
- Existing contact details are the initial settings; change them at `/admin/business-settings`.

## Application environment

```
NEXT_PUBLIC_SUPABASE_URL=https://hybybaqjoivioinudefl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Genaan legacy anon key from Supabase dashboard>
```

No service-role key is needed by the new Next.js commercial routes. The Edge Function uses Supabase's own runtime service-role secret, which never reaches the browser. Use the legacy anon JWT for the server Edge Function invocation because gateway JWT verification is enabled. Do not commit environment files.

## Access and requests

- Public: only published packages and three contact settings.
- Private: immutable admin membership and customer enquiries. Membership can be provisioned by a database owner through the SQL editor, using the real Auth user UUID. Website clients cannot assign admin membership.
- Admin endpoints verify the user token with Auth and membership, then use the user's RLS-scoped client.
- Submissions are validated by the Edge Function and inserted through a service-only, SECURITY INVOKER SQL function. Snapshots preserve package contents and starting price at request time.
- Request IDs make retry submission idempotent. Per-phone database locks and a three-per-hour phone limit prevent parallel duplicate spam; a daily global limit caps request volume. This is a basic limit, not a substitute for a future managed CAPTCHA/WAF if abuse occurs.
- Creating an enquiry prepares a WhatsApp draft, not a sent message, payment, or confirmed order. Staff confirm status manually.
- Package images use the public `genaan-packages` bucket, restricted admin uploads, 5 MB image limits and immutable random filenames with long cache lifetime.

## Validation

```
npm ci
npm run typecheck
npm run build
node --env-file=.env.local scripts/verify-commercial-backend.mjs
```

The integration verification inserts a clearly named QA request and prints its IDs. Delete only that printed test request afterwards using the database owner connection. Do not run it repeatedly against a customer phone number.

## Production hosting

- Repository: https://github.com/tranzillofficial/genaan (production branch `main`).
- Vercel project: `genaan` in `tranzillofficial-4512s-projects`.
- Website: https://www.genaan.shop (`genaan.shop` redirects to `www`).
- Configure both Supabase variables above in Vercel for production, preview and development before building. New Vercel projects do not inherit the previous project's environment variables.
- A missing Supabase configuration causes `/journal` prerendering to fail with `Missing Supabase environment variables`. Set the variables and redeploy; do not commit credentials or substitute an unrelated database.
- `NEXT_PUBLIC_` values are bundled at build time, so deploy again after changing them.

## Package photography

The five package images are illustrative commercial styling references from Unsplash, served at 1200 × 800 with automatic format and quality 80. Admins can replace them from the package dashboard. The hero image and branding remain unchanged.

| Package | Photographer | Source |
| --- | --- | --- |
| Green Corner | Kara Eads | https://unsplash.com/photos/green-plant-in-white-pot-1GAMa5Ot7NA |
| Welcoming Space | Monaz Nazary | https://unsplash.com/photos/tall-mirror-with-potted-plants-in-a-bright-room-1RTaj2c4O5Y |
| Living Business | Janelle Ang | https://unsplash.com/photos/a-bright-cafe-interior-with-plants-and-tables-knVcZCTAq0Q |
| Signature Space | Roman | https://unsplash.com/photos/interior-of-a-cafe-with-plants-and-seating-M5IdzhyYl1k |
| Green Destination | Farhad Ibrahimzade | https://unsplash.com/photos/a-room-filled-with-lots-of-green-plants-K8OPYyAEtvI |
