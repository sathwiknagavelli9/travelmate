"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./ui";
import type { SessionUser } from "@/types";
export function Nav({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const links = [
    ["/", "Home"],
    ["/destinations", "Destinations"],
    ["/packages", "Tour packages"],
  ];
  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      setError("Unable to sign out. Please retry.");
    }
  }
  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <Logo />
          <div className="desktop-links">
            {links.map(([href, title]) => (
              <Link
                className={pathname === href ? "active" : ""}
                key={href}
                href={href}
              >
                {title}
              </Link>
            ))}
          </div>
          <div className="desktop-links auth-links">
            {user ? (
              <>
                <Link href={user.role === "ADMIN" ? "/admin" : "/my-bookings"}>
                  {user.role === "ADMIN" ? "Dashboard" : "My bookings"}
                </Link>
                <Link
                  href="/profile"
                  className="avatar"
                  aria-label="Your profile"
                >
                  {user.name[0]}
                </Link>
                <button className="text-button" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login">Log in</Link>
                <Link className="button small" href="/register">
                  Get started <ArrowUpRight size={16} />
                </Link>
              </>
            )}
          </div>
          <button
            className="mobile-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="mobile-menu">
            {[
              ...links,
              ...(user
                ? [
                    [
                      user.role === "ADMIN" ? "/admin" : "/my-bookings",
                      user.role === "ADMIN" ? "Dashboard" : "My bookings",
                    ],
                    ["/profile", "Profile"],
                  ]
                : [
                    ["/login", "Log in"],
                    ["/register", "Get started"],
                  ]),
            ].map(([href, title]) => (
              <Link href={href} key={href} onClick={() => setOpen(false)}>
                {title}
              </Link>
            ))}
            {user && <button onClick={logout}>Log out</button>}
          </div>
        )}
      </nav>
      {error && (
        <div className="feedback error" role="alert">
          {error}
        </div>
      )}
    </>
  );
}
