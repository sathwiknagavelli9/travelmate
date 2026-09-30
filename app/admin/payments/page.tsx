import { pageUser } from "@/lib/auth";
import { Payment } from "@/models";
import { PageHeading, Badge } from "@/components/ui";
import { money, dateLabel, serialize } from "@/lib/utils";
type PaymentRow = {
  _id: string;
  transactionId: string;
  booking: { bookingCode: string };
  user: { name: string; email: string };
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  paidAt?: string;
};
export default async function Payments() {
  await pageUser("/admin/payments", true);
  const rows = serialize<PaymentRow[]>(
    await Payment.find()
      .populate("user", "name email")
      .populate("booking", "bookingCode")
      .sort({ createdAt: -1 })
      .lean(),
  );
  return (
    <>
      <PageHeading
        title="Payments, without the guesswork."
        description="Every record is a simulation. Successful payments contribute to demo revenue; refunded payments do not."
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>TRANSACTION</th>
              <th>BOOKING / CUSTOMER</th>
              <th>AMOUNT</th>
              <th>METHOD</th>
              <th>STATUS</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p._id}>
                <td>{p.transactionId}</td>
                <td>
                  {p.booking?.bookingCode}
                  <small>
                    {p.user?.name} · {p.user?.email}
                  </small>
                </td>
                <td>{money(p.amount)}</td>
                <td>{p.paymentMethod}</td>
                <td>
                  <Badge>{p.status}</Badge>
                </td>
                <td>{dateLabel(p.paidAt || p.createdAt)}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6}>No payment records yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
