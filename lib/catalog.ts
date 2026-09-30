import { connectDB } from "./db";
import { Destination, TourPackage } from "@/models";
import { serialize } from "./utils";
import type { DestinationView, PackageView } from "@/types";
import type { QueryFilter } from "mongoose";
import type { PackageData } from "@/models";
export async function destinations() {
  await connectDB();
  return serialize<DestinationView[]>(
    await Destination.find({ active: true }).sort({ name: 1 }).lean(),
  );
}
export async function destinationBySlug(slug: string) {
  await connectDB();
  return serialize<DestinationView | null>(
    await Destination.findOne({ slug, active: true }).lean(),
  );
}
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export async function packages(
  search: Record<string, string | undefined> = {},
) {
  await connectDB();
  const active = await Destination.find({ active: true })
    .select("_id name slug")
    .lean();
  const query: QueryFilter<PackageData> = {
    destination: { $in: active.map((d) => d._id) },
  };
  if (search.destination)
    query.destination = {
      $in: active
        .filter((d) => d.slug === search.destination)
        .map((d) => d._id),
    };
  if (search.q) {
    const regex = new RegExp(escapeRegex(search.q.slice(0, 100)), "i");
    query.$or = [
      { name: regex },
      {
        destination: {
          $in: active.filter((d) => regex.test(d.name)).map((d) => d._id),
        },
      },
    ];
  }
  if (
    search.type &&
    ["Beach", "Nature", "Heritage", "Adventure", "City"].includes(search.type)
  )
    query.packageType = search.type as PackageData["packageType"];
  const min = Number(search.min),
    max = Number(search.max);
  if (search.min || search.max)
    query.pricePerPerson = {
      ...(Number.isFinite(min) && min >= 0 ? { $gte: min } : {}),
      ...(search.max && Number.isFinite(max) && max >= 0 ? { $lte: max } : {}),
    };
  if (search.duration && Number.isFinite(Number(search.duration)))
    query.durationDays = { $lte: Number(search.duration) };
  if (search.featured) query.featured = true;
  const sort: Record<string, 1 | -1> =
    search.sort === "price-asc"
      ? { pricePerPerson: 1 }
      : search.sort === "price-desc"
        ? { pricePerPerson: -1 }
        : search.sort === "duration"
          ? { durationDays: 1 }
          : { popularity: -1 };
  return serialize<PackageView[]>(
    await TourPackage.find(query)
      .populate("destination")
      .sort(sort)
      .limit(100)
      .lean(),
  );
}
export async function packageBySlug(slug: string) {
  await connectDB();
  const p = serialize<PackageView | null>(
    await TourPackage.findOne({ slug }).populate("destination").lean(),
  );
  return p?.destination?.active ? p : null;
}
export async function packageById(id: string) {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  await connectDB();
  const p = serialize<PackageView | null>(
    await TourPackage.findById(id).populate("destination").lean(),
  );
  return p?.destination?.active ? p : null;
}
