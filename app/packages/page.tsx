import Link from "next/link";
import { destinations, packages } from "@/lib/catalog";
import { PageHeading, PackageCard, Empty } from "@/components/ui";
export const metadata = { title: "Tour packages" };
export default async function Packages({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [
      k,
      typeof v === "string" ? v : undefined,
    ]),
  );
  const [places, trips] = await Promise.all([
    destinations(),
    packages(filters),
  ]);
  return (
    <div className="container section">
      <PageHeading
        eyebrow="YOUR NEXT GREAT STORY"
        title="Find a trip that feels like you."
        description="Complete getaways from Hyderabad. Stays, transport, and memorable days, all planned together."
      />
      <form className="filter-panel" action="/packages">
        <div className="filter-search">
          <label htmlFor="q">Search your next escape</label>
          <input
            id="q"
            name="q"
            defaultValue={filters.q}
            placeholder="Destination or package name"
          />
        </div>
        <div>
          <label htmlFor="destination">Destination</label>
          <select
            id="destination"
            name="destination"
            defaultValue={filters.destination || ""}
          >
            <option value="">Everywhere</option>
            {places.map((d) => (
              <option key={d._id} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type">Trip style</label>
          <select id="type" name="type" defaultValue={filters.type || ""}>
            <option value="">All styles</option>
            {["Beach", "Nature", "Heritage", "Adventure", "City"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="duration">Duration</label>
          <select
            id="duration"
            name="duration"
            defaultValue={filters.duration || ""}
          >
            <option value="">Any duration</option>
            <option value="3">Up to 3 days</option>
            <option value="4">Up to 4 days</option>
            <option value="5">Up to 5 days</option>
            <option value="7">Up to 7 days</option>
          </select>
        </div>
        <div>
          <label htmlFor="min">Min price (₹)</label>
          <input
            type="number"
            id="min"
            name="min"
            min="0"
            defaultValue={filters.min}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="max">Max price (₹)</label>
          <input
            type="number"
            id="max"
            name="max"
            min="0"
            defaultValue={filters.max}
            placeholder="Any budget"
          />
        </div>
        <div>
          <label htmlFor="sort">Sort by</label>
          <select
            id="sort"
            name="sort"
            defaultValue={filters.sort || "popularity"}
          >
            <option value="popularity">Most popular</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="duration">Shortest first</option>
          </select>
        </div>
        <button className="button">Find my trip</button>
        <Link className="text-link" href="/packages">
          Reset filters
        </Link>
      </form>
      <div className="results-heading">
        <strong>
          {trips.length} {trips.length === 1 ? "getaway" : "getaways"} to look
          forward to
        </strong>
        <span>Demo prices · per person</span>
      </div>
      <div className="package-grid">
        {trips.map((p) => (
          <PackageCard key={p._id} trip={p} />
        ))}
      </div>
      {!trips.length && (
        <Empty
          title="A different adventure, perhaps?"
          description="No packages match these filters. Try another destination or a wider budget."
          href="/packages"
          label="Clear filters"
        />
      )}
    </div>
  );
}
