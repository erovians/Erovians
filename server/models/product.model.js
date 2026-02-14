import mongoose from "mongoose";
const { Schema } = mongoose;

const SizeSubSchema = new Schema(
  {
    length: {
      type: Number,
      required: true,
      min: [0.001, "Length must be greater than 0"],
    },
    lengthMeasurement: {
      type: String,
      enum: ["ft", "m", "mm"],
      default: "mm",
    },
    width: {
      type: Number,
      required: true,
      min: [0.001, "Width must be greater than 0"],
    },
    widthMeasurement: {
      type: String,
      enum: ["ft", "m", "mm"],
      default: "mm",
    },
    thickness: {
      type: Number,
      required: true,
      min: [0.001, "Thickness must be greater than 0"],
    },
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

    // ✅ OPTIONAL - Only for professional sellers with companies
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: false,
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
      index: true,
    },

    // ========== PDF: PRODUCT TYPE ==========

    product_type: {
      type: String,
      enum: {
        values: ["ready-to-go", "made-to-order", "CNC", "stone-cutting"],
        message: "{VALUE} is not a valid product type",
      },
      default: "ready-to-go",
      required: true,
      index: true,
    },

    // ========== PDF: BASIC INFO ==========

    productName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },

    product_sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // ✅ Allows null if not provided
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [50, "Description must be at least 50 characters"],
      maxlength: [3500, "Description cannot exceed 3500 characters"],
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
      min: [0.01, "Weight must be at least 0.01"],
    },

    weightMeasurement: {
      type: String,
      enum: {
        values: ["kg", "ton"],
        message: "{VALUE} is not a valid weight measurement",
      },
      default: "kg",
    },

    product_material: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Material must be at least 2 characters"],
    },

    origin: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Origin must be at least 2 characters"],
    },

    compliance_standards: {
      ce_marking: {
        type: Boolean,
        default: false,
      },
      material_standard: {
        type: String,
        trim: true,
      },
      technical_sheets: [
        {
          type: String,
          trim: true,
        },
      ],
      certificates: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    available_stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    expected_shipping_time: {
      type: Number,
      default: 7,
      min: [1, "Shipping time must be at least 1 day"],
    },

    batch_number: {
      type: String,
      trim: true,
    },

    // ========== CUSTOM/MADE-TO-ORDER FIELDS ==========

    technical_file: {
      url: {
        type: String,
        trim: true,
      },
      hash: {
        type: String,
        trim: true,
      },
      archive_path: {
        type: String,
        trim: true,
      },
      upload_timestamp: Date,
      seller_validation_timestamp: Date,
      final_plan_version: {
        type: String,
        trim: true,
      },
    },

    custom_parameters: {
      height: {
        type: Number,
        min: [0, "Height cannot be negative"],
      },
      width: {
        type: Number,
        min: [0, "Width cannot be negative"],
      },
      length: {
        type: Number,
        min: [0, "Length cannot be negative"],
      },
      thickness: {
        type: Number,
        min: [0, "Thickness cannot be negative"],
      },
      tolerances: {
        type: String,
        trim: true,
      },
      radius: {
        type: Number,
        min: [0, "Radius cannot be negative"],
      },
      angles: [
        {
          type: Number,
        },
      ],
      finish_types: [
        {
          type: String,
          trim: true,
        },
      ],
      chamfers: {
        type: String,
        trim: true,
      },
      vein_orientation: {
        type: String,
        trim: true,
      },
      drilling_positions: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    preview_3d_url: {
      type: String,
      trim: true,
    },

    // ========== CATEGORY (for all sellers) ==========

    category: {
      type: [String],
      required: true,
      enum: {
        values: [
          "natural stones",
          "ceramic & tiles",
          "alternatives & finishes",
        ],
        message: "{VALUE} is not a valid category",
      },
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
      enum: {
        values: ["A", "B", "C"],
        message: "{VALUE} is not a valid grade",
      },
      index: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Color must be at least 2 characters"],
    },

    pricePerUnit: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    priceUnit: {
      type: String,
      enum: {
        values: ["sq.ft", "sq.m", "piece"],
        message: "{VALUE} is not a valid price unit",
      },
      default: "sq.ft",
    },

    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"],
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "pending", "violation"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

// ========== INDEXES ==========
ProductSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
ProductSchema.index({ companyId: 1, status: 1, createdAt: -1 });
ProductSchema.index({ userId: 1, status: 1 }); // ✅ NEW: User products lookup
ProductSchema.index({ category: 1, pricePerUnit: 1 });
ProductSchema.index({ category: 1, grade: 1, status: 1 }); // ✅ NEW: Category + grade filter
ProductSchema.index({ product_sku: 1 }, { unique: true, sparse: true }); // ✅ NEW: Unique SKU
ProductSchema.index(
  { productName: "text", description: "text" },
  { weights: { productName: 10, description: 2 } }
);

// ========== PRE-SAVE VALIDATION ==========

// ✅ FIXED: Comprehensive validation with ownership check
ProductSchema.pre("save", async function (next) {
  try {
    const Seller = mongoose.model("Seller");
    const Company = mongoose.model("Company");
    const User = mongoose.model("User");

    // ✅ Step 1: Validate seller exists
    const seller = await Seller.findById(this.sellerId);
    if (!seller) {
      return next(new Error("Seller not found"));
    }

    // ✅ Step 2: Validate user exists and matches seller
    const user = await User.findById(this.userId);
    if (!user) {
      return next(new Error("User not found"));
    }

    if (seller.userId.toString() !== this.userId.toString()) {
      return next(new Error("User ID does not match seller's user"));
    }

    // ✅ Step 3: Validate seller is active and verified
    if (!seller.isActiveAndVerified()) {
      return next(
        new Error("Seller must be active and verified to create products")
      );
    }

    // ✅ Step 4: Handle company products (professional sellers)
    if (this.companyId) {
      // Verify seller is professional
      if (!seller.isProfessional()) {
        return next(
          new Error("Only professional sellers can create company products")
        );
      }

      // ✅ CRITICAL FIX: Verify company ownership
      const company = await Company.findOne({
        _id: this.companyId,
        sellerId: this.sellerId,
      });

      if (!company) {
        return next(
          new Error("Company not found or does not belong to this seller")
        );
      }

      // ✅ Verify seller.companyId matches
      if (
        seller.companyId &&
        seller.companyId.toString() !== this.companyId.toString()
      ) {
        return next(
          new Error("Company ID does not match seller's registered company")
        );
      }
    }

    // ✅ Step 5: Individual sellers cannot have companyId
    if (seller.isIndividual() && this.companyId) {
      return next(
        new Error("Individual sellers cannot create company products")
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});

// ✅ NEW: Validate product type specific requirements
ProductSchema.pre("save", function (next) {
  // Made-to-order and CNC products should have technical files
  if (["made-to-order", "CNC"].includes(this.product_type)) {
    if (!this.technical_file?.url) {
      console.warn(
        `Warning: ${this.product_type} product should have technical file`
      );
    }
  }

  // CNC and stone-cutting should have custom parameters
  if (["CNC", "stone-cutting"].includes(this.product_type)) {
    if (
      !this.custom_parameters ||
      Object.keys(this.custom_parameters).length === 0
    ) {
      console.warn(
        `Warning: ${this.product_type} product should have custom parameters`
      );
    }
  }

  next();
});

// ========== METHODS ==========

ProductSchema.methods.isCompanyProduct = function () {
  return this.companyId !== null && this.companyId !== undefined;
};

ProductSchema.methods.isIndividualProduct = function () {
  return !this.companyId;
};

// ✅ NEW: Check if product is active
ProductSchema.methods.isActive = function () {
  return this.status === "active";
};

// ✅ NEW: Check if in stock
ProductSchema.methods.isInStock = function () {
  return this.available_stock > 0;
};

// ✅ NEW: Validate ownership by seller
ProductSchema.methods.isOwnedBy = function (sellerId) {
  return this.sellerId.toString() === sellerId.toString();
};

// ✅ NEW: Get product owner details
ProductSchema.methods.getOwner = async function () {
  const Seller = mongoose.model("Seller");
  const Company = mongoose.model("Company");

  const seller = await Seller.findById(this.sellerId);
  const company = this.companyId
    ? await Company.findById(this.companyId)
    : null;

  return {
    seller,
    company,
    type: this.isCompanyProduct() ? "company" : "individual",
  };
};

// ✅ NEW: Increment view count
ProductSchema.methods.incrementViews = function () {
  return this.updateOne({ $inc: { views: 1 } });
};

// ✅ NEW: Update stock
ProductSchema.methods.updateStock = function (quantity, session = null) {
  const newStock = this.available_stock + quantity;

  if (newStock < 0) {
    throw new Error("Insufficient stock");
  }

  return this.updateOne({ $set: { available_stock: newStock } }, { session });
};

// ========== STATICS ==========

// ✅ NEW: Create product with validation (TRANSACTION SAFE)
/**
 * Creates a product with full validation
 *
 * @param {Object} productData - Product data
 * @param {mongoose.ClientSession} session - MongoDB session for transaction
 * @returns {Promise<Product>}
 */
ProductSchema.statics.createProduct = async function (
  productData,
  session = null
) {
  const Seller = mongoose.model("Seller");
  const Company = mongoose.model("Company");
  const User = mongoose.model("User");

  // ✅ Validate seller
  const seller = await Seller.findById(productData.sellerId).session(session);
  if (!seller) {
    throw new Error("Seller not found");
  }

  if (!seller.isActiveAndVerified()) {
    throw new Error("Seller must be active and verified");
  }

  // ✅ Validate user
  const user = await User.findById(productData.userId).session(session);
  if (!user) {
    throw new Error("User not found");
  }

  if (seller.userId.toString() !== productData.userId.toString()) {
    throw new Error("User does not match seller");
  }

  // ✅ Validate company ownership if companyId provided
  if (productData.companyId) {
    if (!seller.isProfessional()) {
      throw new Error("Only professional sellers can create company products");
    }

    const company = await Company.findOne({
      _id: productData.companyId,
      sellerId: productData.sellerId,
    }).session(session);

    if (!company) {
      throw new Error("Company not found or does not belong to seller");
    }
  }

  // ✅ Create product
  const product = new this(productData);
  await product.save({ session });

  return product;
};

// ✅ NEW: Find products by seller
ProductSchema.statics.findBySeller = function (sellerId, filter = {}) {
  return this.find({
    sellerId,
    ...filter,
  });
};

// ✅ NEW: Find products by company
ProductSchema.statics.findByCompany = function (companyId, filter = {}) {
  return this.find({
    companyId,
    ...filter,
  });
};

// ✅ NEW: Find active products
ProductSchema.statics.findActiveProducts = function (filter = {}) {
  return this.find({
    status: "active",
    ...filter,
  });
};

// ✅ NEW: Search products
ProductSchema.statics.searchProducts = function (searchText, filter = {}) {
  return this.find({
    $text: { $search: searchText },
    ...filter,
  }).sort({ score: { $meta: "textScore" } });
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
