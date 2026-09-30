import { pageUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";
export const metadata = { title: "TravelMate admin" };
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await pageUser("/admin", true);
  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="admin-main">{children}</div>
    </div>
  );
}
