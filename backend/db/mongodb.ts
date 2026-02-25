import mongoose from "mongoose";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Create MongoDB client connection
export const client = mongoose.connection;

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("✅ MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

// Export mongoose for direct use if needed
export default mongoose;
