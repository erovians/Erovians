import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
