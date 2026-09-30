"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client-api";
export function CancelButton({
  id,
  admin = false,
}: {
  id: string;
  admin?: boolean;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <div>
      <button
        className="button secondary"
        disabled={busy}
        onClick={async () => {
          if (
            !window.confirm(
              "Cancel this booking? Successful demo payments will be marked as refunded.",
            )
          )
            return;
          setBusy(true);
          setError("");
          try {
            await api(
              admin
                ? `/api/admin/bookings/${id}`
                : `/api/bookings/${id}/cancel`,
              admin ? "PATCH" : "POST",
              admin ? { status: "CANCELLED" } : undefined,
            );
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Cancelling…" : "Cancel booking"}
      </button>
      {error && (
        <p className="feedback error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
export function CompleteButton({ id }: { id: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <div>
      <button
        className="text-link"
        disabled={busy}
        onClick={async () => {
          if (!window.confirm("Mark this completed trip as COMPLETED?")) return;
          setBusy(true);
          try {
            await api(`/api/admin/bookings/${id}`, "PATCH", {
              status: "COMPLETED",
            });
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        Mark completed
      </button>
      {error && (
        <p className="inline-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
