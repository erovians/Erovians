import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sellerId: {
      type: mongoose.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "manager", "companyadmin", "staff"],
      default: "staff",
    },

    permissions: [
      {
        type: String,
      },
    ],

    invitedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", MemberSchema);
