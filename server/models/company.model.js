import mongoose from "mongoose";
import validator from "validator";

const CompanyBasicInfoSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    // ✅ PDF: seller_company_number (VAT/SIRET/BCE/RC)
    company_registration_number: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [5, "Registration number must be at least 5 characters"],
    },

    address: {
      street: { type: String, trim: true, required: false },
      city: { type: String, trim: true, required: false },
      stateOrProvince: { type: String, trim: true, required: false },
      countryOrRegion: { type: String, trim: true, required: false },
      postalCode: { type: String, trim: true, required: false },
    },

    legalowner: {
      type: String,
      required: false,
      trim: true,
      minlength: [2, "Legal owner name must be at least 2 characters"],
      maxlength: [100, "Legal owner name cannot exceed 100 characters"],
    },

    locationOfRegistration: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Location must be at least 2 characters"],
      maxlength: [100, "Location cannot exceed 100 characters"],
    },

    companyRegistrationYear: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          const year = parseInt(v);
          const currentYear = new Date().getFullYear();
          return year >= 1800 && year <= currentYear;
        },
        message: "Invalid registration year",
      },
    },

    registration_documents: [
      {
        type: String, // URLs to KYB docs
        validate: {
          validator: function (v) {
            return !v || validator.isURL(v);
          },
          message: "Invalid document URL",
        },
      },
    ],

    mainCategory: {
      type: [String],
      enum: ["natural stones", "ceramic & tiles", "alternatives & finishes"],
      required: false,
      set: (arr) => [...new Set(arr.map((v) => v.trim().toLowerCase()))],
    },

    subCategory: {
      type: [String],
      required: false,
      set: (arr) => [...new Set(arr.map((v) => v.trim().toLowerCase()))],
    },

    acceptedCurrency: [
      {
        type: String,
        uppercase: true,
        trim: true,
      },
    ],

    acceptedPaymentType: {
      type: [String],
      required: false,
    },

    languageSpoken: {
      type: [String],
      default: ["English"],
      required: false,
    },

    totalEmployees: {
      type: Number,
      min: [1, "Total employees must be at least 1"],
    },

    businessType: {
      type: String,
      enum: [
        "manufacturer",
        "trading company",
        "distributor",
        "exporter",
        "importer",
        "service provider",
      ],
    },

    factorySize: {
      type: String,
      trim: true,
    },

    factoryCountryOrRegion: {
      type: String,
      trim: true,
    },

    contractManufacturing: {
      type: Boolean,
      default: false,
    },

    numberOfProductionLines: {
      type: Number,
      min: [0, "Number of production lines cannot be negative"],
    },

    annualOutputValue: {
      type: String,
      trim: true,
    },

    rdTeamSize: {
      type: Number,
      min: [0, "R&D team size cannot be negative"],
    },

    tradeCapabilities: {
      type: [String],
      default: [],
      set: (arr) => [...new Set(arr.map((v) => v.trim()))],
    },
  },
  { _id: false }
);

const CompanyIntroSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v);
        },
        message: "Invalid logo URL",
      },
    },

    companyDescription: {
      type: String,
      required: false,
      minlength: [50, "Company description must be at least 50 characters"],
      maxlength: [5000, "Company description cannot exceed 5000 characters"],
    },

    companyPhotos: {
      type: [String],
      required: false,
      validate: {
        validator: function (arr) {
          if (!arr || arr.length === 0) return true;
          return arr.every((url) => validator.isURL(url));
        },
        message: "All company photos must be valid URLs",
      },
    },

    companyVideos: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          if (!arr || arr.length === 0) return true;
          return arr.every((url) => validator.isURL(url));
        },
        message: "All company videos must be valid URLs",
      },
    },
  },
  { _id: false }
);

const CompanyDataSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      unique: true, // ✅ One company per seller
      index: true,
    },

    companyBasicInfo: {
      type: CompanyBasicInfoSchema,
      required: false,
    },

    companyIntro: {
      type: CompanyIntroSchema,
      required: false,
    },
  },
  { timestamps: true }
);

// ======================== INDEXES ========================
CompanyDataSchema.index(
  { sellerId: 1 },
  { unique: true, partialFilterExpression: { sellerId: { $exists: true } } }
);
CompanyDataSchema.index({ "companyBasicInfo.mainCategory": 1 });
CompanyDataSchema.index({ "companyBasicInfo.subCategory": 1 });
CompanyDataSchema.index(
  { "companyBasicInfo.company_registration_number": 1 },
  { unique: true }
);

