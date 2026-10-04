# Luna Brew Café

A Next.js 15 café website and management-system portfolio demo for a fictional café concept in Lakeside, Pokhara, Nepal. Business details, opening hours, customer records, and seed content are illustrative and are not claims about a real business.

## Requirements

- Node.js 20 or later
- MySQL 8.0+ (or a compatible MySQL server)

## Configure and run locally

1. Install dependencies and copy the environment template to `.env` (Prisma CLI reads this file, and Next.js does too):

   ```powershell
   npm install
   Copy-Item .env.example .env
   ```

2. Create a MySQL database, then set `DATABASE_URL` in `.env`. URL-encode any special characters in the username or password, for example:

   ```text
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/luna_brew_cafe"
   ```

3. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a unique `AUTH_SECRET` of at least 32 characters in `.env`. Generate a secret with:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

   Admin sign-in uses these server-only environment variables and a signed, HTTP-only session cookie that expires after eight hours. `.env` is ignored by Git; never commit it or share the credentials.

4. Generate the Prisma client, apply migrations, and load clearly identified demo seed data:

   ```powershell
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. Start the application:

   ```powershell
   npm run dev
   ```

   The site runs at `http://localhost:4028`; the admin sign-in is at `http://localhost:4028/admin/login`.

## Database and application behavior

Prisma uses MySQL. The schema covers admins, categories, menu items, reservations, orders and order items, reviews, contact messages, gallery images, and business settings. The initial migration is in `prisma/migrations/`. The idempotent seed creates demo categories, NPR-priced menu items, one illustrative gallery image, and default settings; it does not create fabricated orders or reservations.

Public APIs persist reservations, orders, reviews, and contact submissions. Checkout recalculates item prices and delivery totals from current database records on the server. Reviews are private until approved. Admin pages and APIs require an authenticated session.

Image references may be local public paths or HTTPS URLs; image uploading/storage is not configured. `NEXT_PUBLIC_MAP_EMBED_URL` optionally replaces the approximate OpenStreetMap Lakeside demo-area embed. Do not configure it with a precise address unless the café's actual location is known and authorized. `NEXT_PUBLIC_SITE_URL` optionally supplies the production origin for sitemap and canonical URLs.

Without a reachable, migrated MySQL database the persisted features and database-driven dashboard are unavailable; the application reports these failures rather than simulating success. No payment gateway, email delivery, or distributed rate limiter is configured.

## Validation

```powershell
npm run type-check
npm run lint
npm run build
npm run start
```

`npm run db:generate`, `npm run db:migrate`, and `npm run db:seed` require a valid `DATABASE_URL`; migration and seed commands also require a running database.
