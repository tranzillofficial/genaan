# Genaan commercial packages

The active application and backend live in **tranzillofficial/genaan**. No old backend repository is used. The dedicated Supabase project is `hybybaqjoivioinudefl`.

## What is deployed

- Database schema: `database/commercial-backend.sql`, followed by `database/commercial-care-upgrade.sql` and `database/commercial-packages-pricing.sql`.
- Legacy profile/role protections: `database/harden-legacy-admin-functions.sql`.
- Edge Function: `supabase/functions/genaan-enquiry/`, deployed as `genaan-enquiry`, JWT verification enabled.
- Five priced packages (5/10/18/30/50 plants) plus a bespoke package without fixed count or price. Starting prices: EGP 4,000 / 8,500 / 15,500 / 25,000 / 41,500; pots and initial setup included, delivery separate. Plant mixes and sizes are indicative and confirmed before fulfilment.
- Existing `admin@genaan.com` retained. Its existing password is unchanged.
- Existing contact details are the initial settings; change phone, WhatsApp, email and annual care prices at `/admin/business-settings`.

## Application environment

```
NEXT_PUBLIC_SUPABASE_URL=https://hybybaqjoivioinudefl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Genaan legacy anon key from Supabase dashboard>
```

No service-role key is needed by the new Next.js commercial routes. The Edge Function uses Supabase's own runtime service-role secret, which never reaches the browser. Use the legacy anon JWT for the server Edge Function invocation because gateway JWT verification is enabled. Do not commit environment files.

## Access and requests

- Public: published packages, contact settings and two annual starting care prices. Nursery unit costs are not published.
- Private: immutable admin membership and customer enquiries. Membership can be provisioned by a database owner through the SQL editor, using the real Auth user UUID. Website clients cannot assign admin membership.
- Admin endpoints verify the user token with Auth and membership, then use the user's RLS-scoped client.
- Submissions are validated by the Edge Function and inserted through a service-only, SECURITY INVOKER SQL function. Snapshots preserve package contents, starting price and annual care price at request time. City and business type are separate. Area, room count and address are optional.
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

## Annual care and indicative pricing

- Biannual: 2 visits/year, once every 6 months, from EGP 1,200/year.
- Quarterly: 4 visits/year, once every 3 months, from EGP 2,200/year.
- These are editable starting prices; the quotation confirms plant count, city, travel and materials. Routine watering remains the client’s responsibility. Additional materials and replacement plants are quoted separately.
- Requests store the selected plan and price supplied by the service-only database function, never a client-supplied price. Repeated request IDs return the original snapshot. Selecting care records an enquiry, not a paid subscription or scheduled visit.
- Pricing method: supplier basket cost plus provisional pots (EGP 200/plant) and setup allowances (EGP 600/1,000/1,600/2,400/4,000), then × 1.30 and rounding upward to EGP 500. Procurement sizes and actual pot/setup costs must be confirmed before a binding quote. No unit plant prices are shown.
- Custom enquiries use the same saved-request flow. Magazine links are removed; old journal URLs redirect to packages without deleting stored posts.
