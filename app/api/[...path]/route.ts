import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { connectDB } from "@/lib/db";
import {
  createSession,
  clearSession,
  requireUser,
  limitAuth,
} from "@/lib/auth";
import {
  loginInput,
  registerInput,
  profileInput,
  destinationInput,
  packageInput,
  objectId,
} from "@/lib/validation";
import { AppError } from "@/lib/errors";
import { User, Destination, TourPackage, Booking, Payment } from "@/models";
import {
  createBooking,
  payBooking,
  cancelBooking,
  completeBooking,
} from "@/lib/booking-service";
export const runtime = "nodejs";
type Context = { params: Promise<{ path: string[] }> };
const ok = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
async function handler(request: Request, context: Context) {
  try {
    const path = (await context.params).path;
    const route = path.join("/");
    const method = request.method;
    if (method !== "GET") {
      const origin = request.headers.get("origin");
      if (!origin || origin !== new URL(request.url).origin)
        throw new AppError("Request origin is not allowed.", 403);
      if (Number(request.headers.get("content-length") || 0) > 100000)
        throw new AppError("Request is too large.", 413);
    }
    if (route === "auth/logout" && method === "POST") {
      await clearSession();
      return ok({ success: true });
    }
    if (["auth/login", "auth/register"].includes(route) && method === "POST") {
      const raw = await request.json();
      const input = loginInput.parse(raw);
      await limitAuth(input.email, request);
      if (route === "auth/register") {
        const registration = registerInput.parse(raw);
        const user = await User.create({
          name: registration.name,
          email: registration.email,
          phone: registration.phone,
          passwordHash: await bcrypt.hash(registration.password, 12),
          role: "USER",
        });
        await createSession(user.id);
        return ok({ role: user.role }, 201);
      }
      const user = await User.findOne({ email: input.email }).select(
        "+passwordHash",
      );
      if (!user || !(await bcrypt.compare(input.password, user.passwordHash)))
        throw new AppError("Email or password is incorrect.", 401);
      await createSession(user.id);
      return ok({ role: user.role });
    }
    const user = await requireUser(path[0] === "admin");
    await connectDB();
    if (route === "profile" && method === "PATCH") {
      const input = profileInput.parse(await request.json());
      await User.updateOne(
        { _id: user._id },
        { $set: input },
        { runValidators: true },
      );
      return ok({ success: true });
    }
    if (route === "bookings" && method === "POST")
      return ok(await createBooking(user._id, await request.json()), 201);
    if (route === "bookings" && method === "GET")
      return ok(
        await Booking.find({ user: user._id }).sort({ createdAt: -1 }).lean(),
      );
    if (path[0] === "bookings" && path[1]) {
      const id = objectId.parse(path[1]);
      if (path.length === 2 && method === "GET") {
        const b = await Booking.findOne({ _id: id, user: user._id }).lean();
        if (!b) throw new AppError("Booking not found.", 404);
        return ok(b);
      }
      if (path[2] === "pay" && method === "POST")
        return ok(await payBooking(id, user._id, await request.json()));
      if (path[2] === "cancel" && method === "POST")
        return ok(await cancelBooking(id, user._id));
    }
    if (path[0] === "admin") {
      const resource = path[1];
      const id = path[2] ? objectId.parse(path[2]) : undefined;
      if (method === "GET") {
        if (resource === "users")
          return ok(
            await User.find().select("name email phone role createdAt").lean(),
          );
        if (resource === "payments")
          return ok(
            await Payment.find()
              .populate("user", "name email")
              .populate("booking", "bookingCode")
              .lean(),
          );
        if (resource === "bookings")
          return ok(
            await Booking.find()
              .populate("user", "name email")
              .sort({ createdAt: -1 })
              .lean(),
          );
        if (resource === "destinations")
          return ok(await Destination.find().lean());
        if (resource === "packages")
          return ok(await TourPackage.find().populate("destination").lean());
      }
      if (resource === "bookings" && id && method === "PATCH") {
        const { status } = await request.json();
        if (status === "CANCELLED")
          return ok(await cancelBooking(id, user._id, true));
        if (status === "COMPLETED") return ok(await completeBooking(id));
        throw new AppError(
          "Confirmation requires successful demo payment; only cancellation or completion can be set here.",
        );
      }
      if (resource === "destinations") {
        if (method === "POST")
          return ok(
            await Destination.create(
              destinationInput.parse(await request.json()),
            ),
            201,
          );
        if (id && method === "PATCH") {
          const d = await Destination.findByIdAndUpdate(
            id,
            { $set: destinationInput.parse(await request.json()) },
            { returnDocument: "after", runValidators: true },
          );
          if (!d) throw new AppError("Destination not found.", 404);
          return ok(d);
        }
        if (id && method === "DELETE") {
          const d = await Destination.findByIdAndUpdate(
            id,
            { $set: { active: false } },
            { returnDocument: "after" },
          );
          if (!d) throw new AppError("Destination not found.", 404);
          return ok({ success: true });
        }
      }
      if (resource === "packages") {
        if (method === "POST" || (id && method === "PATCH")) {
          const input = packageInput.parse(await request.json());
          if (!(await Destination.exists({ _id: input.destination })))
            throw new AppError("Choose an existing destination.");
          const p =
            method === "POST"
              ? await TourPackage.create(input)
              : await TourPackage.findByIdAndUpdate(
                  id,
                  { $set: input },
                  { returnDocument: "after", runValidators: true },
                );
          if (!p) throw new AppError("Package not found.", 404);
          return ok(p, method === "POST" ? 201 : 200);
        }
        if (id && method === "DELETE") {
          const p = await TourPackage.findByIdAndUpdate(
            id,
            { $set: { available: false } },
            { returnDocument: "after" },
          );
          if (!p) throw new AppError("Package not found.", 404);
          return ok({ success: true });
        }
      }
    }
    throw new AppError("Endpoint not found.", 404);
  } catch (error) {
    if (error instanceof AppError)
      return ok({ error: error.message }, error.status);
    if (error instanceof ZodError)
      return ok(
        {
          error: error.issues
            .map((i) => `${i.path.join(".") || "Form"}: ${i.message}`)
            .join("; "),
        },
        400,
      );
    if (error instanceof SyntaxError)
      return ok({ error: "Invalid request data." }, 400);
    if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      error.code === 11000
    )
      return ok(
        {
          error:
            "This email, slug, or request already exists. Please refresh or use a different value.",
        },
        409,
      );
    console.error(
      "Request failed:",
      error instanceof Error ? error.name : "UnknownError",
    );
    return ok(
      {
        error: "We could not complete this request. Please try again shortly.",
      },
      503,
    );
  }
}
export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
