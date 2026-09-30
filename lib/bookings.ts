import { Booking, Payment } from "@/models";
import { connectDB } from "./db";
import { serialize } from "./utils";
import type { BookingView } from "@/types";
export async function ownBooking(id: string, user: string) {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  await connectDB();
  return serialize<BookingView | null>(
    await Booking.findOne({ _id: id, user }).lean(),
  );
}
export async function ownPayment(id: string, user: string) {
  await connectDB();
  return Payment.findOne({ booking: id, user }).lean();
}
