import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    lot: String,
    material: String,
    thickness: String,
    dimensions: String,
    location: String,
    quality: String,
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    qty: String,
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
