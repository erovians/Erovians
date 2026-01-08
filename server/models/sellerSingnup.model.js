import mongoose from "mongoose";
import { encrypt } from "../utils/encryption.utils.js";

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
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

    //  NEW FIELDS (REQUIRED)
    seller_status: {
      type: String,
      enum: ["professional", "Individual"],
      required: true,
    },

    seller_address: {
      type: String,
      required: true,
      trim: true,
    },
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
