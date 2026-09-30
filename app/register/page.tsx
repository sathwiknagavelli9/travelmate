import { AuthForm } from "@/components/auth-form";
import { TravelImage } from "@/components/travel-image";
export const metadata = { title: "Create an account" };
export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-photo">
        <TravelImage
          src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85"
          alt="Goa coast"
          priority
        />
        <div className="auth-photo-copy">
          <h2>
            Make room
            <br />
            for adventure.
          </h2>
          <p>The best plans start with a little curiosity.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <AuthForm register next={(await searchParams).next} />
      </div>
    </div>
  );
}
