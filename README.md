# Luna Brew Café

A Next.js 15 portfolio website for a fictional café concept in Lakeside, Pokhara, Nepal. Menu items and NPR prices, sample opening hours, contact details, and imagery are illustrative; this is not a real café listing.

## Run locally

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Update `.env.local` before using the admin sign-in. Generate a strong session secret with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` in `.env.local`. Then visit `http://localhost:4028/admin/login`. The signed, HTTP-only session expires after eight hours. Admin credentials and the signing secret are server-only.

`NEXT_PUBLIC_SITE_URL` is optional and enables absolute sitemap and canonical metadata URLs. `NEXT_PUBLIC_MAP_EMBED_URL` can replace the default approximate OpenStreetMap embed for the Lakeside demo area.

## Validation

```powershell
npm run type-check
npm run lint
npm run build
npm run start
```

## Current implementation status

- Existing landing page and menu styling retained, with Pokhara/Lakeside demo branding, sample NPR prices, route-safe section links, a real OpenStreetMap embed, and a working image fallback.
- Admin dashboard route is protected by environment-configured credentials and an HMAC-signed, HTTP-only cookie session.
- The dashboard intentionally displays no live business metrics until a database is configured.
- Cart, ordering, reservation persistence, contact submissions, review management, and admin CRUD are not implemented yet. The reservation and order UI does not report simulated success.
- Prisma/MySQL, database migrations, and seed data still need to be added before this demo can accept or manage real business data.
