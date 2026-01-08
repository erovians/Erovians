import mongoose from "mongoose";
import { ROLE_PERMISSIONS } from "../constants/permissions.js";

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
    permission: {
      type: [String],
      enum: [
        "dashboard_view",
        "product_create",
        "product_update",
        "order_view",
        "order_update",
        "team_manage",
        "profile_update",
      ],
      default: function () {
        return ROLE_PERMISSIONS[this.role] || [];
      },
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
