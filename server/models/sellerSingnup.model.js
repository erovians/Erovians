import mongoose from "mongoose";

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

    // Seller specific fields
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

    // Status for seller account (active/suspended)
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Indexes
sellerSchema.index({ userId: 1 }, { unique: true });
sellerSchema.index({ businessId: 1 }, { unique: true });
sellerSchema.index({ varificationStatus: 1 });
sellerSchema.index({ status: 1 });

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
