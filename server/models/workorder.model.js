import mongoose from "mongoose";

const WorkOrderSchema = new mongoose.Schema({

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },

  wo_number: { type: String, required: true },
  so_number: { type: String, required: true },
  machine: { type: String, required: true },
  
  status: {
    type: String,
    enum: ["Planned", "Running", "Completed"],
    default: "Planned",
  },

  due_date: { type: Date, required: true },

  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("WorkOrder", WorkOrderSchema);
