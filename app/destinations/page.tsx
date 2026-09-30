import { destinations, packages } from "@/lib/catalog";
import { PageHeading, DestinationCard, Empty } from "@/components/ui";
export const metadata = { title: "Destinations" };
export default async function Destinations() {
  const [places, trips] = await Promise.all([destinations(), packages()]);
  return (
    <div className="container section">
      <PageHeading
        eyebrow="FIND YOUR SOMEWHERE"
        title="A change of scenery awaits."
        description="From palm-fringed beaches to Himalayan mornings. Where will your curiosity take you?"
      />
      <div className="destination-grid">
        {places.map((d) => (
          <DestinationCard
            key={d._id}
            destination={d}
            count={
              trips.filter((p) => p.destination._id === d._id && p.available)
                .length
            }
          />
        ))}
      </div>
      {!places.length && (
        <Empty
          title="New destinations are on the way"
          description="Please check back soon."
        />
      )}
    </div>
  );
}
