import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    contractId: { type: String, required: true, unique: true },
    order: { type: String, required: true },
    client: { type: String, required: true },
    status: { type: String, default: "Active" },
    created: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Contract", contractSchema);
