import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  cost_per_km: { type: Number, default: 0.5 },
  weight_factor: { type: Number, default: 0.1 },
  volume_factor: { type: Number, default: 5 },
  handling_extra: { type: Number, default: 15 },
  webhook_url: { type: String },
});

export default mongoose.models.Partner ||
  mongoose.model("Partner", PartnerSchema);
