import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

export const Quotation = mongoose.model("Quotation", quotationSchema);
