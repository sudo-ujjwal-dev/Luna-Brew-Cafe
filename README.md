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

3. Set a unique `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` of at least 32 characters in `.env`. The admin password must not be the MySQL password. Generate a session secret with:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

   Admin sign-in uses these server-only environment variables and a signed, HTTP-only session cookie that expires after eight hours. Customer accounts use a separate cookie signed with `AUTH_SECRET` and scrypt password hashes. `.env` is ignored by Git; never commit it or share the credentials.

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

Prisma uses MySQL. The schema covers admin and customer users, categories, menu items, reservations, orders and order items, reviews, contact messages, gallery images, and business settings. Migrations are in `prisma/migrations/`. The idempotent seed creates demo categories, NPR-priced menu items, one illustrative gallery image, and default settings; it does not create fabricated orders or reservations.

Public APIs persist reservations, orders, reviews, and contact submissions. Customers can register at `/account/register`, sign in at `/account/login`, and view their account at `/account`. Account history includes only orders and reservations linked to the signed-in account; new orders and reservations are linked automatically when signed in. Checkout recalculates item prices and delivery totals from current database records on the server. Reviews are private until approved. Admin pages and APIs require an authenticated admin session.

Image references may be local public paths or HTTPS URLs; image uploading/storage is not configured. The seeded menu images are local, openly licensed demo photos; see [IMAGE-CREDITS.md](./IMAGE-CREDITS.md). `NEXT_PUBLIC_MAP_EMBED_URL` optionally replaces the approximate OpenStreetMap Lakeside demo-area embed. Do not configure it with a precise address unless the café's actual location is known and authorized. `NEXT_PUBLIC_SITE_URL` optionally supplies the production origin for sitemap and canonical URLs.

Contact submissions are stored even when email delivery is unavailable. To email notifications to `lumlelyujjwal@gmail.com`, configure `ADMIN_CONTACT_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASSWORD` in ignored `.env`. For Gmail, use `smtp.gmail.com`, port `587`, your Gmail account, and a Google App Password (not your Google account password). The contact form reports when a message was saved but not emailed; admins can still view it at `/admin-dashboard/messages`. No payment gateway or distributed rate limiter is configured.

## Validation

```powershell
npm run type-check
npm run lint
npm run build
npm run start
```

`npm run db:generate`, `npm run db:migrate`, and `npm run db:seed` require a valid `DATABASE_URL`; migration and seed commands also require a running database.
