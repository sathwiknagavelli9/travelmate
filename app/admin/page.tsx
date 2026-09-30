import Link from "next/link";
import { pageUser } from "@/lib/auth";
import { User, TourPackage, Booking, Payment } from "@/models";
import { PageHeading, Badge } from "@/components/ui";
import { money, dateLabel } from "@/lib/utils";
export default async function Dashboard() {
  await pageUser("/admin", true);
  const [
    users,
    packages,
    bookings,
    revenue,
    recent,
    popular,
    bookingStatuses,
    paymentStatuses,
  ] = await Promise.all([
    User.countDocuments({ role: "USER" }),
    TourPackage.countDocuments(),
    Booking.countDocuments(),
    Payment.aggregate<{ total: number }>([
      { $match: { status: "SUCCESSFUL" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
    TourPackage.find().sort({ popularity: -1 }).limit(4).lean(),
    Booking.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$bookingStatus", count: { $sum: 1 } } },
    ]),
    Payment.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);
  return (
    <>
      <PageHeading
        eyebrow="THE BIG PICTURE"
        title="Welcome to your travel desk."
        description="A clear view of your packages, travelers, and simulated bookings."
      />
      <div className="stats-grid">
        {[
          ["Total travelers", users],
          ["Tour packages", packages],
          ["Total bookings", bookings],
          ["Demo revenue", money(revenue[0]?.total || 0)],
        ].map(([label, value]) => (
          <div className="stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="section-heading">
        <h2 style={{ fontSize: 23 }}>Recent bookings</h2>
        <Link href="/admin/bookings" className="text-link">
          View all
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>BOOKING</th>
              <th>PACKAGE</th>
              <th>TRAVEL DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((b) => (
              <tr key={b._id.toString()}>
                <td>{b.bookingCode}</td>
                <td>{b.packageName}</td>
                <td>{dateLabel(b.travelDate)}</td>
                <td>{money(b.totalAmount)}</td>
                <td>
                  <Badge>{b.bookingStatus}</Badge>
                </td>
              </tr>
            ))}
            {!recent.length && (
              <tr>
                <td colSpan={5}>
                  No bookings yet. New traveler bookings will appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="admin-split">
        <div className="panel">
          <h3>Booking status</h3>
          {["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map((s) => (
            <div className="breakdown-row" key={s}>
              <Badge>{s}</Badge>
              <strong>
                {bookingStatuses.find((x) => x._id === s)?.count || 0}
              </strong>
            </div>
          ))}
        </div>
        <div className="panel">
          <h3>Payment status</h3>
          {["PENDING", "SUCCESSFUL", "FAILED", "REFUNDED"].map((s) => (
            <div className="breakdown-row" key={s}>
              <Badge>{s}</Badge>
              <strong>
                {paymentStatuses.find((x) => x._id === s)?.count || 0}
              </strong>
            </div>
          ))}
          <p className="field-help">
            Revenue counts successful payments only and excludes simulated
            refunds.
          </p>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 25 }}>
        <h3>Featured in your catalog</h3>
        {popular.map((p) => (
          <div className="breakdown-row" key={p.id || p._id.toString()}>
            <Link href={`/packages/${p.slug}`}>{p.name}</Link>
            <strong>{money(p.pricePerPerson)}</strong>
          </div>
        ))}
      </div>
    </>
  );
}
