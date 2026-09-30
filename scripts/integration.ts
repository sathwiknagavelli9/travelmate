import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { SignJWT } from "jose";
import { packages } from "../lib/catalog";
import { connectDB } from "../lib/db";
import { User, Booking, Payment, Destination, TourPackage } from "../models";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const tag = randomUUID().slice(0, 8);
const email = `test-${tag}@travelmate.test`;
const email2 = `other-${tag}@travelmate.test`;
const password = `Test!${randomUUID()}aA1`;
let checks = 0;
let newDestination = "";
let newPackage = "";
type Json = Record<string, unknown>;
async function request(
  path: string,
  method = "GET",
  body?: unknown,
  cookie = "",
  expected = 200,
) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      Origin: base,
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "manual",
  });
  const data = (await response.json()) as Json;
  assert.equal(
    response.status,
    expected,
    `${method} ${path}: ${JSON.stringify(data)}`,
  );
  checks++;
  return {
    data,
    cookie: response.headers.get("set-cookie")?.split(";")[0] || "",
    headers: response.headers,
  };
}
async function main() {
  await connectDB();
  const beach = await packages({ type: "Beach", max: "17000" });
  assert.ok(
    beach.length > 0 &&
      beach.every(
        (p) => p.packageType === "Beach" && p.pricePerPerson <= 17000,
      ),
  );
  checks++;
  const sorted = await packages({ sort: "price-asc" });
  assert.ok(
    sorted.every(
      (p, i) => i === 0 || p.pricePerPerson >= sorted[i - 1].pricePerPerson,
    ),
  );
  checks++;
  const short = await packages({ duration: "3" });
  assert.ok(short.every((p) => p.durationDays <= 3));
  checks++;
  assert.equal(
    (await packages({ q: "nonexistent-unique-destination" })).length,
    0,
  );
  checks++;
  for (const path of [
    "/",
    "/destinations",
    "/destinations/goa",
    "/packages",
    "/packages?q=Goa",
    "/packages?type=Beach&max=17000",
    "/packages?sort=price-asc",
    "/packages/goa-from-hyderabad",
    "/login",
    "/register",
  ]) {
    const r = await fetch(`${base}${path}`);
    assert.equal(r.status, 200, path);
    const html = await r.text();
    if (path !== "/login" && path !== "/register")
      assert.ok(
        html.includes(path === "/destinations" ? "/destinations/goa" : "Goa"),
        `${path} must render database content, not just a streamed 200 shell`,
      );
    checks++;
  }
  const data = {
    name: "Integration Traveler",
    email,
    phone: "+91 9876543210",
    password,
    confirmPassword: password,
  };
  const registration = await request(
    "/api/auth/register",
    "POST",
    data,
    "",
    201,
  );
  const userCookie = registration.cookie;
  assert.match(registration.headers.get("set-cookie") || "", /HttpOnly/i);
  assert.match(registration.headers.get("set-cookie") || "", /SameSite=lax/i);
  if (base.startsWith("https://"))
    assert.match(registration.headers.get("set-cookie") || "", /Secure/i);
  checks++;
  await request("/api/auth/register", "POST", data, "", 409);
  await request(
    "/api/auth/login",
    "POST",
    { email, password: "WrongPass123!" },
    "",
    401,
  );
  await request("/api/auth/login", "POST", { email, password });
  const testUser = await User.findOne({ email });
  assert.ok(testUser);
  const expired = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(testUser.id)
    .setIssuer("travelmate")
    .setAudience("travelmate")
    .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
    .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
  await request(
    "/api/bookings",
    "GET",
    undefined,
    `travelmate_session=${expired}`,
    401,
  );
  await request(
    "/api/bookings",
    "GET",
    undefined,
    "travelmate_session=invalid-token",
    401,
  );
  const other = await request(
    "/api/auth/register",
    "POST",
    { ...data, email: email2 },
    "",
    201,
  );
  await request("/api/admin/users", "GET", undefined, userCookie, 403);
  await request("/api/admin/packages", "POST", {}, userCookie, 403);
  await request("/api/bookings", "GET", undefined, "", 401);
  await request(
    "/api/profile",
    "PATCH",
    { name: "Updated Traveler", phone: "+91 9888888888" },
    userCookie,
  );
  assert.equal((await User.findOne({ email }))?.name, "Updated Traveler");
  checks++;
  const badOrigin = await fetch(`${base}/api/profile`, {
    method: "PATCH",
    headers: {
      Origin: "https://evil.example",
      "Content-Type": "application/json",
      Cookie: userCookie,
    },
    body: JSON.stringify({ name: "Attacker", phone: "+91 9999999999" }),
  });
  assert.equal(badOrigin.status, 403);
  checks++;
  const p = await TourPackage.findOne({ slug: "goa-from-hyderabad" });
  assert.ok(p);
  const future = new Date();
  future.setUTCDate(future.getUTCDate() + 30);
  const input = {
    packageId: p.id,
    requestId: randomUUID(),
    travelDate: future.toISOString().slice(0, 10),
    numberOfTravelers: 2,
    travelers: [
      { fullName: "First Traveler", age: 22 },
      { fullName: "Second Traveler", age: 23 },
    ],
    totalAmount: 1,
    pricePerPersonAtBooking: 1,
    user: "000000000000000000000000",
  };
  await request(
    "/api/bookings",
    "POST",
    { ...input, travelDate: "2020-01-01" },
    userCookie,
    400,
  );
  await request(
    "/api/bookings",
    "POST",
    { ...input, numberOfTravelers: 0 },
    userCookie,
    400,
  );
  await request(
    "/api/bookings",
    "POST",
    { ...input, numberOfTravelers: 31 },
    userCookie,
    400,
  );
  await request(
    "/api/bookings",
    "POST",
    { ...input, travelers: [] },
    userCookie,
    400,
  );
  const created = await request(
    "/api/bookings",
    "POST",
    input,
    userCookie,
    201,
  );
  const id = String(created.data._id);
  assert.equal(created.data.totalAmount, p.pricePerPerson * 2);
  assert.equal(created.data.pricePerPersonAtBooking, p.pricePerPerson);
  checks += 2;
  const repeat = await request("/api/bookings", "POST", input, userCookie, 201);
  assert.equal(repeat.data._id, id);
  checks++;
  await request(`/api/bookings/${id}`, "GET", undefined, other.cookie, 404);
  await request(
    `/api/bookings/${id}/pay`,
    "POST",
    { paymentMethod: "UPI Demo", outcome: "success" },
    other.cookie,
    404,
  );
  await request(
    `/api/bookings/${id}/cancel`,
    "POST",
    undefined,
    other.cookie,
    404,
  );
  const failure = await request(
    `/api/bookings/${id}/pay`,
    "POST",
    { paymentMethod: "Card Demo", outcome: "failed" },
    userCookie,
  );
  assert.equal(failure.data.paymentStatus, "FAILED");
  checks++;
  const payments = await Promise.all(
    [1, 2].map(() =>
      request(
        `/api/bookings/${id}/pay`,
        "POST",
        { paymentMethod: "UPI Demo", outcome: "success" },
        userCookie,
      ),
    ),
  );
  assert.ok(payments.every((r) => r.data.bookingStatus === "CONFIRMED"));
  assert.equal(await Payment.countDocuments({ booking: id }), 1);
  checks += 2;
  await request("/api/bookings", "GET", undefined, userCookie);
  for (const path of [
    "/profile",
    "/my-bookings",
    `/my-bookings/${id}?confirmed=1`,
  ]) {
    const r = await fetch(`${base}${path}`, {
      headers: { Cookie: userCookie },
    });
    assert.equal(r.status, 200);
    checks++;
  }
  const cancel = await request(
    `/api/bookings/${id}/cancel`,
    "POST",
    undefined,
    userCookie,
  );
  assert.equal(cancel.data.bookingStatus, "CANCELLED");
  assert.equal(cancel.data.paymentStatus, "REFUNDED");
  assert.equal((await Payment.findOne({ booking: id }))?.status, "REFUNDED");
  checks += 3;
  await request(
    `/api/bookings/${id}/cancel`,
    "POST",
    undefined,
    userCookie,
    400,
  );
  await request(
    `/api/bookings/${id}/pay`,
    "POST",
    { paymentMethod: "UPI Demo", outcome: "success" },
    userCookie,
    400,
  );
  const admin = await request("/api/auth/login", "POST", {
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
  });
  for (const path of [
    "/admin",
    "/admin/destinations",
    "/admin/packages",
    "/admin/bookings",
    "/admin/users",
    "/admin/payments",
  ]) {
    const r = await fetch(`${base}${path}`, {
      headers: { Cookie: admin.cookie },
    });
    assert.equal(r.status, 200, path);
    checks++;
  }
  const adminUsers = await request(
    "/api/admin/users",
    "GET",
    undefined,
    admin.cookie,
  );
  assert.ok(!JSON.stringify(adminUsers.data).includes("passwordHash"));
  checks++;
  const dInput = {
    name: `Test Destination ${tag}`,
    slug: `test-${tag}`,
    state: "Telangana",
    country: "India",
    shortDescription: "A test destination for integration checks.",
    description:
      "This temporary destination is created only for automated verification.",
    heroImage: p.images[0],
    gallery: [],
    bestTimeToVisit: "October to March",
    attractions: ["Test attraction"],
    basicTravelInformation:
      "Temporary integration test destination from Hyderabad.",
    active: true,
  };
  const d = await request(
    "/api/admin/destinations",
    "POST",
    dInput,
    admin.cookie,
    201,
  );
  newDestination = String(d.data._id);
  await request(
    `/api/admin/destinations/${newDestination}`,
    "PATCH",
    { ...dInput, name: `Edited ${tag}` },
    admin.cookie,
  );
  const pInput = {
    ...p.toObject(),
    destination: newDestination,
    name: `Test Package ${tag}`,
    slug: `test-package-${tag}`,
    availableFrom: p.availableFrom.toISOString().slice(0, 10),
    availableUntil: p.availableUntil.toISOString().slice(0, 10),
  };
  const pkg = await request(
    "/api/admin/packages",
    "POST",
    pInput,
    admin.cookie,
    201,
  );
  newPackage = String(pkg.data._id);
  await request(
    `/api/admin/packages/${newPackage}`,
    "PATCH",
    { ...pInput, pricePerPerson: 12345 },
    admin.cookie,
  );
  const historic = await request(
    "/api/bookings",
    "POST",
    { ...input, packageId: newPackage, requestId: randomUUID() },
    userCookie,
    201,
  );
  await request(
    `/api/admin/packages/${newPackage}`,
    "PATCH",
    { ...pInput, pricePerPerson: 23456 },
    admin.cookie,
  );
  assert.equal(
    (await Booking.findById(historic.data._id))?.pricePerPersonAtBooking,
    12345,
  );
  checks++;
  await request(
    `/api/admin/bookings/${historic.data._id}`,
    "PATCH",
    { status: "COMPLETED" },
    admin.cookie,
    400,
  );
  await request(
    `/api/admin/bookings/${historic.data._id}`,
    "PATCH",
    { status: "CANCELLED" },
    admin.cookie,
  );
  await request(
    `/api/admin/packages/${newPackage}`,
    "DELETE",
    undefined,
    admin.cookie,
  );
  await request(
    "/api/bookings",
    "POST",
    { ...input, packageId: newPackage, requestId: randomUUID() },
    userCookie,
    400,
  );
  await request(
    `/api/admin/destinations/${newDestination}`,
    "DELETE",
    undefined,
    admin.cookie,
  );
  await request("/api/admin/payments", "GET", undefined, admin.cookie);
  await request("/api/auth/logout", "POST", undefined, userCookie);
  console.log(
    `PASS: ${checks} integration checks on ${base}. Registration, auth, authorization, catalog routes, profile, price tampering, ownership, payment retry/concurrency, refund, admin CRUD, availability and history verified.`,
  );
}
main()
  .catch((error) => {
    console.error("Integration check failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    const users = await User.find({ email: { $in: [email, email2] } }).select(
      "_id",
    );
    const ids = users.map((u) => u._id);
    await Payment.deleteMany({ user: { $in: ids } });
    await Booking.deleteMany({ user: { $in: ids } });
    await User.deleteMany({ _id: { $in: ids } });
    if (newPackage) await TourPackage.deleteOne({ _id: newPackage });
    if (newDestination) await Destination.deleteOne({ _id: newDestination });
    await mongoose.disconnect();
    console.log("Temporary integration records cleaned up.");
  });
