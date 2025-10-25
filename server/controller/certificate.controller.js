import Certificate from "../models/certificate.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.utils.js";
import fs from "fs";
import Company from "../models/company.model.js";
import { certificateSchema } from "../zodSchemas/company/certificate.schema.js";

export const uploadCertificate = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    if (!sellerId) {
      return res.status(400).json({ message: "SellerId is required" });
    }

    const company = await Company.findOne({ sellerId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const parsedData = certificateSchema.parse(req.body);

    let fileUrl = "";
    let cloudinaryId = "";

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(
        req.file.path,
        req.file.mimetype
      );

      if (uploadResult) {
        fileUrl = uploadResult.secure_url;
        cloudinaryId = uploadResult.public_id;
      }

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const newCertificate = await Certificate.create({
      companyId: company._id,
      ...parsedData,
      sameAsRegistered:
        parsedData.sameAsRegistered === "1" ||
        parsedData.sameAsRegistered === true,
      fileUrl,
      cloudinaryId,
    });

    return res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully.",
      data: newCertificate,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, errors: error.errors });
    }

    console.error("Error uploading certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getCertificates = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    if (!sellerId) {
      return res.status(400).json({ message: "SellerId is required" });
    }

    const company = await Company.findOne({ sellerId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const certificates = await Certificate.find({
      companyId: company._id,
    }).sort({ createdAt: -1 });
    return res.json({ certificates });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    console.log("Delete request params:");
    const sellerId = req.user.userId;
    const certificateId = req.params.id;

    if (!sellerId) {
      return res.status(400).json({ message: "SellerId is required" });
    }

    // Find the company for this seller
    const company = await Company.findOne({ sellerId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the certificate and ensure it belongs to this company
    const certificate = await Certificate.findOne({
      _id: certificateId,
      companyId: company._id,
    });

    if (!certificate) {
      return res
        .status(404)
        .json({ message: "Certificate not found or not authorized" });
    }

    // Delete the certificate
    await Certificate.deleteOne({ _id: certificateId });

    return res
      .status(200)
      .json({ message: "Certificate deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
