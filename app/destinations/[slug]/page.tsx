import { notFound } from "next/navigation";
import { destinationBySlug, packages } from "@/lib/catalog";
import { PackageCard, Empty } from "@/components/ui";
import { TravelImage } from "@/components/travel-image";
import { MapPin, CalendarDays } from "lucide-react";
export default async function Destination({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [d, trips] = await Promise.all([
    destinationBySlug(slug),
    packages({ destination: slug }),
  ]);
  if (!d) notFound();
  return (
    <div className="container section">
      <div className="detail-hero">
        <TravelImage src={d.heroImage} alt={d.name} priority />
        <div className="detail-hero-copy">
          <div className="eyebrow">
            {d.state} · {d.country}
          </div>
          <h1>{d.name}</h1>
          <p>{d.shortDescription}</p>
        </div>
      </div>
      <div className="detail-columns section">
        <div>
          <h2>
            A place to <em>feel a little different.</em>
          </h2>
          <p>{d.description}</p>
          <h3>Places worth the journey</h3>
          <div className="chips">
            {d.attractions.map((a) => (
              <span key={a}>
                <MapPin size={14} />
                {a}
              </span>
            ))}
          </div>
          <h3>Before you go</h3>
          <p>{d.basicTravelInformation}</p>
        </div>
        <aside className="panel">
          <CalendarDays size={26} />
          <h3>Best time to visit</h3>
          <p>{d.bestTimeToVisit}</p>
          <div className="divider" />
          <p>
            All listed tours depart from Hyderabad. Review each itinerary for
            travel time and inclusions.
          </p>
        </aside>
      </div>
      <div className="section-heading">
        <h2>
          Your {d.name} <em>getaway.</em>
        </h2>
        <span>{trips.length} curated packages</span>
      </div>
      <div className="package-grid">
        {trips.map((p) => (
          <PackageCard key={p._id} trip={p} />
        ))}
      </div>
      {!trips.length && (
        <Empty
          title="Trips are being planned"
          description="Explore our other destinations in the meantime."
          href="/packages"
          label="Browse packages"
        />
      )}
    </div>
  );
}
