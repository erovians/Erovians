import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    role: { type: String, required: true },
    mobile: { type: Number, required: true },
    site: { type: String, default: "---" },
    activity: { type: String, default: "Just now" },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    photo: { type: String, default: null },
    photoPublicId: { type: String, default: null },
  },
  { timestamps: true }
);

const teamMember = mongoose.model("Team", teamMemberSchema);
export default teamMember;
