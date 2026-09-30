"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { DestinationView, PackageView } from "@/types";
import { api } from "@/lib/client-api";
type Day = {
  day: number;
  title: string;
  description: string;
  activities: string[];
};
export function AdminEditor({
  kind,
  initial,
  destinations = [],
}: {
  kind: "destinations" | "packages";
  initial?: DestinationView | PackageView;
  destinations?: DestinationView[];
}) {
  const p = initial && "itinerary" in initial ? initial : undefined;
  const d = initial && "heroImage" in initial ? initial : undefined;
  const [days, setDays] = useState<Day[]>(
    p?.itinerary || [{ day: 1, title: "", description: "", activities: [] }],
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const isPackage = kind === "packages";
  function field(
    name: string,
    label: string,
    value: string | number = "",
    type = "text",
    required = true,
  ) {
    return (
      <div className="field" key={name}>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          defaultValue={value}
          type={type}
          required={required}
          min={type === "number" ? 0 : undefined}
        />
      </div>
    );
  }
  function area(
    name: string,
    label: string,
    value: string | string[] = "",
    required = true,
  ) {
    return (
      <div className="field wide" key={name}>
        <label htmlFor={name}>{label}</label>
        <textarea
          id={name}
          name={name}
          defaultValue={Array.isArray(value) ? value.join("\n") : value}
          required={required}
        />
      </div>
    );
  }
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form);
    const lists = isPackage
      ? ["images", "placesCovered", "inclusions", "exclusions"]
      : ["gallery", "attractions"];
    lists.forEach((k) => {
      data[k] = String(data[k] || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    });
    if (isPackage) {
      [
        "pricePerPerson",
        "durationDays",
        "durationNights",
        "maximumTravelers",
        "popularity",
      ].forEach((k) => {
        data[k] = Number(data[k]);
      });
      data.available = form.has("available");
      data.featured = form.has("featured");
      data.itinerary = days.map((day, i) => ({ ...day, day: i + 1 }));
    } else data.active = form.has("active");
    try {
      await api(
        `/api/admin/${kind}${initial ? `/${initial._id}` : ""}`,
        initial ? "PATCH" : "POST",
        data,
      );
      router.push(`/admin/${kind}`);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function changeDay(
    index: number,
    key: "title" | "description" | "activities",
    value: string,
  ) {
    setDays(
      days.map((day, i) =>
        i === index
          ? { ...day, [key]: key === "activities" ? value.split("\n") : value }
          : day,
      ),
    );
  }
  return (
    <form className="admin-editor" onSubmit={submit}>
      <section className="editor-section">
        <h2>The essentials</h2>
        <div className="form-grid">
          {field("name", "Name", initial?.name)}
          {field("slug", "URL slug (lowercase-with-hyphens)", initial?.slug)}
          {isPackage ? (
            <>
              <div className="field">
                <label htmlFor="destination">Destination</label>
                <select
                  name="destination"
                  id="destination"
                  defaultValue={p?.destination._id || ""}
                  required
                >
                  <option value="" disabled>
                    Choose a destination
                  </option>
                  {destinations.map((d) => (
                    <option value={d._id} key={d._id}>
                      {d.name}
                      {!d.active ? " (inactive)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="packageType">Package style</label>
                <select
                  name="packageType"
                  id="packageType"
                  defaultValue={p?.packageType || "Nature"}
                >
                  {["Beach", "Nature", "Heritage", "Adventure", "City"].map(
                    (t) => (
                      <option key={t}>{t}</option>
                    ),
                  )}
                </select>
              </div>
            </>
          ) : (
            <>
              {field("state", "State", d?.state)}
              {field("country", "Country", d?.country || "India")}
            </>
          )}
          {area(
            "shortDescription",
            "Short description",
            initial?.shortDescription,
          )}
          {area("description", "Full description", initial?.description)}
        </div>
      </section>
      {isPackage ? (
        <>
          <section className="editor-section">
            <h2>Pricing & availability</h2>
            <div className="form-grid">
              {field(
                "pricePerPerson",
                "Price per person (₹)",
                p?.pricePerPerson || "",
                "number",
              )}
              {field(
                "maximumTravelers",
                "Maximum travelers per booking",
                p?.maximumTravelers || 12,
                "number",
              )}
              {field(
                "durationDays",
                "Duration (days)",
                p?.durationDays || days.length,
                "number",
              )}
              {field(
                "durationNights",
                "Duration (nights)",
                p?.durationNights ?? 0,
                "number",
              )}
              {field(
                "availableFrom",
                "Available from",
                p?.availableFrom.slice(0, 10) || "",
                "date",
              )}
              {field(
                "availableUntil",
                "Available until",
                p?.availableUntil.slice(0, 10) || "",
                "date",
              )}
              {field(
                "popularity",
                "Popularity ranking score",
                p?.popularity || 0,
                "number",
              )}
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="available"
                defaultChecked={p?.available ?? true}
              />
              Available for booking
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={p?.featured ?? false}
              />
              Featured on homepage
            </label>
          </section>
          <section className="editor-section">
            <h2>Stay, travel & inclusions</h2>
            {area(
              "transportation",
              "Transport from Hyderabad",
              p?.transportation,
            )}
            {area("accommodation", "Accommodation", p?.accommodation)}
            {area(
              "localTransportation",
              "Local transportation",
              p?.localTransportation,
            )}
            {area(
              "placesCovered",
              "Places covered — one per line",
              p?.placesCovered,
            )}
            {area("inclusions", "Inclusions — one per line", p?.inclusions)}
            {area("exclusions", "Exclusions — one per line", p?.exclusions)}
            {area("images", "HTTPS image URLs — one per line", p?.images)}
          </section>
          <section className="editor-section">
            <h2>Day-by-day itinerary</h2>
            <p className="field-help">
              Add one day per duration day. Update the duration above when
              adding or removing days.
            </p>
            {days.map((day, i) => (
              <div className="day-editor" key={i}>
                <div className="day-editor-header">
                  <h3>Day {i + 1}</h3>
                  <button
                    className="text-button"
                    type="button"
                    disabled={days.length === 1}
                    onClick={() =>
                      setDays(days.filter((_, index) => index !== i))
                    }
                  >
                    Remove day
                  </button>
                </div>
                <div className="field">
                  <label htmlFor={`day-title-${i}`}>Day title</label>
                  <input
                    id={`day-title-${i}`}
                    value={day.title}
                    required
                    onChange={(e) => changeDay(i, "title", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`day-description-${i}`}>Description</label>
                  <textarea
                    id={`day-description-${i}`}
                    value={day.description}
                    required
                    onChange={(e) =>
                      changeDay(i, "description", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`day-activities-${i}`}>
                    Activities — one per line
                  </label>
                  <textarea
                    id={`day-activities-${i}`}
                    value={day.activities.join("\n")}
                    required
                    onChange={(e) => changeDay(i, "activities", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="button secondary"
              disabled={days.length >= 30}
              onClick={() =>
                setDays([
                  ...days,
                  {
                    day: days.length + 1,
                    title: "",
                    description: "",
                    activities: [],
                  },
                ])
              }
            >
              Add itinerary day
            </button>
          </section>
        </>
      ) : (
        <section className="editor-section">
          <h2>Destination details</h2>
          {field("heroImage", "Hero image (HTTPS URL)", d?.heroImage, "url")}
          {area(
            "gallery",
            "Gallery URLs — one per line (optional)",
            d?.gallery,
            false,
          )}
          {field("bestTimeToVisit", "Best time to visit", d?.bestTimeToVisit)}
          {area("attractions", "Attractions — one per line", d?.attractions)}
          {area(
            "basicTravelInformation",
            "Basic travel information",
            d?.basicTravelInformation,
          )}
          <label className="checkbox-label">
            <input
              name="active"
              type="checkbox"
              defaultChecked={d?.active ?? true}
            />
            Active destination
          </label>
        </section>
      )}
      {error && (
        <div className="feedback error" role="alert">
          {error}
        </div>
      )}
      <div className="actions">
        <button className="button" disabled={busy}>
          {busy ? "Saving…" : `Save ${isPackage ? "package" : "destination"}`}
        </button>
        <Link href={`/admin/${kind}`} className="button secondary">
          Back to list
        </Link>
      </div>
    </form>
  );
}
