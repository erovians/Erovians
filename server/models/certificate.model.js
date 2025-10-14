// models/Certificate.js
import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    type: String,
    certificationName: String,
    legalOwner: String,
    issueDate: Date,
    expiryDate: Date,
    sameAsRegistered: Boolean,
    comments: String,
    fileUrl: String,
    cloudinaryId: String,
  },
  { timestamps: true }
);

const Certificate = mongoose.model("CompanyCertificate", certificateSchema);
export default Certificate;
