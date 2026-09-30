import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { Booking, Destination, TourPackage, Payment } from "@/models";
import { bookingInput, paymentInput } from "./validation";
import { connectDB } from "./db";
import { AppError } from "./errors";
import { canCancel, validateTravel } from "./booking-rules";
import { todayIndia } from "./utils";
export async function createBooking(userId: string, raw: unknown) {
  const input = bookingInput.parse(raw);
  await connectDB();
  const existing = await Booking.findOne({
    user: userId,
    requestId: input.requestId,
  });
  if (existing) return existing;
  const p = await TourPackage.findById(input.packageId);
  if (!p) throw new AppError("Package not found.", 404);
  const d = await Destination.findOne({ _id: p.destination, active: true });
  if (!d) throw new AppError("This destination is currently unavailable.");
  validateTravel(p, input.travelDate, input.numberOfTravelers);
  return Booking.create({
    ...input,
    user: userId,
    package: p._id,
    packageName: p.name,
    destinationName: d.name,
    packageImage: p.images[0],
    durationDays: p.durationDays,
    bookingCode: `TM-${randomUUID().slice(0, 8).toUpperCase()}`,
    pricePerPersonAtBooking: p.pricePerPerson,
    totalAmount: p.pricePerPerson * input.numberOfTravelers,
  });
}
export async function payBooking(id: string, userId: string, raw: unknown) {
  const input = paymentInput.parse(raw);
  await connectDB();
  return mongoose.connection.transaction(async (session) => {
    const b = await Booking.findOne({ _id: id, user: userId }).session(session);
    if (!b) throw new AppError("Booking not found.", 404);
    if (b.paymentStatus === "SUCCESSFUL" && b.bookingStatus === "CONFIRMED")
      return b;
    if (b.bookingStatus !== "PENDING")
      throw new AppError("This booking cannot be paid.");
    const p = await TourPackage.findById(b.package).session(session);
    if (!p) throw new AppError("Package is unavailable.");
    const d = await Destination.findOne({
      _id: p.destination,
      active: true,
    }).session(session);
    if (!d) throw new AppError("Destination is unavailable.");
    validateTravel(
      p,
      b.travelDate.toISOString().slice(0, 10),
      b.numberOfTravelers,
    );
    const success = input.outcome === "success";
    await Payment.findOneAndUpdate(
      { booking: b._id },
      {
        $set: {
          user: b.user,
          amount: b.totalAmount,
          paymentMethod: input.paymentMethod,
          status: success ? "SUCCESSFUL" : "FAILED",
          paidAt: success ? new Date() : null,
        },
        $setOnInsert: { transactionId: `DEMO-${randomUUID().toUpperCase()}` },
      },
      { upsert: true, session, runValidators: true },
    );
    b.paymentStatus = success ? "SUCCESSFUL" : "FAILED";
    b.bookingStatus = success ? "CONFIRMED" : "PENDING";
    await b.save({ session });
    return b;
  });
}
export async function cancelBooking(id: string, userId: string, admin = false) {
  await connectDB();
  return mongoose.connection.transaction(async (session) => {
    const b = await Booking.findOne({
      _id: id,
      ...(admin ? {} : { user: userId }),
    }).session(session);
    if (!b) throw new AppError("Booking not found.", 404);
    if (!canCancel(b.bookingStatus, b.travelDate))
      throw new AppError(
        "Only pending or confirmed bookings before the travel date can be cancelled.",
      );
    if (b.paymentStatus === "SUCCESSFUL") {
      await Payment.updateOne(
        { booking: b._id, status: "SUCCESSFUL" },
        { $set: { status: "REFUNDED" } },
        { session },
      );
      b.paymentStatus = "REFUNDED";
    }
    b.bookingStatus = "CANCELLED";
    b.cancelledAt = new Date();
    b.cancellationReason = admin
      ? "Cancelled by administrator"
      : "Cancelled by traveler";
    await b.save({ session });
    return b;
  });
}
export async function completeBooking(id: string) {
  const b = await Booking.findById(id);
  if (!b) throw new AppError("Booking not found.", 404);
  const endDate = new Date(b.travelDate);
  endDate.setUTCDate(endDate.getUTCDate() + b.durationDays - 1);
  if (
    b.bookingStatus !== "CONFIRMED" ||
    b.paymentStatus !== "SUCCESSFUL" ||
    endDate.toISOString().slice(0, 10) > todayIndia()
  )
    throw new AppError(
      "Only paid, confirmed trips that have ended can be completed.",
    );
  const updated = await Booking.findOneAndUpdate(
    { _id: id, bookingStatus: "CONFIRMED", paymentStatus: "SUCCESSFUL" },
    { $set: { bookingStatus: "COMPLETED" } },
    { returnDocument: "after" },
  );
  if (!updated)
    throw new AppError("Booking changed. Refresh and try again.", 409);
  return updated;
}
