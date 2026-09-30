"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client-api";
import type { SessionUser } from "@/types";
export function ProfileForm({ user }: { user: SessionUser }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setBusy(true);
        const input = Object.fromEntries(new FormData(e.currentTarget));
        try {
          await api("/api/profile", "PATCH", input);
          setMessage("Your profile has been updated.");
          router.refresh();
        } catch (e) {
          setError((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="field">
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          defaultValue={user.name}
          minLength={2}
          maxLength={100}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" value={user.email} readOnly />
        <p className="field-help">Your sign-in email cannot be changed.</p>
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={user.phone}
          minLength={7}
          maxLength={20}
          required
        />
      </div>
      {message && (
        <p className="feedback success" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="feedback error" role="alert">
          {error}
        </p>
      )}
      <button className="button" disabled={busy}>
        {busy ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
