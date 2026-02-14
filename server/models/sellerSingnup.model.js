import mongoose from "mongoose";
import validator from "validator";

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
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
      index: true,
    },

    // ✅ FIXED: Required only for professional sellers
    seller_company_number: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // ✅ Allows null for individual sellers
      required: function () {
        return this.seller_status === "professional";
      },
      validate: {
        validator: function (v) {
          // Only validate if professional
          if (this.seller_status === "professional") {
            return v && v.length >= 5;
          }
          return true;
        },
        message:
          "Company number must be at least 5 characters for professional sellers",
      },
    },

    // ✅ NEW: Company reference for professional sellers
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
      index: true,
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
      validate: {
        validator: function (v) {
          return !v || validator.isEmail(v);
        },
        message: "Please provide a valid email address",
      },
    },

    // ✅ FIXED: Will be synced with User.mobile
    seller_phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, "any");
        },
        message: "Please provide a valid phone number",
      },
    },

    seller_dispute_contact: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || validator.isMobilePhone(v, "any");
        },
        message: "Please provide a valid dispute contact number",
      },
    },

    seller_kyc_hash: {
      type: String,
      trim: true,
    },

    seller_profile_url: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v);
        },
        message: "Please provide a valid URL",
      },
    },

    varificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

// ======================== INDEXES ========================
sellerSchema.index({ userId: 1 }, { unique: true });
sellerSchema.index(
  { seller_company_number: 1 },
  { unique: true, sparse: true }
);
sellerSchema.index({ seller_status: 1, varificationStatus: 1 });
sellerSchema.index({ status: 1, varificationStatus: 1 });
sellerSchema.index({ companyId: 1 }); // ✅ NEW: For company lookup

// ======================== PRE-SAVE HOOKS ========================

// ✅ Validate professional seller has company_number
sellerSchema.pre("save", function (next) {
  if (this.seller_status === "professional" && !this.seller_company_number) {
    return next(
      new Error(
        "Professional sellers must provide a company registration number"
      )
    );
  }

  // ✅ Individual sellers should NOT have company_number
  if (this.seller_status === "individual" && this.seller_company_number) {
    this.seller_company_number = null; // Auto-clear
  }

  next();
});

// ✅ Prevent status downgrade if seller has active products
sellerSchema.pre("save", async function (next) {
  if (!this.isNew && this.isModified("seller_status")) {
    // Check if downgrading from professional to individual
    if (this.seller_status === "individual") {
      try {
        const Product = mongoose.model("Product");
        const hasCompanyProducts = await Product.findOne({
          sellerId: this._id,
          companyId: { $ne: null },
        });

        if (hasCompanyProducts) {
          return next(
            new Error(
              "Cannot downgrade to individual - seller has active company products"
            )
          );
        }
      } catch (error) {
        return next(error);
      }
    }
  }
  next();
});

// ======================== METHODS ========================

sellerSchema.methods.canHaveCompany = function () {
  return this.seller_status === "professional";
};

sellerSchema.methods.isVerified = function () {
  return this.varificationStatus === "Approved";
};

sellerSchema.methods.isProfessional = function () {
  return this.seller_status === "professional";
};

sellerSchema.methods.isIndividual = function () {
  return this.seller_status === "individual";
};

// ✅ NEW: Combined active + verified check
sellerSchema.methods.isActiveAndVerified = function () {
  return this.status === "active" && this.varificationStatus === "Approved";
};

// ✅ NEW: Check if can upgrade to professional
sellerSchema.methods.canUpgradeToProfessional = async function () {
  if (this.seller_status === "professional") {
    return { canUpgrade: false, reason: "Already professional" };
  }

  const Company = mongoose.model("Company");
  const company = await Company.findOne({ sellerId: this._id });

  if (!company) {
    return {
      canUpgrade: false,
      reason: "Must create company profile first",
    };
  }

  return { canUpgrade: true, company };
};

// ✅ FIXED: Safe upgrade to professional with ownership validation
sellerSchema.methods.upgradeToProfessional = async function (
  companyNumber,
  session = null
) {
  const upgradeCheck = await this.canUpgradeToProfessional();

  if (!upgradeCheck.canUpgrade) {
    throw new Error(upgradeCheck.reason);
  }

  // ✅ CRITICAL FIX: Validate company ownership
  if (upgradeCheck.company.sellerId.toString() !== this._id.toString()) {
    throw new Error("Company doesn't belong to this seller");
  }

  this.seller_status = "professional";
  this.seller_company_number = companyNumber;
  this.companyId = upgradeCheck.company._id;

  return this.save({ session });
};

// ✅ NEW: Get seller with user status check
sellerSchema.methods.getFullStatus = async function () {
  const User = mongoose.model("User");
  const user = await User.findById(this.userId);

  return {
    seller: {
      status: this.status,
      verification: this.varificationStatus,
      type: this.seller_status,
    },
    user: {
      status: user?.status || "unknown",
      hasSellerRole: user?.hasRole("seller") || false,
    },
    isFullyActive: this.isActiveAndVerified() && user?.status === "active",
  };
};

// ======================== STATICS ========================

// ✅ NEW: Find seller by User mobile (for sync logic)
sellerSchema.statics.findByUserMobile = async function (mobile) {
  const User = mongoose.model("User");
  const user = await User.findByMobile(mobile);

  if (!user) return null;

  return this.findOne({ userId: user._id });
};

// ✅ NEW: Find all verified sellers
sellerSchema.statics.findVerifiedSellers = function (filter = {}) {
  return this.find({
    ...filter,
    status: "active",
    varificationStatus: "Approved",
  });
};

// ✅ NEW: Create seller with User sync (TRANSACTION REQUIRED)
/**
 * Creates a seller and updates User atomically using MongoDB transaction
 *
 * @param {Object} sellerData - Seller data (userId, seller_name, seller_status, etc.)
 * @param {mongoose.ClientSession} session - MongoDB session for transaction
 * @returns {Promise<Object>} { seller, user }
 *
 * @example
 * const session = await mongoose.startSession();
 * session.startTransaction();
 * try {
 *   const result = await Seller.createWithUserSync(sellerData, session);
 *   await session.commitTransaction();
 *   return result;
 * } catch (error) {
 *   await session.abortTransaction();
 *   throw error;
 * } finally {
 *   session.endSession();
 * }
 */
sellerSchema.statics.createWithUserSync = async function (sellerData, session) {
  const User = mongoose.model("User");

  // ✅ Validate user exists
  const user = await User.findById(sellerData.userId).session(session);
  if (!user) {
    throw new Error("User not found");
  }

  // ✅ Validate user has mobile
  if (!user.mobile) {
    throw new Error(
      "User must have a verified mobile number to become a seller"
    );
  }

  // ✅ Check if seller already exists for this user
  const existingSeller = await this.findOne({
    userId: sellerData.userId,
  }).session(session);
  if (existingSeller) {
    throw new Error("Seller profile already exists for this user");
  }

  // ✅ Sync seller_phone with User.mobile
  sellerData.seller_phone = user.mobile;

  // ✅ Create seller
  const seller = new this(sellerData);
  await seller.save({ session });

  // ✅ Update User with seller reference and role
  await user.updateOne(
    {
      $set: { sellerProfile: seller._id },
      $addToSet: { role: "seller" },
    },
    { session }
  );

  return { seller, user };
};

// ======================== JSON TRANSFORM ========================
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
