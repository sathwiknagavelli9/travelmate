import mongoose from "mongoose";
declare global {
  var mongoPromise: Promise<typeof mongoose> | undefined;
}
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Database configuration is missing");
  if (!global.mongoPromise) {
    global.mongoPromise = mongoose
      .connect(uri, {
        dbName: "travelmate",
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
      })
      .catch((error) => {
        global.mongoPromise = undefined;
        throw error;
      });
  }
  return global.mongoPromise;
}
