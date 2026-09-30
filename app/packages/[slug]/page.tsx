import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock3, Bus, BedDouble, Car, Check } from "lucide-react";
import { packageBySlug } from "@/lib/catalog";
import { TravelImage } from "@/components/travel-image";
import { BookingWidget } from "@/components/booking-widget";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await packageBySlug((await params).slug);
  return {
    title: p?.name || "Package not found",
    description: p?.shortDescription,
  };
}
export default async function Package({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await packageBySlug((await params).slug);
  if (!p) notFound();
  return (
    <div className="container section">
      <div className="meta">
        <Link href="/packages">All packages</Link>
        <span>/</span>
        <Link href={`/destinations/${p.destination.slug}`}>
          {p.destination.name}
        </Link>
      </div>
      <div className="detail-hero">
        <TravelImage src={p.images[0]} alt={p.name} priority />
      </div>
      {p.images.length > 1 && (
        <div className="info-grid">
          {p.images.slice(1).map((src, i) => (
            <div key={src} className="summary-image">
              <TravelImage src={src} alt={`${p.name} view ${i + 2}`} />
            </div>
          ))}
        </div>
      )}
      <div className="detail-intro">
        <div className="eyebrow">
          {p.packageType.toUpperCase()} · A COMPLETE GETAWAY
        </div>
        <h1>{p.name}</h1>
        <div className="meta">
          <span>
            <MapPin size={15} />
            Hyderabad → {p.destination.name}
          </span>
          <span>
            <Clock3 size={15} />
            {p.durationDays} days / {p.durationNights} nights
          </span>
          <span>Up to {p.maximumTravelers} travelers per booking</span>
        </div>
      </div>
      <div className="detail-columns">
        <div>
          <nav className="section-tabs">
            <a href="#overview">Overview</a>
            <a href="#itinerary">Day-by-day itinerary</a>
            <a href="#included">What’s included</a>
          </nav>
          <section id="overview">
            <h2>
              A trip to <em>remember.</em>
            </h2>
            <p>{p.description}</p>
            <div className="info-grid">
              {[
                [Bus, "Getting there", p.transportation],
                [BedDouble, "Your stay", p.accommodation],
                [Car, "Getting around", p.localTransportation],
                [MapPin, "Places you’ll discover", p.placesCovered.join(" · ")],
              ].map(([Icon, title, text]) => {
                const Component = Icon as typeof Bus;
                return (
                  <div className="info-box" key={String(title)}>
                    <Component size={23} />
                    <h3>{String(title)}</h3>
                    <p>{String(text)}</p>
                  </div>
                );
              })}
            </div>
          </section>
          <section id="itinerary" className="itinerary">
            <h2>
              Every day, <em>something new.</em>
            </h2>
            {p.itinerary.map((day) => (
              <details key={day.day} open={day.day === 1}>
                <summary>
                  <span>DAY {String(day.day).padStart(2, "0")}</span>
                  {day.title}
                </summary>
                <p>{day.description}</p>
                <div className="chips">
                  {day.activities.map((a) => (
                    <span key={a}>
                      <Check size={12} />
                      {a}
                    </span>
                  ))}
                </div>
              </details>
            ))}
          </section>
          <section id="included" className="info-grid">
            <div>
              <h3>Included in your getaway</h3>
              <ul className="plain-list">
                {p.inclusions.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Plan a little extra for</h3>
              <ul className="plain-list">
                {p.exclusions.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </section>
          <div className="feedback info">
            This is an academic demo package. Transport, hotel descriptions,
            prices, and payments are simulated; no supplier reservations are
            made.
          </div>
        </div>
        <BookingWidget trip={p} />
      </div>
    </div>
  );
}
