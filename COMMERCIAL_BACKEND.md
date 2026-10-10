# Genaan commercial packages

The active application and backend live in **mnedaaoff/genaan**. No old backend repository is used. The dedicated Supabase project is `hybybaqjoivioinudefl`.

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

## Remaining ownership / hosting steps

GitHub transfer is unavailable in the current connector tools. To transfer the repository while preserving history:

1. Open `https://github.com/mnedaaoff/genaan/settings` using the owning account.
2. Danger Zone → Transfer ownership → new owner `redomlabs`, repository name `genaan`.
3. Accept the transfer with the receiving account if GitHub asks, and allow the repository in the ChatGPT GitHub connection.
4. Check the existing Vercel Git integration after transfer and retain the existing domain.

The currently connected Vercel account does not expose the existing Genaan hosting project. Verify the Git-triggered deployment in the owning Vercel account; reconnect that account if direct hosting management is needed. Do not replace an existing unrelated project's backend or domain.
