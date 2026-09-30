"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DestinationView, PackageView } from "@/types";
import { api } from "@/lib/client-api";
import { money } from "@/lib/utils";
import { Badge } from "./ui";
export function AdminCatalog({
  kind,
  items,
}: {
  kind: "destinations" | "packages";
  items: (DestinationView | PackageView)[];
}) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const router = useRouter();
  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="admin-toolbar">
        <input
          aria-label={`Search ${kind}`}
          placeholder={`Search ${kind}…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Link className="button" href={`/admin/${kind}/new`}>
          Add {kind === "packages" ? "package" : "destination"}
        </Link>
      </div>
      {error && (
        <p className="feedback error" role="alert">
          {error}
        </p>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>{kind === "packages" ? "PRICE / DURATION" : "LOCATION"}</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>
                  <strong>{item.name}</strong>
                  <small>{item.slug}</small>
                </td>
                <td>
                  {"pricePerPerson" in item
                    ? `${money(item.pricePerPerson)} · ${item.durationDays} days`
                    : `${item.state}, ${item.country}`}
                </td>
                <td>
                  <Badge>
                    {("available" in item ? item.available : item.active)
                      ? "ACTIVE"
                      : "INACTIVE"}
                  </Badge>
                  {"featured" in item && item.featured && (
                    <small>Featured</small>
                  )}
                </td>
                <td>
                  <Link
                    className="text-link"
                    href={`/admin/${kind}/${item._id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="text-button"
                    style={{ marginLeft: 20 }}
                    disabled={
                      busy === item._id ||
                      !("available" in item ? item.available : item.active)
                    }
                    onClick={async () => {
                      if (
                        !window.confirm(
                          `Deactivate ${item.name}? Historical bookings will be preserved.`,
                        )
                      )
                        return;
                      setBusy(item._id);
                      setError("");
                      try {
                        await api(`/api/admin/${kind}/${item._id}`, "DELETE");
                        router.refresh();
                      } catch (e) {
                        setError((e as Error).message);
                      } finally {
                        setBusy("");
                      }
                    }}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={4}>No matching {kind}.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
