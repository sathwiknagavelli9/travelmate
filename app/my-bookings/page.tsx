import Link from "next/link";
import { pageUser } from "@/lib/auth";
import { Booking } from "@/models";
import { serialize, dateLabel, money } from "@/lib/utils";
import { PageHeading, Empty, Badge } from "@/components/ui";
import { TravelImage } from "@/components/travel-image";
import type { BookingView } from "@/types";
export const metadata = { title: "My bookings" };
export default async function MyBookings() {
  const user = await pageUser("/my-bookings");
  const bookings = serialize<BookingView[]>(
    await Booking.find({ user: user._id }).sort({ createdAt: -1 }).lean(),
  );
  return (
    <div className="container section">
      <PageHeading
        eyebrow="YOUR JOURNEYS, ALL TOGETHER"
        title="Trips to look forward to."
        description="Your plans, travelers, and booking details, right where you need them."
      />
      {!bookings.length && (
        <Empty
          title="Your first adventure is waiting"
          description="Find a package you love and make it your next chapter."
          href="/packages"
          label="Find my first getaway"
        />
      )}
      {bookings.map((b) => (
        <article className="booking-row" key={b._id}>
          <div className="booking-thumb">
            <TravelImage src={b.packageImage} alt={b.destinationName} />
          </div>
          <div>
            <small>
              {b.bookingCode} · Booked {dateLabel(b.createdAt)}
            </small>
            <h3>{b.packageName}</h3>
            <p>
              {b.destinationName} · {dateLabel(b.travelDate)} ·{" "}
              {b.numberOfTravelers}{" "}
              {b.numberOfTravelers === 1 ? "traveler" : "travelers"}
            </p>
            <div className="status-group">
              <Badge>{b.bookingStatus}</Badge>
              <Badge>{b.paymentStatus}</Badge>
            </div>
          </div>
          <div>
            <strong>{money(b.totalAmount)}</strong>
            <br />
            <Link
              href={`/my-bookings/${b._id}`}
              className="button secondary small"
            >
              View booking
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
