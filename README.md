# GLARA

Floating bathroom vanity systems — a full storefront built from the Figma source of truth.
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma + PostgreSQL.

Bilingual (English / Arabic) with full RTL, a customisation lab, cart and checkout,
customer accounts, and an admin back office.

---

## Getting started

```bash
npm install
npm run db:reset
npm run dev
```

The app runs at http://localhost:3000 and redirects to `/en` or `/ar` based on the
`Accept-Language` header (remembered afterwards in a `glara_locale` cookie).

### Seeded accounts

This repository is public, so it ships no working password. The seed reads the
admin credentials from the environment:

```
SEED_ADMIN_EMAIL="you@example.com"     # optional, defaults to admin@glara-eg.com
SEED_ADMIN_PASSWORD="…"                # optional
```

Without `SEED_ADMIN_PASSWORD` the seed mints a random one and prints it once —
copy it from the seed output. A demo shopper account is created only when
`NODE_ENV` is not `production`.

### Environment

`.env` holds four values:

```
DATABASE_URL="postgresql://…"  # pooled connection — what the app uses
DIRECT_URL="postgresql://…"    # direct connection — migrations only
AUTH_SECRET="…"                # sign the session JWT — change before deploying
NEXT_PUBLIC_SITE_URL="…"       # canonical URLs, sitemap, Open Graph
```

Serverless functions open a connection per invocation, so `DATABASE_URL` points
at a connection pooler. Prisma Migrate needs a real session and uses `DIRECT_URL`.

---

## Scripts

| Script             | What it does                                        |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Development server                                  |
| `npm run build`    | `prisma generate` then a production build           |
| `npm start`        | Serve the production build                          |
| `npm run typecheck`| `tsc --noEmit`                                      |
| `npm run db:push`  | Push the schema to the database                     |
| `npm run db:seed`  | Seed the catalogue and accounts                     |
| `npm run db:reset` | Drop, push and re-seed in one step                  |
| `npm run db:studio`| Prisma Studio                                       |

---

## Routes

Every page lives under `/[locale]`, where locale is `en` or `ar`.

| Route                      | What it is                                                  |
| -------------------------- | ----------------------------------------------------------- |
| `/`                        | Home — hero, collection, customisation band, certifications |
| `/units`                   | Catalogue with type/finish filters, search and sort         |
| `/units/[slug]`            | Product detail — gallery, finish, size, add to cart         |
| `/customize`               | Four-step customisation lab with live pricing               |
| `/cart`                    | Cart with quantity control and order summary                |
| `/checkout`                | Contact, delivery, payment; places the order                |
| `/orders/[number]`         | Order confirmation                                          |
| `/account`                 | Orders, saved units, saved configurations                   |
| `/account/login`, `/register` | Session auth                                             |
| `/support/[topic]`         | Installation, warranty, care, FAQs                          |
| `/contact`                 | Enquiry form                                                |
| `/admin`                   | Dashboard, orders, products, enquiries, subscribers         |

`/sitemap.xml` and `/robots.txt` are generated from the catalogue.

## API

| Endpoint                     | Methods                | Notes                                    |
| ---------------------------- | ---------------------- | ---------------------------------------- |
| `/api/cart`                  | GET POST PATCH DELETE  | Cookie-scoped cart; prices come from the server |
| `/api/orders`                | POST                   | Creates the order and empties the cart   |
| `/api/configurations`        | POST                   | Saves a lab build, returns a `CFG-` code |
| `/api/favorites`             | POST                   | Toggles; requires a session              |
| `/api/auth/{login,register,logout}` | POST            | JWT session cookie, bcrypt hashes        |
| `/api/contact`, `/api/newsletter`   | POST            | Validated with zod                       |
| `/api/admin/orders/[id]`     | PATCH                  | Order status; admin only                 |
| `/api/admin/products/[id]`   | PATCH                  | Active / featured flags; admin only      |

---

## How it fits together

**Locale.** `src/middleware.ts` redirects bare paths to a locale prefix.
`src/i18n/dictionaries/{en,ar}.ts` hold every string; the English file is the
source of the `Dictionary` type, so a missing Arabic key is a build error.
Direction, fonts and metadata all follow from the route param.

**Money.** Prices are whole units in the store currency. Anything the customer
can influence — finish, size, hardware, basin — is priced on the server
(`src/lib/pricing.ts`, `/api/cart`), never from the client payload. Cart lines
snapshot the name and image so a catalogue edit cannot rewrite history.

**Cart.** A `glara_cart` cookie points at a `Cart` row. Signing in claims the
anonymous cart rather than discarding it.

**Auth.** `jose`-signed JWT in an httpOnly cookie, bcrypt password hashes,
`requireUser` / `requireAdmin` guards on the server, and the admin layout
redirects before rendering.

**Design tokens.** `src/app/globals.css` carries the palette, type scale and
easing lifted from Figma; components use those tokens rather than raw hex.

---

## Design source

Figma file `4zvBROXpeCwwRjnTUMGNg3` — home `15:2014`, catalogue `22:3484`,
product `29:4487`. Product renders were exported from that file into
`public/products/`.
