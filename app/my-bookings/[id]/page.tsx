import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import { pageUser } from "@/lib/auth";
import { ownBooking, ownPayment } from "@/lib/bookings";
import { dateLabel, money } from "@/lib/utils";
import { canCancel } from "@/lib/booking-rules";
import { Badge } from "@/components/ui";
import { CancelButton } from "@/components/booking-actions";
export const metadata = { title: "Booking details" };
export default async function Details({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ confirmed?: string }>;
}) {
  const { id } = await params;
  const user = await pageUser(`/my-bookings/${id}`);
  const b = await ownBooking(id, user._id);
  if (!b) notFound();
  const payment = await ownPayment(id, user._id);
  const success =
    (await searchParams).confirmed && b.bookingStatus === "CONFIRMED";
  return (
    <div className="container section narrow">
      <div className="success-heading">
        <div className="success-icon">
          {b.bookingStatus === "CONFIRMED" ? (
            <Check size={30} />
          ) : (
            <MapPin size={30} />
          )}
        </div>
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          {b.bookingCode}
        </div>
        <h1>{success ? "You’re going places!" : "Your journey details."}</h1>
        <p>
          {success
            ? "Your demo booking is confirmed. Let the countdown begin."
            : "Keep every part of your plan in one place."}
        </p>
        <div className="status-group" style={{ justifyContent: "center" }}>
          <Badge>{b.bookingStatus}</Badge>
          <Badge>{b.paymentStatus}</Badge>
        </div>
      </div>
      <div className="panel">
        <h2 style={{ fontSize: 28 }}>{b.packageName}</h2>
        <p>{b.destinationName}</p>
        {[
          ["Travel date", dateLabel(b.travelDate)],
          ["Duration", `${b.durationDays} days`],
          ["Travelers", String(b.numberOfTravelers)],
          ["Price at booking", `${money(b.pricePerPersonAtBooking)} / person`],
          ["Booked on", dateLabel(b.createdAt)],
          ["Transaction ID", payment?.transactionId || "Awaiting payment"],
          ["Payment method", payment?.paymentMethod || "Not selected"],
        ].map(([label, value]) => (
          <div className="price-row" key={label}>
            <span>{label}</span>
            <strong
              style={{
                textAlign: "right",
                overflowWrap: "anywhere",
                maxWidth: "65%",
              }}
            >
              {value}
            </strong>
          </div>
        ))}
        <div className="price-row total">
          <span>
            {b.paymentStatus === "SUCCESSFUL"
              ? "Total paid (demo)"
              : b.paymentStatus === "REFUNDED"
                ? "Total refunded (demo)"
                : "Total amount"}
          </span>
          <span>{money(b.totalAmount)}</span>
        </div>
        <div className="divider" />
        <h3>Your travelers</h3>
        {b.travelers.map((t, i) => (
          <div className="price-row" key={i}>
            <strong>{t.fullName}</strong>
            <span>
              Age {t.age}
              {t.gender && t.gender !== "Not specified" ? ` · ${t.gender}` : ""}
            </span>
          </div>
        ))}
        {b.cancelledAt && (
          <div className="feedback info">
            Cancelled on {dateLabel(b.cancelledAt)}. {b.cancellationReason}.{" "}
            {b.paymentStatus === "REFUNDED" &&
              "The payment was refunded in the simulation; no real money moved."}
          </div>
        )}
        <div className="actions">
          {b.bookingStatus === "PENDING" && (
            <Link className="button" href={`/my-bookings/${b._id}/payment`}>
              Complete demo payment
            </Link>
          )}
          {canCancel(b.bookingStatus, b.travelDate) && (
            <CancelButton id={b._id} />
          )}
        </div>
        <p className="field-help">
          Cancellation is available before the departure date. Completed and
          cancelled bookings cannot be cancelled.
        </p>
      </div>
      <div className="actions">
        <Link className="button" href="/my-bookings">
          View my bookings
        </Link>
        <Link className="button secondary" href="/packages">
          Continue exploring
        </Link>
      </div>
    </div>
  );
}
