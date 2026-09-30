import Link from "next/link";
import {
  ArrowUpRight,
  Search,
  MapPin,
  ShieldCheck,
  Route,
  Wallet,
  MoveRight,
  Sparkles,
} from "lucide-react";
import { destinations, packages } from "@/lib/catalog";
import { DestinationCard, PackageCard } from "@/components/ui";
import { TravelImage } from "@/components/travel-image";
export default async function Home() {
  const [places, trips] = await Promise.all([
    destinations(),
    packages({ featured: "true" }),
  ]);
  return (
    <>
      <section className="hero container">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="tiny-line" />
            BIG MEMORIES START HERE
          </div>
          <h1>
            Explore.
            <br />
            Plan. <em>Travel.</em>
          </h1>
          <p>
            Discover destinations, explore complete tour packages, and book your
            next journey with TravelMate.
          </p>
          <form action="/packages" className="hero-search">
            <MapPin size={21} />
            <label className="sr-only" htmlFor="hero-query">
              Where do you want to go?
            </label>
            <input
              id="hero-query"
              name="q"
              placeholder="Where do you want to go?"
            />
            <button className="button" aria-label="Search packages">
              <Search size={18} />
              <span>Explore</span>
            </button>
          </form>
          <div className="hero-note">
            <ShieldCheck size={16} />
            Thoughtfully planned. Everything in one package.
          </div>
          <div className="hero-facts">
            <div>
              <strong>{String(places.length).padStart(2, '0')}</strong>
              <span>Beautiful destinations</span>
            </div>
            <div>
              <strong>01</strong>
              <span>Perfect place to start</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>Memories to make</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <TravelImage
            src={
              places.find((d) => d.slug === "kerala")?.heroImage ||
              "/travel-fallback.svg"
            }
            alt="Lush green hills and backwaters of Kerala"
            priority
          />
          <span className="hero-image-label">
            <MapPin size={15} /> Somewhere you’d rather be
          </span>
          <div className="hero-floating">
            <div className="float-icon">
              <Sparkles size={23} />
            </div>
            <div>
              <strong>Your next chapter starts here</strong>
              <small>Find a little more wonder.</small>
            </div>
          </div>
          <div className="vertical-caption">TAKE THE SCENIC ROUTE</div>
        </div>
      </section>
      <div className="promise-strip">
        <div className="container">
          <span>
            <Route size={19} />
            Complete, day-by-day itineraries
          </span>
          <span>
            <Wallet size={19} />
            Clear prices, no surprises
          </span>
          <span>
            <ShieldCheck size={19} />
            Simple, secure demo booking
          </span>
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">FIND YOUR SOMEWHERE</div>
            <h2>
              Different places. <em>Endless possibilities.</em>
            </h2>
          </div>
          <Link href="/destinations" className="arrow-link">
            All destinations <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="destination-grid home-destinations">
          {["goa", "kerala", "rajasthan", "manali"]
            .map((slug) => places.find((d) => d.slug === slug))
            .filter((d) => !!d)
            .map((d) => (
              <DestinationCard key={d._id} destination={d} />
            ))}
        </div>
      </section>
      <section className="soft-section">
        <div className="container section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">LESS PLANNING. MORE LIVING.</div>
              <h2>
                A good trip starts with <em>a great plan.</em>
              </h2>
              <p>
                Handpicked getaways with the little details already taken care
                of.
              </p>
            </div>
            <Link href="/packages" className="arrow-link">
              All tour packages <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="package-grid">
            {trips.slice(0, 3).map((trip) => (
              <PackageCard key={trip._id} trip={trip} />
            ))}
          </div>
        </div>
      </section>
      <section className="container section why-section">
        <div>
          <div className="eyebrow">YOUR JOURNEY, MADE SIMPLE</div>
          <h2>
            Good company.
            <br />
            <em>Even better journeys.</em>
          </h2>
          <p>
            From your first search to the last day of your trip, keep everything
            you need in one place.
          </p>
          <Link className="arrow-link" href="/packages">
            Let’s find your getaway <MoveRight size={18} />
          </Link>
        </div>
        <div className="benefits">
          {[
            [
              Route,
              "The whole trip, thoughtfully planned",
              "Transport, stays, sightseeing, and daily itineraries. See exactly what is included before you book.",
            ],
            [
              Wallet,
              "Prices that make sense",
              "Clear per-person prices and a total you can review before making a simulated payment.",
            ],
            [
              ShieldCheck,
              "Your plans, always at hand",
              "View travelers, payment status, and trip details from your personal booking dashboard.",
            ],
          ].map(([Icon, title, description]) => {
            const Component = Icon as typeof Route;
            return (
              <div className="benefit" key={String(title)}>
                <span>
                  <Component size={24} />
                </span>
                <div>
                  <h3>{String(title)}</h3>
                  <p>{String(description)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="container section steps-section">
        <div className="eyebrow">FROM DAYDREAM TO DEPARTURE</div>
        <h2>
          Four small steps. <em>One great adventure.</em>
        </h2>
        <div className="steps">
          {[
            ["Explore", "Browse destinations and tour packages."],
            ["Plan", "Check transportation, accommodation, and itinerary."],
            ["Book", "Choose your date and travelers. Confirm your package."],
            [
              "Travel",
              "Keep your booking details close and enjoy the journey.",
            ],
          ].map(([title, description], i) => (
            <div key={title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container">
        <div className="cta">
          <div className="eyebrow">
            THE WORLD CAN WAIT. YOUR NEXT TRIP SHOULDN’T.
          </div>
          <h2>
            Make room for <em>a little adventure.</em>
          </h2>
          <p>A weekend by the sea. A week in the hills. Start somewhere new.</p>
          <Link href="/packages" className="button light">
            Find my next trip <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
