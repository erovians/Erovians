import mongoose from "mongoose";

const CompanyBasicInfoSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    // ✅ PDF: seller_company_number (VAT/SIRET/BCE/RC)
    company_registration_number: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
      minlength: 2,
      maxlength: 100,
    },
    locationOfRegistration: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    companyRegistrationYear: {
      type: String,
      required: false,
      trim: true,
    },

    registration_documents: [
      {
        type: String, // URLs to KYB docs
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
    acceptedCurrency: [{ type: String }],
    acceptedPaymentType: {
      type: [String],
      required: false,
      // validate: {
      //   validator: function (arr) {
      //     return arr.length > 0;
      //   },
      //   message: "At least one payment method is required",
      // },
    },
    languageSpoken: {
      type: [String],
      default: ["English"],
      required: false,
    },
    totalEmployees: {
      type: Number,
      min: 1,
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
      min: 0,
    },
    annualOutputValue: {
      type: String,
      trim: true,
    },
    rdTeamSize: {
      type: Number,
      min: 0,
    },
    tradeCapabilities: {
      type: [String],
      default: [],
      set: (arr) => [...new Set(arr.map((v) => v.trim()))],
    },

    //*********************** new fields ***********************//
    totalEmployees: {
      type: Number,
      // required: true,
      min: 1,
    },
    businessType: {
      type: String,
      // required: true,
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
      type: String, // e.g. "10,000 sq ft"
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
      min: 0,
    },
    annualOutputValue: {
      type: String,
      trim: true,
    },
    rdTeamSize: {
      type: Number,
      min: 0,
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
    logo: { type: String, required: false },
    companyDescription: { type: String, required: false, minlength: 50 },
    companyPhotos: {
      type: [String],
      required: false,
      // validate: (val) => val.length >= 1,
    },
    companyVideos: { type: [String], default: [] },
  },
  { _id: false }
);

const CompanyDataSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    companyBasicInfo: { type: CompanyBasicInfoSchema, required: false },
    companyIntro: { type: CompanyIntroSchema, required: false },
  },
  { timestamps: true }
);

// Indexes
CompanyDataSchema.index(
  { sellerId: 1 },
  { unique: true, partialFilterExpression: { sellerId: { $exists: true } } }
);
CompanyDataSchema.index({ "companyBasicInfo.mainCategory": 1 });
CompanyDataSchema.index({ "companyBasicInfo.subCategory": 1 });

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

// JSON transform
CompanyDataSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const CompanyDetails = mongoose.model("Company", CompanyDataSchema);

export default CompanyDetails;

/*

*************COMPANY OVERVIEW*************
Total Employees
Business Type

*************PRODUCTION CAPACITY*************
Factory Size
Factory Country/Region
Contract Manufacturing
No. of Production Lines
Annual Output Value


*************RESEARCH & DEVELOPMENT*************
R&D Team Size

*************TRADE CAPABILITIES*************
TRADE CAPABILITIES


*/
