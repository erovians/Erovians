import mongoose from "mongoose";
const { Schema } = mongoose;

const SizeSubSchema = new Schema(
  {
    length: { type: Number, required: true, min: 0.001 },
    lengthMeasurement: { type: String, enum: ["ft", "m", "mm"], default: "mm" },
    width: { type: Number, required: true, min: 0.001 },
    widthMeasurement: { type: String, enum: ["ft", "m", "mm"], default: "mm" },
    thickness: { type: Number, required: true, min: 0.001 },
    thicknessMeasurement: {
      type: String,
      enum: ["inch", "cm", "mm"],
      default: "mm",
    },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    // ========== REFERENCES ==========

    // ✅ OPTIONAL - Only for professional sellers
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: false, // ✅ Changed to optional
      default: null,
      index: true,
    },

    // ✅ ALWAYS REQUIRED
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========== PDF: PRODUCT TYPE ==========

    product_type: {
      type: String,
      enum: ["ready-to-go", "made-to-order", "CNC", "stone-cutting"],
      default: "ready-to-go",
      required: true,
    },

    // ========== PDF: BASIC INFO ==========

    productName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    product_sku: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 3500,
    },

    productImages: {
      type: [String],
      required: true,
      validate: {
        validator: (val) => Array.isArray(val) && val.length >= 3,
        message: "At least 3 product images are required",
      },
    },

    size: {
      type: SizeSubSchema,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
      min: 0.01,
    },
    weightMeasurement: {
      type: String,
      enum: ["kg", "ton"],
      default: "kg",
    },

    product_material: {
      type: String,
      required: true,
      trim: true,
    },

    origin: {
      type: String,
      required: true,
      trim: true,
    },

    compliance_standards: {
      ce_marking: Boolean,
      material_standard: String,
      technical_sheets: [String],
      certificates: [String],
    },

    available_stock: {
      type: Number,
      default: 0,
    },

    expected_shipping_time: {
      type: Number,
      default: 7,
    },

    batch_number: {
      type: String,
    },

    // ========== CUSTOM/MADE-TO-ORDER FIELDS ==========

    technical_file: {
      url: String,
      hash: String,
      archive_path: String,
      upload_timestamp: Date,
      seller_validation_timestamp: Date,
      final_plan_version: String,
    },

    custom_parameters: {
      height: Number,
      width: Number,
      length: Number,
      thickness: Number,
      tolerances: String,
      radius: Number,
      angles: [Number],
      finish_types: [String],
      chamfers: String,
      vein_orientation: String,
      drilling_positions: [String],
    },

    preview_3d_url: {
      type: String,
    },

    // ========== CATEGORY (for all sellers) ==========

    category: {
      type: [String],
      required: true,
      enum: ["natural stones", "ceramic & tiles", "alternatives & finishes"],
      index: true,
    },

    subCategory: {
      type: [String],
      required: true,
      index: true,
    },

    grade: {
      type: String,
      required: true,
      enum: ["A", "B", "C"],
      index: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },

    priceUnit: {
      type: String,
      enum: ["sq.ft", "sq.m", "piece"],
      default: "sq.ft",
    },

    views: {
      type: Number,
      default: 0,
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

// ========== INDEXES ==========
ProductSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
ProductSchema.index({ companyId: 1, status: 1, createdAt: -1 });
ProductSchema.index({ category: 1, pricePerUnit: 1 });
ProductSchema.index(
  { productName: "text", description: "text" },
  { weights: { productName: 10, description: 2 } }
);

// ========== PRE-SAVE VALIDATION ==========
ProductSchema.pre("save", async function (next) {
  // If companyId exists, verify seller is professional
  if (this.companyId) {
    const Seller = mongoose.model("Seller");
    const seller = await Seller.findById(this.sellerId);

    if (!seller) {
      return next(new Error("Seller not found"));
    }

    if (seller.seller_status !== "professional") {
      return next(
        new Error("Only professional sellers can have company products")
      );
    }
  }

  next();
});

// ========== METHODS ==========
ProductSchema.methods.isCompanyProduct = function () {
  return this.companyId !== null;
};

ProductSchema.methods.isIndividualProduct = function () {
  return this.companyId === null;
};

// ========== JSON TRANSFORM ==========
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
