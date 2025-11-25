import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    lot: {
      type: String,
    },
    material: {
      type: String,
      required: true,
    },
    thickness: {
      type: String,
      required: true,
    },
    dimensions: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    quality: {
      type: String,
      required: true,
    },
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
