import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    seller_name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Seller name must be at least 2 characters"],
      maxlength: [100, "Seller name cannot exceed 100 characters"],
    },

    seller_status: {
      type: String,
      enum: ["professional", "individual"],
      required: true,
    },

    seller_company_number: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // ✅ Allows null for individual
      required: function () {
        return this.seller_status === "professional";
      },
    },

    seller_address: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Address must be at least 10 characters"],
      maxlength: [500, "Address cannot exceed 500 characters"],
    },

    seller_country: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Country name cannot exceed 50 characters"],
    },

    seller_email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    seller_phone: {
      type: String,
      trim: true,
    },

    seller_dispute_contact: {
      type: String,
      trim: true,
    },

    seller_kyc_hash: {
      type: String,
      trim: true,
    },

    seller_profile_url: {
      type: String,
      trim: true,
    },

    varificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: ["active", "suspended", "inactive"],
      default: "active",
    },

    // ❌ REMOVE - Not in PDF, Company mein hai
    // category: { ... }
  },
  { timestamps: true }
);

// INDEXES
sellerSchema.index({ userId: 1 }, { unique: true });
sellerSchema.index(
  { seller_company_number: 1 },
  { unique: true, sparse: true }
);
sellerSchema.index({ seller_status: 1, varificationStatus: 1 });

// METHODS
sellerSchema.methods.canHaveCompany = function () {
  return this.seller_status === "professional";
};

sellerSchema.methods.isVerified = function () {
  return this.varificationStatus === "Approved" && this.status === "active";
};

sellerSchema.methods.isProfessional = function () {
  return this.seller_status === "professional";
};

sellerSchema.methods.isIndividual = function () {
  return this.seller_status === "individual";
};

sellerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
