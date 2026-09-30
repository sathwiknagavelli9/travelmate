import { pageUser } from "@/lib/auth";
import { Booking } from "@/models";
import { PageHeading, Badge } from "@/components/ui";
import { CancelButton, CompleteButton } from "@/components/booking-actions";
import { money, dateLabel, serialize } from "@/lib/utils";
import { canCancel } from "@/lib/booking-rules";
import type { BookingView } from "@/types";
export default async function Bookings() {
  await pageUser("/admin/bookings", true);
  const items = serialize<
    (BookingView & { user: { name: string; email: string } })[]
  >(
    await Booking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean(),
  );
  return (
    <>
      <PageHeading
        title="Every journey, in view."
        description="Confirmation follows successful demo payment. Cancel eligible bookings or mark finished trips as completed."
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>BOOKING / CUSTOMER</th>
              <th>PACKAGE / DEPARTURE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>MANAGE</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b._id}>
                <td>
                  <strong>{b.bookingCode}</strong>
                  <small>
                    {b.user?.name} · {b.user?.email}
                  </small>
                  <small>Created {dateLabel(b.createdAt)}</small>
                </td>
                <td>
                  {b.packageName}
                  <small>
                    {b.destinationName} · {dateLabel(b.travelDate)} ·{" "}
                    {b.numberOfTravelers} travelers
                  </small>
                  <details>
                    <summary>Traveler details</summary>
                    {b.travelers.map((t, i) => (
                      <small key={i}>
                        {t.fullName} · Age {t.age} {t.phone}
                      </small>
                    ))}
                  </details>
                </td>
                <td>{money(b.totalAmount)}</td>
                <td>
                  <Badge>{b.bookingStatus}</Badge>
                  <br />
                  <Badge>{b.paymentStatus}</Badge>
                </td>
                <td>
                  {canCancel(b.bookingStatus, b.travelDate) && (
                    <CancelButton id={b._id} admin />
                  )}
                  {b.bookingStatus === "CONFIRMED" && (
                    <CompleteButton id={b._id} />
                  )}
                  {["CANCELLED", "COMPLETED"].includes(b.bookingStatus) &&
                    "Final status"}
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={5}>No bookings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
