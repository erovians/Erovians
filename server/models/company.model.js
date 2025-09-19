import mongoose from "mongoose";

const CompanyBasicInfoSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
      index: true,
    },
    address: {
      street: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
      city: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50,
        match: /^[a-zA-Z\s]+$/,
      },
      stateOrProvince: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50,
        match: /^[a-zA-Z\s]+$/,
      },
      countryOrRegion: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 50,
      },
      postalCode: {
        type: String,
        trim: true,
        match: /^[0-9]{4,10}$/,
      },
    },
    locationOfRegistration: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    mainCategory: {
      type: String,
      enum: ["Marble", "Granite"],
    },
    productListingCategory: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    acceptedCurrency: {
      type: String,
      enum: ["USD", "INR", "EUR", "JPY"],
    },
    acceptedPaymentType: {
      type: [String],
      enum: ["UPI", "Credit Card", "Debit Card", "Bank Transfer", "Cash"],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one payment type must be selected",
      },
    },
    languageSpoken: {
      type: [String],
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
    },
    companyIntro: {
      type: CompanyIntroSchema,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: false,
    },
  },
  { timestamps: true }
);

CompanyDataSchema.index({ "companyBasicInfo.mainCategory": 1 });

const SellerDashboard = mongoose.model("CompanyDetails", CompanyDataSchema);

export default SellerDashboard;
