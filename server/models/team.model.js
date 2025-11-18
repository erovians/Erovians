import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    site: { type: String, default: "---" },
    activity: { type: String, default: "Just now" },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
  },
  { timestamps: true }
);

const teamMember = mongoose.model("Team", teamMemberSchema);
export default teamMember;
