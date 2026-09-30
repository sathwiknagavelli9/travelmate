"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PackageView, BookingView, SessionUser } from "@/types";
import { money, dateLabel, todayIndia } from "@/lib/utils";
import { api } from "@/lib/client-api";
import { TravelImage } from "./travel-image";
export function Checkout({
  trip,
  initialDate,
  initialCount,
  user,
}: {
  trip: PackageView;
  initialDate?: string;
  initialCount?: string;
  user: SessionUser;
}) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(initialDate || "");
  const [count, setCount] = useState(
    Math.min(trip.maximumTravelers, Math.max(1, Number(initialCount) || 1)),
  );
  const [travelers, setTravelers] = useState<
    { fullName: string; age: number; gender: string; phone: string }[]
  >([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [requestId] = useState(() => crypto.randomUUID());
  const router = useRouter();
  const tomorrow = new Date(`${todayIndia()}T00:00:00Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const min = [
    tomorrow.toISOString().slice(0, 10),
    trip.availableFrom.slice(0, 10),
  ]
    .sort()
    .at(-1);
  async function book() {
    setBusy(true);
    setError("");
    try {
      const booking = await api<BookingView>("/api/bookings", "POST", {
        packageId: trip._id,
        requestId,
        travelDate: date,
        numberOfTravelers: count,
        travelers,
      });
      router.push(`/my-bookings/${booking._id}/payment`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <>
      <div className="booking-progress">
        <span className={step === 1 ? "active" : ""}>
          01 · Traveler details
        </span>
        <span className={step === 2 ? "active" : ""}>
          02 · Review your trip
        </span>
        <span>03 · Demo payment</span>
      </div>
      <div className="booking-layout">
        <div className="panel">
          {step === 1 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                setDate(String(data.get("travelDate")));
                setTravelers(
                  Array.from({ length: count }, (_, i) => ({
                    fullName: String(data.get(`name-${i}`)),
                    age: Number(data.get(`age-${i}`)),
                    gender: String(data.get(`gender-${i}`)),
                    phone: String(data.get(`phone-${i}`) || ""),
                  })),
                );
                setStep(2);
              }}
            >
              <h2 style={{ fontSize: 28 }}>Who’s coming along?</h2>
              <p>
                Choose your departure date and tell us a little about each
                traveler.
              </p>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="date">Travel date</label>
                  <input
                    type="date"
                    id="date"
                    name="travelDate"
                    required
                    min={min}
                    max={trip.availableUntil.slice(0, 10)}
                    defaultValue={date}
                  />
                </div>
                <div className="field">
                  <label htmlFor="count">Number of travelers</label>
                  <select
                    id="count"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                  >
                    {Array.from({ length: trip.maximumTravelers }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} {i === 0 ? "traveler" : "travelers"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {Array.from({ length: count }, (_, i) => (
                <div className="traveler-block" key={i}>
                  <h3>
                    Traveler {i + 1}
                    {i === 0 ? " · Lead traveler" : ""}
                  </h3>
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor={`name-${i}`}>Full name</label>
                      <input
                        id={`name-${i}`}
                        name={`name-${i}`}
                        required
                        minLength={2}
                        maxLength={100}
                        defaultValue={
                          travelers[i]?.fullName || (i === 0 ? user.name : "")
                        }
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`age-${i}`}>Age</label>
                      <input
                        id={`age-${i}`}
                        name={`age-${i}`}
                        type="number"
                        min={0}
                        max={120}
                        required
                        defaultValue={travelers[i]?.age}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`gender-${i}`}>Gender (optional)</label>
                      <select
                        id={`gender-${i}`}
                        name={`gender-${i}`}
                        defaultValue={travelers[i]?.gender || "Not specified"}
                      >
                        <option>Not specified</option>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor={`phone-${i}`}>Phone (optional)</label>
                      <input
                        id={`phone-${i}`}
                        name={`phone-${i}`}
                        type="tel"
                        maxLength={20}
                        defaultValue={
                          travelers[i]?.phone || (i === 0 ? user.phone : "")
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="button full" disabled={!trip.available}>
                Review my booking
              </button>
            </form>
          ) : (
            <div>
              <h2 style={{ fontSize: 28 }}>Your getaway, at a glance.</h2>
              <p>Check the details before creating your booking.</p>
              <div className="price-row">
                <span>Travel date</span>
                <strong>{dateLabel(date)}</strong>
              </div>
              <div className="price-row">
                <span>Travelers</span>
                <strong>{count}</strong>
              </div>
              <div className="divider" />
              {travelers.map((t, i) => (
                <div className="price-row" key={i}>
                  <strong>{t.fullName}</strong>
                  <span>Age {t.age}</span>
                </div>
              ))}
              <div className="feedback info">
                This is a complete demo tour package. No real reservations are
                made. You can cancel before your travel date for a simulated
                refund.
              </div>
              {error && (
                <div className="feedback error" role="alert">
                  {error}
                </div>
              )}
              <div className="actions">
                <button
                  className="button secondary"
                  disabled={busy}
                  onClick={() => setStep(1)}
                >
                  Edit details
                </button>
                <button className="button" disabled={busy} onClick={book}>
                  {busy ? "Creating booking…" : "Continue to demo payment"}
                </button>
              </div>
            </div>
          )}
        </div>
        <aside className="panel summary-card">
          <div className="summary-image">
            <TravelImage src={trip.images[0]} alt={trip.name} />
          </div>
          <div className="eyebrow">YOUR PLANS ARE TAKING SHAPE</div>
          <h3>{trip.name}</h3>
          <p>
            {trip.destination.name} · {trip.durationDays} days /{" "}
            {trip.durationNights} nights
          </p>
          <div className="divider" />
          <div className="price-row">
            <span>Per person</span>
            <span>{money(trip.pricePerPerson)}</span>
          </div>
          <div className="price-row">
            <span>Travelers</span>
            <span>{count}</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <span>{money(trip.pricePerPerson * count)}</span>
          </div>
          <p className="field-help">
            Includes the listed package taxes. No hidden demo fees.
          </p>
        </aside>
      </div>
    </>
  );
}
