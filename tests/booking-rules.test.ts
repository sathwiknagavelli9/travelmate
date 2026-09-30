import { test } from "node:test";
import assert from "node:assert/strict";
import { validateTravel, canCancel } from "../lib/booking-rules";
import { bookingInput, registerInput } from "../lib/validation";
import { safeReturn } from "../lib/utils";
const future = new Date();
future.setUTCDate(future.getUTCDate() + 20);
const date = future.toISOString().slice(0, 10);
const packageData = {
  available: true,
  maximumTravelers: 4,
  availableFrom: "2020-01-01",
  availableUntil: "2099-12-31",
};
test("booking rules reject invalid count, date, and unavailable packages", () => {
  assert.doesNotThrow(() => validateTravel(packageData, date, 2));
  for (const count of [0, -1, 5, 1.5])
    assert.throws(() => validateTravel(packageData, date, count));
  assert.throws(() => validateTravel(packageData, "2020-01-01", 1));
  assert.throws(() =>
    validateTravel({ ...packageData, available: false }, date, 1),
  );
});
test("cancel only future pending and confirmed bookings", () => {
  assert.equal(canCancel("CONFIRMED", date), true);
  assert.equal(canCancel("PENDING", date), true);
  assert.equal(canCancel("COMPLETED", date), false);
  assert.equal(canCancel("CANCELLED", date), false);
  assert.equal(canCancel("CONFIRMED", "2020-01-01"), false);
});
test("traveler validation and impossible calendar dates", () => {
  const input = {
    packageId: "a".repeat(24),
    requestId: "e436a7f0-cdbc-4878-ad90-dfa0b02781cc",
    travelDate: date,
    numberOfTravelers: 1,
    travelers: [{ fullName: "Test Traveler", age: 21 }],
  };
  assert.equal(bookingInput.safeParse(input).success, true);
  assert.equal(
    bookingInput.safeParse({ ...input, numberOfTravelers: 2 }).success,
    false,
  );
  assert.equal(
    bookingInput.safeParse({ ...input, travelDate: "2027-02-30" }).success,
    false,
  );
});
test("registration requires strong matched passwords", () => {
  const input = {
    name: "Test User",
    email: "USER@EXAMPLE.COM",
    phone: "+91 9876543210",
    password: "StrongPass123!",
    confirmPassword: "StrongPass123!",
  };
  assert.equal(registerInput.parse(input).email, "user@example.com");
  assert.equal(
    registerInput.safeParse({ ...input, password: "weak" }).success,
    false,
  );
  assert.equal(
    registerInput.safeParse({ ...input, confirmPassword: "Different123!" })
      .success,
    false,
  );
});
test("return URL cannot redirect to an external site", () => {
  for (const bad of [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
  ])
    assert.equal(safeReturn(bad), "/my-bookings");
  assert.equal(
    safeReturn("/booking/abc?travelers=2"),
    "/booking/abc?travelers=2",
  );
});
