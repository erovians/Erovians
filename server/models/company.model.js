import mongoose from "mongoose";

const CompanyBasicInfoSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      stateOrProvince: {
        type: String,
        required: true,
        trim: true,
      },
      countryOrRegion: {
        type: String,
        required: true,
        trim: true,
      },
      postalCode: {
        type: String,
        required: true,
        trim: true,
      },
    },
    locationOfRegistration: {
      type: String,
      required: true,
      trim: true,
    },
    mainCategory: {
      type: String,
      required: true,
      enum: ["Marble", "Granite"],
    },
    productListingCategory: {
      type: String,
      required: true,
      trim: true,
    },
    acceptedCurrency: {
      type: String,
      required: true,
      enum: ["USD", "INR", "EUR", "JPY"],
      trim: true,
    },
    acceptedPaymentType: {
      type: [String],
      required: true,
      enum: ["UPI", "Credit Card", "Debit Card", "Bank Transfer", "Cash"],
    },
    languageSpoken: {
      type: [String],
      required: true,
      default: ["English", "Hindi"],
    },
  },
  { _id: false }
);

const CompanyIntroSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      required: true,
    },
    companyDescription: {
      type: String,
      required: true,
      minlength: 50,
    },
    companyPhotos: {
      type: [String],
      required: true,
    },
    companyVideo: {
      type: String,
    },
  },
  { _id: false }
);

const CompanyDataSchema = new mongoose.Schema(
  {
    companyBasicInfo: {
      type: CompanyBasicInfoSchema,
      required: true,
    },
    companyIntro: {
      type: CompanyIntroSchema,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },
  },
  { timestamps: true }
);

CompanyDataSchema.index({ "companyBasicInfo.mainCategory": 1 });

const SellerDashboard = mongoose.model("CompanyDetails", CompanyDataSchema);

export default SellerDashboard;
