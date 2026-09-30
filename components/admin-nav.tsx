"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Luggage,
  CalendarCheck,
  Users,
  Wallet,
} from "lucide-react";
export function AdminNav() {
  const path = usePathname();
  return (
    <aside className="admin-sidebar">
      <div className="eyebrow">TRAVELMATE STUDIO</div>
      {[
        ["/admin", "Overview", LayoutDashboard],
        ["/admin/destinations", "Destinations", MapPin],
        ["/admin/packages", "Packages", Luggage],
        ["/admin/bookings", "Bookings", CalendarCheck],
        ["/admin/users", "Travelers", Users],
        ["/admin/payments", "Payments", Wallet],
      ].map(([href, label, Icon]) => {
        const Component = Icon as typeof MapPin;
        return (
          <Link
            key={String(href)}
            href={String(href)}
            className={
              (
                href === "/admin"
                  ? path === href
                  : path.startsWith(String(href))
              )
                ? "active"
                : ""
            }
          >
            <Component size={18} />
            {String(label)}
          </Link>
        );
      })}
    </aside>
  );
}
