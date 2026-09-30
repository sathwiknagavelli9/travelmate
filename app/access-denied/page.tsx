import { Empty } from "@/components/ui";
export default function Denied() {
  return (
    <div className="container section">
      <Empty
        title="This area is for administrators"
        description="Your traveler account can access bookings and profile settings."
        href="/my-bookings"
        label="Go to my bookings"
      />
    </div>
  );
}
