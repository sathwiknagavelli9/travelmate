import { notFound } from "next/navigation";
import { pageUser } from "@/lib/auth";
import { Destination, TourPackage } from "@/models";
import { serialize } from "@/lib/utils";
import type { DestinationView, PackageView } from "@/types";
import { PageHeading } from "@/components/ui";
import { AdminEditor } from "@/components/admin-editor";
export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await pageUser("/admin/packages", true);
  const { id } = await params;
  if (id !== "new" && !/^[a-f\d]{24}$/i.test(id)) notFound();
  const item =
    id === "new"
      ? undefined
      : serialize<PackageView | null>(
          await TourPackage.findById(id).populate("destination").lean(),
        );
  if (item === null) notFound();
  const destinations = serialize<DestinationView[]>(
    await Destination.find().sort({ name: 1 }).lean(),
  );
  return (
    <>
      <PageHeading title={item ? `Edit ${item.name}` : "Add a tour package"} />
      <AdminEditor kind="packages" initial={item} destinations={destinations} />
    </>
  );
}
