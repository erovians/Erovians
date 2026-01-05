import mongoose from "mongoose";
import Partner from "./models/partner.model.js";
console.log("Current Working Dir:", process.cwd());
import dotenv from "dotenv";
dotenv.config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seed() {
  try {
    console.log("Seeding started...");

    await Partner.deleteMany({});
    await Partner.create({
      name: "Sandeep",
      cost_per_km: 0.25,
      weight_factor: 0.22,
      volume_factor: 2,
      handling_extra: 30,
      webhook_url: "",
    });

    console.log("Seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
