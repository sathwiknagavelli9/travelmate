import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";
import { connectDB } from "./db";
import { User, RateLimit } from "@/models";
import { AppError } from "./errors";
import { serialize } from "./utils";
import type { SessionUser } from "@/types";
const cookieName = "travelmate_session";
function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32)
    throw new Error("Session configuration is missing");
  return new TextEncoder().encode(value);
}
export async function createSession(id: string) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuer("travelmate")
    .setAudience("travelmate")
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 86400,
  });
}
export async function clearSession() {
  (await cookies()).delete(cookieName);
}
export async function currentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  let id: string | undefined;
  try {
    id = (
      await jwtVerify(token, secret(), {
        algorithms: ["HS256"],
        issuer: "travelmate",
        audience: "travelmate",
      })
    ).payload.sub;
  } catch {
    return null;
  }
  if (!id || !/^[a-f\d]{24}$/i.test(id)) return null;
  await connectDB();
  return serialize<SessionUser | null>(
    await User.findById(id).select("name email phone role createdAt").lean(),
  );
}
export async function requireUser(admin = false) {
  const user = await currentUser();
  if (!user) throw new AppError("Please sign in to continue.", 401);
  if (admin && user.role !== "ADMIN")
    throw new AppError("Administrator access is required.", 403);
  return user;
}
export async function pageUser(path: string, admin = false) {
  const user = await currentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(path)}`);
  if (admin && user.role !== "ADMIN") redirect("/access-denied");
  return user;
}
export async function limitAuth(email: string, request: Request) {
  await connectDB();
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for") || "unknown"
    : "local";
  const bucket = Math.floor(Date.now() / 900000);
  for (const [value, max] of [
    [email, 12],
    [ip, 100],
  ] as const) {
    const key = createHash("sha256").update(`${value}:${bucket}`).digest("hex");
    const record = await RateLimit.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date((bucket + 1) * 900000) },
      },
      { upsert: true, returnDocument: "after" },
    );
    if (record.count > max)
      throw new AppError(
        "Too many attempts. Please try again in 15 minutes.",
        429,
      );
  }
}
