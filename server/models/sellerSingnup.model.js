import mongoose from "mongoose";
import { encrypt } from "../utils/encryption.utils.js";

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gstin: {
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

    documentUrl: {
      type: String,
      required: true,
    },
    varificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
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
