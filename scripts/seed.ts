import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import {
  User,
  Destination,
  TourPackage,
  Booking,
  Payment,
  RateLimit,
} from "../models";
import { trips } from "./seed-data";
async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password || password.length < 12)
    throw new Error("Set a seed admin email and strong password in .env.local");
  await connectDB();
  await Promise.all([
    User.init(),
    Destination.init(),
    TourPackage.init(),
    Booking.init(),
    Payment.init(),
    RateLimit.init(),
  ]);
  const existing = await User.findOne({ email });
  if (existing && existing.role !== "ADMIN")
    throw new Error("Seed email already belongs to a non-admin account");
  await User.updateOne(
    { email },
    {
      $setOnInsert: {
        name: "TravelMate Admin",
        email,
        passwordHash: await bcrypt.hash(password, 12),
        phone: "+91 9000000000",
        role: "ADMIN",
      },
    },
    { upsert: true },
  );
  for (const [index, trip] of trips.entries()) {
    const destination = await Destination.findOneAndUpdate(
      { slug: trip.slug },
      {
        $setOnInsert: {
          name: trip.name,
          slug: trip.slug,
          state: trip.state,
          country: "India",
          shortDescription: trip.short,
          description: trip.description,
          heroImage: trip.image,
          gallery: [trip.image],
          bestTimeToVisit: trip.best,
          attractions: [...trip.attractions],
          basicTravelInformation: `All packages start from Hyderabad. Carry a government-issued ID and arrive at the boarding point early. ${trip.transport} These are academic demo arrangements, not real supplier reservations.`,
          active: true,
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    await TourPackage.updateOne(
      { slug: `${trip.slug}-from-hyderabad` },
      {
        $setOnInsert: {
          name: trip.title,
          slug: `${trip.slug}-from-hyderabad`,
          destination: destination._id,
          shortDescription: trip.short,
          description: trip.description,
          packageType: trip.type,
          pricePerPerson: trip.price,
          durationDays: trip.days.length,
          durationNights: trip.days.length - 1,
          maximumTravelers: 12,
          transportation: trip.transport,
          accommodation: trip.stay,
          localTransportation: trip.local,
          placesCovered: [...trip.attractions],
          itinerary: trip.days.map((day, i) => ({
            day: i + 1,
            title: day[0],
            description: day[1],
            activities: [...day[2]],
          })),
          inclusions: [
            "Accommodation on twin-sharing basis",
            "Daily breakfast at the listed accommodation",
            "Transportation and transfers described in this package",
            "Scheduled sightseeing with driver assistance",
            "Demo package taxes included",
          ],
          exclusions: [
            "Lunch and dinner unless explicitly listed",
            "Monument admission tickets and camera fees",
            "Personal expenses, shopping, and tips",
            "Optional adventure activities and travel insurance",
            "Any service not explicitly included",
          ],
          images: [trip.image],
          featured: index < 4,
          popularity: 100 - index * 7,
          available: true,
          availableFrom: new Date("2026-09-01"),
          availableUntil: new Date("2028-12-31"),
        },
      },
      { upsert: true },
    );
  }
  console.log(
    `Seed complete: ${await Destination.countDocuments()} destinations, ${await TourPackage.countDocuments()} packages. Existing records preserved.`,
  );
}
seed()
  .catch((error) => {
    console.error(
      "Seed failed:",
      error.name,
      error.name === "MongoServerSelectionError"
        ? "Check Atlas connectivity and network access."
        : "Check configuration and database constraints.",
    );
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
