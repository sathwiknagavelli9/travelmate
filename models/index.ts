import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
const requiredText = { type: String, required: true, trim: true };
const userSchema = new Schema(
  {
    name: requiredText,
    email: { ...requiredText, unique: true, lowercase: true },
    passwordHash: { ...requiredText, select: false },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true },
);
const destinationSchema = new Schema(
  {
    name: requiredText,
    slug: { ...requiredText, unique: true },
    state: requiredText,
    country: { type: String, default: "India" },
    shortDescription: requiredText,
    description: requiredText,
    heroImage: requiredText,
    gallery: [String],
    bestTimeToVisit: requiredText,
    attractions: [String],
    basicTravelInformation: requiredText,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
const itinerarySchema = new Schema(
  {
    day: { type: Number, required: true, min: 1 },
    title: requiredText,
    description: requiredText,
    activities: [String],
  },
  { _id: false },
);
const packageSchema = new Schema(
  {
    name: requiredText,
    slug: { ...requiredText, unique: true },
    destination: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
      index: true,
    },
    shortDescription: requiredText,
    description: requiredText,
    packageType: {
      type: String,
      enum: ["Beach", "Nature", "Heritage", "Adventure", "City"],
      required: true,
    },
    pricePerPerson: { type: Number, required: true, min: 1 },
    durationDays: { type: Number, required: true, min: 1 },
    durationNights: { type: Number, required: true, min: 0 },
    maximumTravelers: { type: Number, required: true, min: 1, max: 30 },
    transportation: requiredText,
    accommodation: requiredText,
    localTransportation: requiredText,
    placesCovered: [String],
    itinerary: [itinerarySchema],
    inclusions: [String],
    exclusions: [String],
    images: [String],
    featured: { type: Boolean, default: false },
    popularity: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    availableFrom: { type: Date, required: true },
    availableUntil: { type: Date, required: true },
  },
  { timestamps: true },
);
packageSchema.index({ available: 1, pricePerPerson: 1 });
const bookingSchema = new Schema(
  {
    bookingCode: { ...requiredText, unique: true },
    requestId: requiredText,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    package: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    packageName: requiredText,
    destinationName: requiredText,
    packageImage: requiredText,
    travelDate: { type: Date, required: true },
    durationDays: { type: Number, required: true },
    numberOfTravelers: { type: Number, required: true, min: 1 },
    travelers: [
      new Schema(
        {
          fullName: requiredText,
          age: { type: Number, required: true, min: 0, max: 120 },
          gender: String,
          phone: String,
        },
        { _id: false },
      ),
    ],
    pricePerPersonAtBooking: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESSFUL", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    cancelledAt: Date,
    cancellationReason: String,
  },
  { timestamps: true },
);
bookingSchema.index({ user: 1, requestId: 1 }, { unique: true });
const paymentSchema = new Schema(
  {
    transactionId: { ...requiredText, unique: true },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 1 },
    paymentMethod: {
      type: String,
      enum: ["UPI Demo", "Card Demo", "Net Banking Demo"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESSFUL", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    paidAt: Date,
  },
  { timestamps: true },
);
const rateSchema = new Schema({
  key: { type: String, unique: true, required: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, expires: 0 },
});
function model<T>(name: string, schema: Schema<T>): Model<T> {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema);
}
export const User = model("User", userSchema);
export const Destination = model("Destination", destinationSchema);
export const TourPackage = model("Package", packageSchema);
export const Booking = model("Booking", bookingSchema);
export const Payment = model("Payment", paymentSchema);
export const RateLimit = model("RateLimit", rateSchema);
export type UserData = InferSchemaType<typeof userSchema>;
export type DestinationData = InferSchemaType<typeof destinationSchema>;
export type PackageData = InferSchemaType<typeof packageSchema>;
