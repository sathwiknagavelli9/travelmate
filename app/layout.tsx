import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Logo } from "@/components/ui";
import { currentUser } from "@/lib/auth";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "TravelMate — Explore. Plan. Travel.",
    template: "%s | TravelMate",
  },
  description:
    "Discover India with complete tour packages from Hyderabad. Explore destinations, plan every detail, and book your next journey. Academic demo with simulated payments.",
};
export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser();
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav user={user} />
        <main id="main">{children}</main>
        <footer>
          <div className="container footer-main">
            <div>
              <Logo />
              <p>
                A little planning. A world of possibilities.
                <br />
                Thoughtfully crafted journeys from Hyderabad.
              </p>
            </div>
            <div>
              <strong>Your next adventure</strong>
              <Link href="/destinations">Explore destinations</Link>
              <Link href="/packages">Find a tour package</Link>
              <Link href="/my-bookings">My bookings</Link>
            </div>
            <div>
              <strong>Travel with clarity</strong>
              <p>
                Complete itineraries. Transparent demo prices.
                <br />
                Transportation and stays included as listed.
              </p>
              <span className="demo-label">
                Academic project · Simulated payments only
              </span>
            </div>
          </div>
          <div className="container footer-bottom">
            <span>
              © {new Date().getFullYear()} TravelMate. Made for the journey.
            </span>
            <span>Explore. Plan. Travel.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
