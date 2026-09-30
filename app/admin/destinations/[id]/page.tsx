import { notFound } from "next/navigation";
import { pageUser } from "@/lib/auth";
import { Destination } from "@/models";
import { serialize } from "@/lib/utils";
import type { DestinationView } from "@/types";
import { PageHeading } from "@/components/ui";
import { AdminEditor } from "@/components/admin-editor";
export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await pageUser("/admin/destinations", true);
  const { id } = await params;
  if (id !== "new" && !/^[a-f\d]{24}$/i.test(id)) notFound();
  const item =
    id === "new"
      ? undefined
      : serialize<DestinationView | null>(
          await Destination.findById(id).lean(),
        );
  if (item === null) notFound();
  return (
    <>
      <PageHeading title={item ? `Edit ${item.name}` : "Add a destination"} />
      <AdminEditor kind="destinations" initial={item} />
    </>
  );
}
