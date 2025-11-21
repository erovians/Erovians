import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    lot: String,
    material: String,
    thickness: String,
    dimensions: String,
    location: String,
    quality: String,
    qty: String,
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