// Text search
CompanyDataSchema.index(
  {
    "companyBasicInfo.companyName": "text",
    "companyIntro.companyDescription": "text",
  },
  {
    weights: {
      "companyBasicInfo.companyName": 10,
      "companyIntro.companyDescription": 2,
    },
  }
);

// ======================== PRE-SAVE HOOKS ========================

// ✅ FIXED: Make pre-save hook transaction-aware
CompanyDataSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("sellerId")) {
    try {
      const Seller = mongoose.model("Seller");

      // ✅ FIX: Use session if available (transaction support)
      const session = this.$session();
      const seller = session
        ? await Seller.findById(this.sellerId).session(session)
        : await Seller.findById(this.sellerId);

      if (!seller) {
        return next(new Error("Seller not found"));
      }

      // ✅ CRITICAL: Only professional sellers can create companies
      if (seller.seller_status !== "professional") {
        return next(
          new Error("Only professional sellers can create a company profile")
        );
      }

      // ✅ Validate company_registration_number matches seller's
      if (this.companyBasicInfo?.company_registration_number) {
        if (
          seller.seller_company_number !==
          this.companyBasicInfo.company_registration_number
        ) {
          return next(
            new Error(
              "Company registration number must match seller's company number"
            )
          );
        }
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// ✅ Auto-sync Seller.companyId when company is created
CompanyDataSchema.post("save", async function (doc) {
  try {
    const Seller = mongoose.model("Seller");
    const seller = await Seller.findById(doc.sellerId);

    if (seller && !seller.companyId) {
      await seller.updateOne({ $set: { companyId: doc._id } });
    }
  } catch (error) {
    console.error("Error syncing Seller.companyId:", error);
    // Don't throw - company already created, just log error
  }
});

// ======================== METHODS ========================

CompanyDataSchema.methods.isComplete = function () {
  const basicInfo = this.companyBasicInfo;
  const intro = this.companyIntro;

  const hasBasicInfo = !!(
    basicInfo?.companyName &&
    basicInfo?.company_registration_number &&
    basicInfo?.locationOfRegistration
  );

  const hasIntro = !!(
    intro?.companyDescription && intro?.companyPhotos?.length > 0
  );

  return hasBasicInfo && hasIntro;
};

CompanyDataSchema.methods.getOwner = async function () {
  const Seller = mongoose.model("Seller");
  return Seller.findById(this.sellerId);
};

CompanyDataSchema.methods.isOwnedBy = function (sellerId) {
  return this.sellerId.toString() === sellerId.toString();
};

// ======================== STATICS ========================

CompanyDataSchema.statics.createWithSellerSync = async function (
  companyData,
  session
) {
  const Seller = mongoose.model("Seller");

  // ✅ Validate seller exists
  const seller = await Seller.findById(companyData.sellerId).session(session);
  if (!seller) {
    throw new Error("Seller not found");
  }

  // ✅ Validate seller is professional
  if (!seller.isProfessional()) {
    throw new Error("Only professional sellers can create a company profile");
  }

  // ✅ Check if company already exists for this seller
  const existingCompany = await this.findOne({
    sellerId: companyData.sellerId,
  }).session(session);

  if (existingCompany) {
    throw new Error("Company profile already exists for this seller");
  }

  // ✅ Validate registration number matches
  if (companyData.companyBasicInfo?.company_registration_number) {
    if (
      seller.seller_company_number !==
      companyData.companyBasicInfo.company_registration_number
    ) {
      throw new Error(
        "Company registration number must match seller's company number"
      );
    }
  }

  // ✅ Create company
  const company = new this(companyData);
  await company.save({ session });

  // ✅ Update Seller with company reference
  await seller.updateOne({ $set: { companyId: company._id } }, { session });

  return { company, seller };
};

CompanyDataSchema.statics.findByRegistrationNumber = function (regNumber) {
  return this.findOne({
    "companyBasicInfo.company_registration_number": regNumber,
  });
};

CompanyDataSchema.statics.findByCategory = function (category) {
  return this.find({
    "companyBasicInfo.mainCategory": category,
  });
};

// ======================== JSON TRANSFORM ========================
CompanyDataSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Company = mongoose.model("Company", CompanyDataSchema);

export default Company;
