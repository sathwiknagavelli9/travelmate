"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { PackageView } from "@/types";
import { money, todayIndia } from "@/lib/utils";
export function BookingWidget({ trip }: { trip: PackageView }) {
  const [count, setCount] = useState(1);
  const [date, setDate] = useState("");
  const router = useRouter();
  const tomorrow = new Date(`${todayIndia()}T00:00:00Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const min = [
    tomorrow.toISOString().slice(0, 10),
    trip.availableFrom.slice(0, 10),
  ]
    .sort()
    .at(-1);
  return (
    <aside className="panel sticky">
      <div className="eyebrow">YOUR NEXT ADVENTURE</div>
      <div className="booking-price">
        {money(trip.pricePerPerson)}{" "}
        <span className="price-caption">/ person</span>
      </div>
      <p>
        Complete package · {trip.durationDays} days, {trip.durationNights}{" "}
        nights
      </p>
      <div className="divider" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/booking/${trip._id}?date=${date}&travelers=${count}`);
        }}
      >
        <div className="field">
          <label htmlFor="travel-date">When shall we go?</label>
          <input
            id="travel-date"
            type="date"
            min={min}
            max={trip.availableUntil.slice(0, 10)}
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="traveler-count">Travelers</label>
          <select
            id="traveler-count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            {Array.from({ length: trip.maximumTravelers }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} {i ? "travelers" : "traveler"}
              </option>
            ))}
          </select>
        </div>
        <div className="price-row">
          <span>
            {money(trip.pricePerPerson)} × {count}
          </span>
          <span>{money(trip.pricePerPerson * count)}</span>
        </div>
        <div className="price-row total">
          <span>Total</span>
          <span>{money(trip.pricePerPerson * count)}</span>
        </div>
        <button
          disabled={!trip.available}
          className="button full"
          style={{ marginTop: 20 }}
        >
          {trip.available ? "Book this getaway" : "Currently unavailable"}
          <ArrowUpRight size={17} />
        </button>
      </form>
      <div className="hero-note">
        <ShieldCheck size={15} />
        Demo payment. No real money charged.
      </div>
      <p className="field-help">
        Departures until {trip.availableUntil.slice(0, 10)}. Cancel before your
        travel date for a simulated refund.
      </p>
    </aside>
  );
}
