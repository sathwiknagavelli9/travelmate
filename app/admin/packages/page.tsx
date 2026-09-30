import { TourPackage } from "@/models";
import { pageUser } from "@/lib/auth";
import { serialize } from "@/lib/utils";
import type { PackageView } from "@/types";
import { PageHeading } from "@/components/ui";
import { AdminCatalog } from "@/components/admin-catalog";
export default async function Packages() {
  await pageUser("/admin/packages", true);
  const items = serialize<PackageView[]>(
    await TourPackage.find().populate("destination").sort({ name: 1 }).lean(),
  );
  return (
    <>
      <PageHeading
        eyebrow="THOUGHTFULLY PLANNED JOURNEYS"
        title="Your tour packages."
        description="Manage prices, dates, stays, transportation, and every day of the itinerary."
      />
      <AdminCatalog kind="packages" items={items} />
    </>
  );
}
