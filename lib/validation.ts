import { z } from "zod";
const text = z.string().trim().min(2).max(300);
const paragraph = z.string().trim().min(10).max(5000);
const list = z.array(text).min(1).max(50);
const image = z
  .string()
  .url()
  .max(1000)
  .refine(
    (s) =>
      s.startsWith("https://images.unsplash.com/") || s.startsWith("https://"),
    "Use an HTTPS image URL",
  );
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid record ID");
const phone = z
  .string()
  .trim()
  .regex(/^[+\d\s()-]{7,20}$/, "Enter a valid phone number");
export const profileInput = z.object({ name: text.max(100), phone });
export const loginInput = z.object({
  email: z.string().trim().email().max(254).toLowerCase(),
  password: z.string().min(1).max(72),
});
export const registerInput = loginInput
  .extend({
    name: text.max(100),
    phone,
    password: z
      .string()
      .min(10, "Use at least 10 characters")
      .max(72)
      .regex(/[a-z]/, "Include a lowercase letter")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/\d/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date")
  .refine(
    (s) =>
      !Number.isNaN(Date.parse(s)) &&
      new Date(s).toISOString().slice(0, 10) === s,
    "Choose a valid date",
  );
export const bookingInput = z
  .object({
    packageId: objectId,
    requestId: z.string().uuid(),
    travelDate: date,
    numberOfTravelers: z.number().int().min(1).max(30),
    travelers: z
      .array(
        z.object({
          fullName: text.max(100),
          age: z.number().int().min(0).max(120),
          gender: z
            .enum(["Not specified", "Female", "Male", "Other"])
            .optional(),
          phone: z.string().max(20).optional(),
        }),
      )
      .min(1)
      .max(30),
  })
  .refine(
    (v) => v.travelers.length === v.numberOfTravelers,
    "Enter details for every traveler",
  );
export const paymentInput = z.object({
  paymentMethod: z.enum(["UPI Demo", "Card Demo", "Net Banking Demo"]),
  outcome: z.enum(["success", "failed"]),
});
export const destinationInput = z.object({
  name: text,
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
  state: text,
  country: text,
  shortDescription: text,
  description: paragraph,
  heroImage: image,
  gallery: z.array(image).max(10),
  bestTimeToVisit: text,
  attractions: list,
  basicTravelInformation: paragraph,
  active: z.boolean(),
});
export const packageInput = z
  .object({
    name: text,
    slug: destinationInput.shape.slug,
    destination: objectId,
    shortDescription: text,
    description: paragraph,
    packageType: z.enum(["Beach", "Nature", "Heritage", "Adventure", "City"]),
    pricePerPerson: z.number().int().min(1).max(1000000),
    durationDays: z.number().int().min(1).max(30),
    durationNights: z.number().int().min(0).max(29),
    maximumTravelers: z.number().int().min(1).max(30),
    transportation: paragraph,
    accommodation: paragraph,
    localTransportation: paragraph,
    placesCovered: list,
    itinerary: z
      .array(
        z.object({
          day: z.number().int().min(1),
          title: text,
          description: paragraph,
          activities: list,
        }),
      )
      .min(1)
      .max(30),
    inclusions: list,
    exclusions: list,
    images: z.array(image).min(1).max(10),
    featured: z.boolean(),
    popularity: z.number().int().min(0).max(100000),
    available: z.boolean(),
    availableFrom: date,
    availableUntil: date,
  })
  .refine(
    (v) => v.availableFrom <= v.availableUntil,
    "Availability end must follow start",
  )
  .refine(
    (v) => v.durationNights === v.durationDays - 1,
    "Nights should equal days minus one",
  )
  .refine(
    (v) =>
      v.itinerary.length === v.durationDays &&
      v.itinerary.every((d, i) => d.day === i + 1),
    "Add one sequential itinerary entry for each day",
  );
