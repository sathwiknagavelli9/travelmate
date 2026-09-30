import { Empty } from "@/components/ui";
export default function NotFound() {
  return (
    <div className="container section">
      <Empty
        title="A little off the beaten path."
        description="We couldn’t find that page. Your next adventure is still out there."
        href="/packages"
        label="Explore packages"
      />
    </div>
  );
}
