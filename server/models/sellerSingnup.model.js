import mongoose from "mongoose";
import { encrypt } from "../utils/encryption.utils.js";

const sellerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit mobile number"],
    },
    isMobileVerified: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user", "seller"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    // Business details
    businessId: {
      type: String,
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["All", "Marbles", "Granites"],
      default: "All",
    },
    // New fields from controller
    sellername: {
      type: String,
      required: [true, "Seller name is required"],
      trim: true,
    },
    companyregstartionlocation: {
      type: String,
      required: [true, "Company registration location is required"],
      trim: true,
    },

    // Document upload & verification
    documentUrl: {
      type: String,
      required: true,
    },
    varificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // -----------------______________________________NEW FIELD TO ADD __________________________________________-------------------
    seller_status: {
      type: String,
      enum: ["professional", "Individual"],
    },

    seller_address: {
      type: String,
    },
    seller_profile: {
      type: String,
    },

    // -----------------______________________________NEW FIELD TO ADD__________________________________________-------------------
  },
  { timestamps: true }
);

// const sellerSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

//     businessId: { type: String, required: true, unique: true },
//     businessName: { type: String, required: true },
//     category: {
//       type: String,
//       enum: ["All", "Marbles", "Granites"],
//       default: "All",
//     },

//     sellername: { type: String, required: true },
//     companyRegistrationLocation: { type: String, required: true },

//     documentUrl: { type: String, required: true },
//     verificationStatus: {
//       type: String,
//       enum: ["Pending", "Approved", "Rejected"],
//       default: "Pending",
//     },

//     sellerStatus: { type: String, enum: ["professional", "individual"] },
//     sellerAddress: { type: String },
//   },
//   { timestamps: true }
// );

sellerSchema.pre("save", function (next) {
  if (this.isModified("gstin")) this.gstin = encrypt(this.gstin);
  next();
});

sellerSchema.methods.getDecryptedData = function () {
  return { gstin: this.gstin };
};

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
