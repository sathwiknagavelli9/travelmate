# TravelMate

**Explore. Plan. Travel.** A complete tour package planning and booking platform built for a final-year B.Tech demonstration, portfolio, and viva.

Travelers explore Indian destinations, compare complete packages departing from Hyderabad, review transport/stays/itineraries, enter every traveler's details, and complete a clearly identified **simulated payment**. Administrators manage the catalog and booking lifecycle. No real travel reservations or money transfers take place.

## Features

- Responsive public homepage, destination guides, package details, image fallbacks, accessible forms, loading/error/empty states.
- Real MongoDB search by destination/name; destination, budget, duration and style filters; price, duration and popularity sorting.
- Credentials registration/login, bcrypt password hashes, seven-day signed HTTP-only sessions, role authorization, persistent authentication throttling.
- Date/count/traveler validation, review step, server-calculated totals, immutable booked price and package snapshots.
- Demo UPI/card/net banking, optional failure simulation, retry, idempotent success, atomic confirmation and simulated refunds.
- Booking history/details, own-booking access enforcement, cancellation before departure, editable profile.
- Admin overview, destination/package creation and editing, dynamic itinerary editor, activation/availability, users, booking management, payments and revenue.
- Idempotent seed: Goa, Kerala, Rajasthan, Manali, Ooty, Bengaluru, Delhi & Agra; one environment-configured administrator.

## Stack and architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4/custom responsive styles, MongoDB Atlas, Mongoose, bcryptjs, jose, Zod, Lucide React; npm, GitHub and Vercel.

Server Components query MongoDB through a cached connection. Client Components handle forms and interactions. Route handlers validate all mutations, check same-origin requests, authenticate sessions, and verify admin roles independently of UI routing. Booking service functions perform payment/refund changes in MongoDB transactions. Session tokens contain the user ID; current role is read from MongoDB on each protected request.

```text
app/          Public, account, booking and protected admin pages; API handlers
components/   Shared UI and interactive forms
lib/          Database, authentication, validation, catalog and booking services
models/       Mongoose schemas and indexes
types/        Serialized view types
scripts/      Seed data, controlled seed runner and integration verification
tests/        Booking, validation and redirect security tests
public/       Local image fallback
docs/         Academic architecture, database, modules and testing notes
```

## Database

`User`, `Destination`, `Package`, `Booking`, `Payment`, and internal `RateLimit` collections. Email, slugs, booking codes and transaction IDs are unique. A payment is unique per booking; a booking request is unique per user/request ID. Booking snapshots preserve package name, destination, image, duration and price. Deactivation preserves referenced records. Rate-limit entries expire using a TTL index.

## Local setup

Requirements: Node.js 22.12+ (Node.js 24 recommended), npm, and a MongoDB Atlas deployment with transaction support.

```bash
npm ci
```

Copy `.env.example` to `.env.local` and fill these values. Never commit `.env.local`.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Atlas connection string; the application explicitly selects database `travelmate` |
| `AUTH_SECRET` | At least 32 random characters for signing sessions |
| `SEED_ADMIN_EMAIL` | Administrator email, normalized to lowercase |
| `SEED_ADMIN_PASSWORD` | Strong initial administrator password, at least 12 characters |

Create an Atlas database user with read/write permission for `travelmate`, configure Network Access for the runtime, and use Atlas's application connection string. Keep passwords URI-encoded. If deployment connectivity fails, check runtime logs and Atlas network restrictions before modifying rules.

```bash
npm run seed
npm run dev
```

Open `http://localhost:3000`. Seed reads `.env.local`, creates indexes, inserts missing destinations/packages/admin, and **does not overwrite existing edits, reset passwords or delete bookings**. Log in with the administrator values in your local environment file. There is no public seed endpoint.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
# In another terminal, with the server running:
npm run test:integration
```

The integration runner tests real HTTP handlers and Atlas persistence using temporary uniquely named records, then removes only records it created. It requires the seed admin credentials and database access. To test a deployed instance, set `TEST_BASE_URL` to its HTTPS origin. Use a test deployment/database for routine development; local and production environments can share data if configured with the same Atlas URI.

## Routes

Public: `/`, `/destinations`, `/destinations/[slug]`, `/packages`, `/packages/[slug]`, `/register`, `/login`.

Traveler: `/profile`, `/booking/[packageId]`, `/my-bookings`, `/my-bookings/[id]`, `/my-bookings/[id]/payment`.

Admin: `/admin`, `/admin/destinations`, `/admin/packages`, `/admin/bookings`, `/admin/users`, `/admin/payments`; destination/package `new` and ID edit routes.

## Vercel deployment

1. Push this repository to GitHub and import it into Vercel, or use authenticated Vercel CLI.
2. Use the Next.js preset, `npm run build`, and Node.js 24.
3. Configure the four environment variables above as encrypted production values.
4. Run the controlled seed script using the target Atlas URI; never expose seeding as a public HTTP endpoint.
5. Deploy after lint, types, tests and production build pass.
6. Verify live registration, login, catalog queries, booking, demo payment, booking history, administrator access and logout.

CLI: `vercel link`, `vercel env add VARIABLE production --sensitive`, then `vercel --prod`. Pass secrets through stdin, never source files or commit messages. Standard Vercel preview protection is kept enabled.

## Rules and limitations

- All dates are validated against the current calendar date in India. Departures must be after today and within the package's departure window.
- Maximum travelers is a **per-booking group limit**, not a pooled seat inventory for real transport or hotels.
- Only future PENDING/CONFIRMED bookings can be cancelled. Paid cancellations mark the payment REFUNDED atomically.
- Confirmation requires successful demo payment. Admin completion requires a paid, confirmed trip whose final day has arrived.
- All travelers use the listed per-person demo price. Monument tickets and optional activities are excluded unless explicitly listed.
- Images use fixed Unsplash URLs with a local visual fallback. Admin HTTPS images from other hosts render without the Next.js optimization proxy.
- This academic version does not include password recovery, email delivery, supplier allocation or real payment processing. Catalog results are capped at 100 packages; admin lists suit a small demonstration dataset.

## Screenshots

Screenshots and browser evidence are recorded during verification. Add selected desktop, mobile, booking confirmation and admin dashboard images here for your project report. Do not include credentials or private traveler information.

## Future scope

AI assistant and itinerary generation, personalization/recommendation engine, weather/maps, reviews/ratings, email notifications, QR tickets, PDF invoices, coupons, multilingual support, advanced analytics, real payment gateways and external travel APIs. These are future enhancements and are intentionally outside the implemented scope.

See [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) and the other documents in `docs/` for viva and report preparation.
