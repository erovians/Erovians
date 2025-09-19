import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: false,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productType: {
      type: String,
      required: true,
      enum: ["Granite", "Marble"],
    },
    grade: {
      type: String,
      required: true,
      enum: ["A", "B", "C"],
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    size: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      thickness: { type: Number, required: true },
    },
    finish: {
      type: String,
      required: true,
      enum: ["Polished", "Honed", "Flamed", "Leathered", "Others"],
    },
    weight: {
      type: Number,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      enum: ["INR", "USD", "EUR", "JPY"],
      default: "INR",
    },
    unit: {
      type: String,
      required: true,
      enum: ["Sq.ft", "Sq.m", "Piece"],
      default: "Sq.ft",
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
    },
    warrenty: {
      type: String,
      required: true,
    },
    stockAvailability: {
      type: Boolean,
      required: true,
      default: true,
    },
    certifications: {
      type: [String],
    },
    productImages: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    tags: {
      type: [String],
    },
    discountPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
