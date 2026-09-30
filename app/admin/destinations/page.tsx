import { Destination } from "@/models";
import { pageUser } from "@/lib/auth";
import { serialize } from "@/lib/utils";
import type { DestinationView } from "@/types";
import { PageHeading } from "@/components/ui";
import { AdminCatalog } from "@/components/admin-catalog";
export default async function Destinations() {
  await pageUser("/admin/destinations", true);
  const items = serialize<DestinationView[]>(
    await Destination.find().sort({ name: 1 }).lean(),
  );
  return (
    <>
      <PageHeading
        eyebrow="PLACES WORTH EXPLORING"
        title="Your destinations."
        description="Edit travel information or safely deactivate destinations while preserving booking history."
      />
      <AdminCatalog kind="destinations" items={items} />
    </>
  );
}
