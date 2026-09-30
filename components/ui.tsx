import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Compass } from "lucide-react";
import type { PackageView, DestinationView } from "@/types";
import { money } from "@/lib/utils";
import { TravelImage } from "./travel-image";
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="TravelMate home">
      <span className="logo-mark">
        <Compass size={23} />
      </span>
      travelmate<span className="logo-dot">.</span>
    </Link>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="page-heading">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}
export function Empty({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="empty">
      <Compass size={36} />
      <h2>{title}</h2>
      <p>{description}</p>
      {href && (
        <Link className="button" href={href}>
          {label}
        </Link>
      )}
    </div>
  );
}
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className={`badge ${String(children).toLowerCase()}`}>
      {children}
    </span>
  );
}
export function PackageCard({ trip }: { trip: PackageView }) {
  return (
    <article className="package-card">
      <Link className="card-image" href={`/packages/${trip.slug}`}>
        <TravelImage src={trip.images[0]} alt={trip.destination.name} />
        <span className="image-tag">{trip.packageType}</span>
        {!trip.available && (
          <span className="unavailable-tag">Currently unavailable</span>
        )}
      </Link>
      <div className="card-body">
        <div className="meta">
          <span>
            <MapPin size={13} />
            {trip.destination.name}
          </span>
          <span>
            <Clock3 size={13} />
            {trip.durationDays}D / {trip.durationNights}N
          </span>
        </div>
        <h3>
          <Link href={`/packages/${trip.slug}`}>{trip.name}</Link>
        </h3>
        <p>{trip.shortDescription}</p>
        <div className="card-bottom">
          <div>
            <strong>{money(trip.pricePerPerson)}</strong>
            <small> / person</small>
          </div>
          <Link
            href={`/packages/${trip.slug}`}
            className="round-link"
            aria-label={`View ${trip.name}`}
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </article>
  );
}
export function DestinationCard({
  destination,
  count,
}: {
  destination: DestinationView;
  count?: number;
}) {
  return (
    <Link
      className="destination-card"
      href={`/destinations/${destination.slug}`}
    >
      <TravelImage src={destination.heroImage} alt={destination.name} />
      <div className="destination-overlay">
        <small>
          {destination.state}, {destination.country}
        </small>
        <h3>{destination.name}</h3>
        <p>{destination.shortDescription}</p>
        <span>
          {count !== undefined
            ? `${count} ${count === 1 ? "package" : "packages"} · `
            : ""}
          Explore destination <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  );
}
