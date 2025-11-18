import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    members: {  
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  },
  { timestamps: true }
);

// chatSchema.index({ userId: 1, sellerId: 1 }, { unique: true });
chatSchema.index({ "members.userId": 1, "members.sellerId": 1 }, { unique: true });


export default mongoose.model("Chat", chatSchema);
