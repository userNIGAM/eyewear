import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env.local");
}

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    if (mongoose.connection.readyState === 2) {
      await mongoose.connection.asPromise();
      return mongoose.connection;
    }

    await mongoose.connect(MONGO_URI!);

    console.log("✅ MongoDB connected successfully");

    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}