import { AppError } from "./errors";
import { todayIndia } from "./utils";
export function validateTravel(
  p: {
    available: boolean;
    maximumTravelers: number;
    availableFrom: Date | string;
    availableUntil: Date | string;
  },
  date: string,
  count: number,
) {
  if (!p.available)
    throw new AppError("This package is currently unavailable.");
  if (!Number.isInteger(count) || count < 1 || count > p.maximumTravelers)
    throw new AppError(`Choose between 1 and ${p.maximumTravelers} travelers.`);
  if (
    date <= todayIndia() ||
    date < new Date(p.availableFrom).toISOString().slice(0, 10) ||
    date > new Date(p.availableUntil).toISOString().slice(0, 10)
  )
    throw new AppError("Choose a future date within the package availability.");
}
export function canCancel(status: string, travelDate: string | Date) {
  return (
    ["PENDING", "CONFIRMED"].includes(status) &&
    new Date(travelDate).toISOString().slice(0, 10) > todayIndia()
  );
}
