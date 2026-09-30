# Module description

| Module | Responsibilities | Primary implementation |
| --- | --- | --- |
| Public catalog | Home, destination guides, search/filter/sort, tour details | app public routes, lib/catalog.ts |
| Authentication | Credentials validation, hashing, cookie sessions, throttling | lib/auth.ts, API auth routes |
| Profile | Authenticated name/phone updates, fixed email | profile page/form, API profile |
| Booking | Date/group validation, all traveler details, review, immutable price | checkout.tsx, booking-service.ts |
| Payment | Three demo methods, failure/retry, atomic confirmation | payment-form.tsx, payBooking |
| History/cancellation | Own-booking enforcement, details, simulated refund | my-bookings routes, cancelBooking |
| Admin catalog | Add/edit/deactivate destinations/packages, dynamic itinerary days | admin-editor.tsx, admin APIs |
| Admin operations | Statistics, user list, booking statuses, payment list | admin pages, protected handlers |
| Seed/testing | Repeatable sample catalog, administrator, validation/integration checks | scripts/, tests/ |

## Booking lifecycle
PENDING is created after review with payment PENDING. Failed simulation leaves booking PENDING and payment FAILED. Success changes both to CONFIRMED/SUCCESSFUL. Eligible cancellation sets CANCELLED and, if previously paid, REFUNDED. A completed paid trip can be set to COMPLETED by an administrator. Terminal cancelled/completed states cannot be cancelled again.

## Viva discussion prompts
Why hash passwords instead of encrypting them? Why verify roles in APIs? Why calculate totals on the server? Why embed travelers but reference users? Why keep price snapshots? Why use a transaction for payment/refund? Why do seed upserts use stable unique fields? Why is maximumTravelers a group limit rather than inventory? The corresponding implementation demonstrates each choice.
