import mongoose from "mongoose";
import logger from "./winston.js";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is missing in environment variables");
    }

    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    logger.info("MongoDB Connected", conn); // ✅ Winston use karo
  } catch (error) {
    logger.error(`MongoDB Connection Failed: ${error.message}`); // ✅ Winston use karo
    process.exit(1);
  }
};

// Gracefully handle app termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed due to app termination"); // ✅ Winston use karo
  process.exit(0);
});

export default connectDB;
