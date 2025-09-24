import mongoose from "mongoose";
import { encrypt } from "../utils/encryption.utils.js";

const sellerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit mobile number"],
    },
    gstin: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
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
    businessDocument: {
      type: String,
    },
    isMobileVerified: {
      type: Boolean,
      default: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

sellerSchema.pre("save", function (next) {
  if (this.isModified("gstin")) this.gstin = encrypt(this.gstin);
  next();
});

sellerSchema.methods.getDecryptedData = function () {
  return { gstin: this.gstin };
};

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
