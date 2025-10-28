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
    address: {
      street: { type: String, trim: true, required: true },
      city: { type: String, trim: true, required: true },
      stateOrProvince: { type: String, trim: true, required: true },
      countryOrRegion: { type: String, trim: true, required: true },
      postalCode: { type: String, trim: true, required: true },
    },
    legalowner: {
      type: String,
      required: true,
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

    mainCategory: {
      type: [String],
      enum: ["natural stones", "ceramic & tiles", "alternatives & finishes"],
      required: true,
      set: (arr) => [...new Set(arr.map((v) => v.trim().toLowerCase()))],
    },
    subCategory: {
      type: [String],
      required: true,
      set: (arr) => [...new Set(arr.map((v) => v.trim().toLowerCase()))],
    },
    acceptedCurrency: [{ type: String }],
    acceptedPaymentType: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one payment method is required",
      },
    },
    languageSpoken: {
      type: [String],
      default: ["English"],
      required: true,
    },
  },
  { _id: false }
);

const CompanyIntroSchema = new mongoose.Schema(
  {
    logo: { type: String, required: false },
    companyDescription: { type: String, required: true, minlength: 50 },
    companyPhotos: {
      type: [String],
      required: false,
      validate: (val) => val.length >= 1,
    },
    companyVideos: { type: [String], default: [] },
  },
  { _id: false }
);

const CompanyDataSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },
    companyBasicInfo: { type: CompanyBasicInfoSchema, required: true },
    companyIntro: { type: CompanyIntroSchema, required: true },
  },
  { timestamps: true }
);

CompanyDataSchema.index(
  { sellerId: 1 },
  { unique: true, partialFilterExpression: { sellerId: { $exists: true } } }
);

CompanyDataSchema.index({ "companyBasicInfo.mainCategory": 1 });
CompanyDataSchema.index({ "companyBasicInfo.subCategory": 1 });

// text index for quick name/description search (weights help rank)
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

// tidy API payloads
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
