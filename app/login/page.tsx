import { AuthForm } from "@/components/auth-form";
import { TravelImage } from "@/components/travel-image";
export const metadata = { title: "Log in" };
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-photo">
        <TravelImage
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85"
          alt="Green Kerala hills"
          priority
        />
        <div className="auth-photo-copy">
          <h2>
            Somewhere new.
            <br />
            Something unforgettable.
          </h2>
          <p>Your next great story is just a journey away.</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <AuthForm next={(await searchParams).next} />
      </div>
    </div>
  );
}
