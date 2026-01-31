import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    // ==================== QUOTATION TYPE ====================
    quotation_type: {
      type: String,
      enum: ["product", "product-broadcast", "rfq"],
      required: true,
    },

    // ==================== USER REFERENCE ====================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      // Will be validated in pre-save hook
    },

    // ==================== PRODUCT-BASED FIELDS (Type 1 & 2) ====================
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: function () {
        return ["product", "product-broadcast"].includes(this.quotation_type);
      },
      index: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: function () {
        return ["product", "product-broadcast"].includes(this.quotation_type);
      },
      index: true,
    },

    // ==================== CATEGORY FIELDS (Type 2 & 3) ====================
    category: {
      type: String,
      required: function () {
        return ["product-broadcast", "rfq"].includes(this.quotation_type);
      },
      index: true,
    },

    subcategories: {
      type: [String],
      required: function () {
        return this.quotation_type === "rfq";
      },
      validate: {
        validator: function (arr) {
          return this.quotation_type !== "rfq" || arr.length > 0;
        },
        message: "At least one subcategory is required for RFQ",
      },
    },

    // ==================== QUANTITY & UNIT (ALL TYPES) ====================
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },

    unit: {
      type: String,
      enum: ["sq.ft", "sq.m", "piece", "ton", "kg", "running meter", "pcs"],
      default: "sq.ft",
    },

    // ==================== MESSAGE FIELDS ====================
    // For Type 1 & 2: Simple message/requirements
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
      required: function () {
        return ["product", "product-broadcast"].includes(this.quotation_type);
      },
    },

    // For Type 3: Detailed requirements (separate field)
    requirements: {
      type: String,
      trim: true,
      required: function () {
        return this.quotation_type === "rfq";
      },
    },

    // For Type 3: Additional specifications (optional)
    specifications: {
      type: String,
      trim: true,
    },

    // ==================== PROJECT DETAILS (ALL TYPES) ====================
    timeline: {
      type: String,
      enum: [
        "Within 1 week",
        "Within 2 weeks",
        "Within 1 month",
        "1-3 months",
        "3+ months",
        "Flexible",
      ],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },

    budgetMin: {
      type: Number,
      min: 0,
    },

    budgetMax: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return !this.budgetMin || !value || value >= this.budgetMin;
        },
        message: "Budget max must be greater than or equal to budget min",
      },
    },

    // ==================== FILE UPLOADS (ALL TYPES) ====================
    uploadedFiles: [
      {
        url: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String, // image/jpeg, application/pdf, etc.
        },
        size: {
          type: Number, // in bytes
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ==================== BROADCAST TRACKING (Type 2 & 3) ====================
    broadcastToSellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
      },
    ],

    // ==================== CONTACT INFO (for non-authenticated users) ====================
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please provide a valid email address",
      },
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    // ==================== STATUS & METADATA ====================
    status: {
      type: String,
      enum: ["pending", "responded", "accepted", "rejected", "closed"],
      default: "pending",
      index: true,
    },

    // Track responses from sellers
    responses: [
      {
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Seller",
        },
        respondedAt: {
          type: Date,
          default: Date.now,
        },
        quotedPrice: Number,
        message: String,
        attachments: [String],
      },
    ],

    // Metadata
    viewedBy: [
      {
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Seller",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    closedAt: Date,
    closedReason: String,
  },
  {
    timestamps: true,
  }
);

// ==================== INDEXES ====================
quotationSchema.index({ userId: 1, status: 1 });
quotationSchema.index({ sellerId: 1, status: 1 });
quotationSchema.index({ quotation_type: 1, status: 1 });
quotationSchema.index({ category: 1, status: 1 });
quotationSchema.index({ createdAt: -1 });
quotationSchema.index({ broadcastToSellers: 1 });

// Compound index for seller dashboard queries
quotationSchema.index({
  sellerId: 1,
  status: 1,
  createdAt: -1,
});

// ==================== VIRTUAL FIELDS ====================
quotationSchema.virtual("isProductBased").get(function () {
  return ["product", "product-broadcast"].includes(this.quotation_type);
});

quotationSchema.virtual("isRFQ").get(function () {
  return this.quotation_type === "rfq";
});

quotationSchema.virtual("isBroadcast").get(function () {
  return ["product-broadcast", "rfq"].includes(this.quotation_type);
});

quotationSchema.virtual("responseCount").get(function () {
  return this.responses ? this.responses.length : 0;
});

// ==================== METHODS ====================
quotationSchema.methods.addResponse = function (sellerId, responseData) {
  this.responses.push({
    sellerId,
    ...responseData,
  });

  if (this.status === "pending") {
    this.status = "responded";
  }

  return this.save();
};

quotationSchema.methods.markAsViewed = function (sellerId) {
  const alreadyViewed = this.viewedBy.some(
    (view) => view.sellerId.toString() === sellerId.toString()
  );

  if (!alreadyViewed) {
    this.viewedBy.push({ sellerId });
    return this.save();
  }
};

quotationSchema.methods.closeQuotation = function (reason) {
  this.status = "closed";
  this.closedAt = Date.now();
  this.closedReason = reason;
  return this.save();
};

// ==================== STATIC METHODS ====================
quotationSchema.statics.findByUser = function (userId, status = null) {
  const query = { userId };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

quotationSchema.statics.findBySeller = function (sellerId, status = null) {
  const query = {
    $or: [
      { sellerId }, // Direct quotations
      { broadcastToSellers: sellerId }, // Broadcast quotations
    ],
  };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

quotationSchema.statics.findByCategory = function (
  category,
  subcategories = null
) {
  const query = {
    quotation_type: { $in: ["product-broadcast", "rfq"] },
    category,
  };

  if (subcategories && subcategories.length > 0) {
    query.subcategories = { $in: subcategories };
  }

  return this.find(query).sort({ createdAt: -1 });
};

// ==================== PRE-SAVE HOOKS ====================
quotationSchema.pre("save", function (next) {
  // Validate: Either userId OR contactEmail must exist
  if (!this.userId && !this.contactEmail) {
    return next(
      new Error(
        "Either userId (for logged-in users) or contactEmail (for guests) is required"
      )
    );
  }

  // Validate file count based on quotation type
  if (this.uploadedFiles && this.uploadedFiles.length > 0) {
    const maxFiles = this.quotation_type === "rfq" ? 5 : 3;
    if (this.uploadedFiles.length > maxFiles) {
      return next(
        new Error(
          `Maximum ${maxFiles} files allowed for ${this.quotation_type}`
        )
      );
    }
  }

  next();
});

// ==================== JSON TRANSFORM ====================
quotationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;
