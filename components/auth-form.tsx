"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client-api";
import { safeReturn } from "@/lib/utils";
export function AuthForm({
  register = false,
  next,
}: {
  register?: boolean;
  next?: string;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result = await api<{ role: string }>(
        register ? "/api/auth/register" : "/api/auth/login",
        "POST",
        data,
      );
      router.push(
        next
          ? safeReturn(next)
          : result.role === "ADMIN"
            ? "/admin"
            : "/my-bookings",
      );
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <div className="eyebrow">A LITTLE CLOSER TO YOUR NEXT ADVENTURE</div>
      <h1>
        {register ? "Your journey starts here." : "Good to see you again."}
      </h1>
      <p>
        {register
          ? "Create an account to save your plans and book your next getaway."
          : "Log in to pick up where your plans left off."}
      </p>
      <form onSubmit={submit}>
        {register && (
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
            />
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        {register && (
          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              minLength={7}
              maxLength={20}
            />
          </div>
        )}
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={register ? "new-password" : "current-password"}
            required
            minLength={register ? 10 : 1}
            maxLength={72}
          />
          {register && (
            <p className="field-help">
              At least 10 characters, with an uppercase letter, lowercase
              letter, and number.
            </p>
          )}
        </div>
        {register && (
          <div className="field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              maxLength={72}
            />
          </div>
        )}
        {error && (
          <div className="feedback error" role="alert">
            {error}
          </div>
        )}
        <button className="button full" disabled={busy}>
          {busy ? "Just a moment…" : register ? "Create my account" : "Log in"}
        </button>
      </form>
      <div className="form-footer">
        {register ? "Already have an account?" : "New to TravelMate?"}{" "}
        <Link
          href={`${register ? "/login" : "/register"}${next ? `?next=${encodeURIComponent(next)}` : ""}`}
        >
          {register ? "Log in" : "Create an account"}
        </Link>
      </div>
    </div>
  );
}
