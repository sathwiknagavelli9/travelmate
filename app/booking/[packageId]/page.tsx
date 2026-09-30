import { notFound } from "next/navigation";
import { pageUser } from "@/lib/auth";
import { packageById } from "@/lib/catalog";
import { PageHeading, Empty } from "@/components/ui";
import { Checkout } from "@/components/checkout";
export const metadata = { title: "Plan your booking" };
export default async function Booking({
  params,
  searchParams,
}: {
  params: Promise<{ packageId: string }>;
  searchParams: Promise<{ date?: string; travelers?: string }>;
}) {
  const { packageId } = await params;
  const query = await searchParams;
  const user = await pageUser(
    `/booking/${packageId}?date=${encodeURIComponent(query.date || "")}&travelers=${encodeURIComponent(query.travelers || "1")}`,
  );
  const p = await packageById(packageId);
  if (!p) notFound();
  return (
    <div className="container section">
      <PageHeading
        eyebrow="LET’S MAKE IT A PLAN"
        title="A few details. A great escape."
      />
      {p.available ? (
        <Checkout
          trip={p}
          user={user}
          initialDate={query.date}
          initialCount={query.travelers}
        />
      ) : (
        <Empty
          title="This package is taking a break"
          description="Choose one of our other available getaways."
          href="/packages"
          label="Browse packages"
        />
      )}
    </div>
  );
}
