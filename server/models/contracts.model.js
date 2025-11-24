import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    contractId: { type: String, required: true, unique: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    client: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Completed", "Inactive"],
      default: "Active",
    },
    created: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Contract", contractSchema);
