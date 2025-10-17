// import mongoose from "mongoose";

// const ProductSchema = new mongoose.Schema(
//   {
//     companyId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Company",
//       required: true,
//       index: true,
//     },
//     productName: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 2,
//       maxlength: 100,
//     },
//     productImages: {
//       type: [String],
//       validate: {
//         validator: (val) => Array.isArray(val) && val.length >= 3,
//         message: "At least 3 product images are required",
//       },
//       required: true,
//     },
//     category: {
//       type: String,
//       required: true,
//       enum: ["Granite", "Marble"],
//       index: true,
//     },
//     subCategory: { type: String, required: true, index: true },
//     grade: { type: String, required: true, enum: ["A", "B", "C"] },
//     color: { type: String, required: true, trim: true },
//     origin: { type: String, required: true, trim: true },
//     size: {
//       length: { type: Number, required: true, min: 1 },
//       lengthMeasurement: { type: String, enum: ["ft", "m"], default: "ft" },
//       width: { type: Number, required: true, min: 1 },
//       widthMeasurement: { type: String, enum: ["ft", "m"], default: "ft" },
//       thickness: { type: Number, required: true, min: 1 },
//       thicknessMeasurement: {
//         type: String,
//         enum: ["inch", "cm"],
//         default: "inch",
//       },
//     },
//     weight: { type: Number, required: true, min: 1 },
//     weightMeasurement: { type: String, enum: ["kg", "ton"], default: "kg" },
//     pricePerUnit: { type: Number, required: true, min: 1 },
//     priceUnit: {
//       type: String,
//       enum: ["sq.ft", "sq.m", "piece"],
//       default: "sq.ft",
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 50,
//       maxlength: 1500,
//     },
//     status: {
//       type: String,
//       enum: ["active", "inactive", "pending", "violation"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// ProductSchema.index({ companyId: 1, category: 1 });
// ProductSchema.index({ category: 1, pricePerUnit: 1 });

// const Product = mongoose.model("Product", ProductSchema);
// export default Product;

// models/Product.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const SizeSubSchema = new Schema(
  {
    length: { type: Number, required: true, min: 0.001 },
    lengthMeasurement: { type: String, enum: ["ft", "m"], default: "ft" },
    width: { type: Number, required: true, min: 0.001 },
    widthMeasurement: { type: String, enum: ["ft", "m"], default: "ft" },
    thickness: { type: Number, required: true, min: 0.001 },
    thicknessMeasurement: {
      type: String,
      enum: ["inch", "cm"],
      default: "inch",
    },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    }, // denormalized: speeds common reads
    productName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    productImages: {
      type: [String],
      required: true,
      validate: {
        validator: (val) => Array.isArray(val) && val.length >= 3,
        message: "At least 3 product images are required",
      },
      views: { type: Number, default: 0 },
    },
    category: {
      type: String,
      required: true,
      enum: ["Granite", "Marble"],
      index: true,
    },
    subCategory: { type: String, required: true, index: true },
    grade: { type: String, required: true, enum: ["A", "B", "C"], index: true },
    color: { type: String, required: true, trim: true },
    origin: { type: String, required: true, trim: true },
    size: { type: SizeSubSchema, required: true },
    weight: { type: Number, required: true, min: 0.01 },
    weightMeasurement: { type: String, enum: ["kg", "ton"], default: "kg" },
    pricePerUnit: { type: Number, required: true, min: 0 },
    priceUnit: {
      type: String,
      enum: ["sq.ft", "sq.m", "piece"],
      default: "sq.ft",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 3500,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "violation"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

// compound indexes tuned for common queries
ProductSchema.index({ companyId: 1, status: 1, createdAt: -1 });
ProductSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
ProductSchema.index({ category: 1, pricePerUnit: 1 });

// text index for search (weighted)
ProductSchema.index(
  { productName: "text", description: "text" },
  { weights: { productName: 10, description: 2 } }
);

// partial index example: keep index small for only active products
ProductSchema.index(
  { companyId: 1, pricePerUnit: 1 },
  { partialFilterExpression: { status: "active" } }
);

// API payload transform
ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
