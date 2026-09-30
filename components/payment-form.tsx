"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { api } from "@/lib/client-api";
import { money } from "@/lib/utils";
export function PaymentForm({ id, amount }: { id: string; amount: number }) {
  const [method, setMethod] = useState("UPI Demo");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function pay(outcome: string) {
    setBusy(true);
    setError("");
    try {
      await api(`/api/bookings/${id}/pay`, "POST", {
        paymentMethod: method,
        outcome,
      });
      if (outcome === "failed") {
        setError(
          "Demo payment failed as requested. No charge was made. You can retry below.",
        );
        router.refresh();
      } else {
        router.push(`/my-bookings/${id}?confirmed=1`);
        router.refresh();
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <div className="feedback info">
        <ShieldCheck size={20} />
        <strong>Simulated payment only</strong>
        <br />
        No real money will be charged. Never enter card numbers, CVVs, UPI PINs,
        or bank passwords here.
      </div>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="field-label">Choose a demo payment method</legend>
        <div className="payment-options">
          {["UPI Demo", "Card Demo", "Net Banking Demo"].map((m) => (
            <label className="payment-option" key={m}>
              <input
                type="radio"
                name="method"
                value={m}
                checked={method === m}
                onChange={() => setMethod(m)}
              />
              {m}
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <div className="feedback error" role="alert">
          {error}
        </div>
      )}
      <button
        className="button full"
        disabled={busy}
        onClick={() => pay("success")}
      >
        {busy ? "Processing…" : `Pay ${money(amount)} — Demo Payment`}
      </button>
      <button
        className="text-button"
        style={{ marginTop: 18 }}
        disabled={busy}
        onClick={() => pay("failed")}
      >
        Test a failed payment
      </button>
    </div>
  );
}
