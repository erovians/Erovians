import mongoose from "mongoose";

const CompanyBasicInfoSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      index: true,
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
      type: String,
      required: true,
      enum: ["Marble", "Granite"],
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    acceptedCurrency: {
      type: String,
      required: true,
      enum: ["USD", "INR", "EUR", "JPY"],
    },
    acceptedPaymentType: {
      type: [String],
      required: true,
      enum: ["UPI", "Credit Card", "Debit Card", "Bank Transfer", "Cash"],
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
    logo: { type: String, required: true },
    companyDescription: { type: String, required: true, minlength: 50 },
    companyPhotos: {
      type: [String],
      required: true,
      validate: (val) => val.length >= 1,
    },
    companyVideos: { type: [String], default: [] },
  },
  { _id: false }
);

const CompanyDataSchema = new mongoose.Schema(
  {
    SellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
      unique: true,
    },
    companyBasicInfo: { type: CompanyBasicInfoSchema, required: true },
    companyIntro: { type: CompanyIntroSchema, required: true },
  },
  { timestamps: true }
);

CompanyDataSchema.index({ "companyBasicInfo.mainCategory": 1 });
CompanyDataSchema.index({ "companyBasicInfo.subCategory": 1 });
CompanyDataSchema.index({ "companyBasicInfo.acceptedCurrency": 1 });

const CompanyDetails = mongoose.model("Company", CompanyDataSchema);

export default CompanyDetails;
