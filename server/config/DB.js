
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is missing in environment variables");
    }

    mongoose.set("strictQuery", true);  // (ignore the field from the query which is not in schema)

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`\n✅ MongoDB Connected`);

  } catch (error) {
    console.error(`\n❌ MongoDB Connection Failed`);
    console.error(`Error: ${error.message}\n`);
    process.exit(1);
  }
};

// Gracefully handle app termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("\n🔌 MongoDB connection closed due to app termination");
  process.exit(0);
});

export default connectDB;
