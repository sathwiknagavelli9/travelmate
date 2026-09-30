import { notFound, redirect } from "next/navigation";
import { pageUser } from "@/lib/auth";
import { ownBooking } from "@/lib/bookings";
import { PageHeading } from "@/components/ui";
import { PaymentForm } from "@/components/payment-form";
import { money, dateLabel } from "@/lib/utils";
export const metadata = { title: "Demo payment" };
export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await pageUser(`/my-bookings/${id}/payment`);
  const b = await ownBooking(id, user._id);
  if (!b) notFound();
  if (b.bookingStatus !== "PENDING") redirect(`/my-bookings/${id}`);
  return (
    <div className="container section narrow">
      <PageHeading
        eyebrow="ONE LAST STEP"
        title="Make your getaway official."
        description="Review the amount and complete a simulated payment."
      />
      <div className="panel">
        <h3>{b.packageName}</h3>
        <p>
          {dateLabel(b.travelDate)} · {b.numberOfTravelers} travelers ·{" "}
          {b.bookingCode}
        </p>
        <div className="price-row total">
          <span>Total demo amount</span>
          <span>{money(b.totalAmount)}</span>
        </div>
        <PaymentForm id={id} amount={b.totalAmount} />
      </div>
    </div>
  );
}
