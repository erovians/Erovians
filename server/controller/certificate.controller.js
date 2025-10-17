import Certificate from "../models/certificate.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.utils.js";
import fs from "fs";
import Company from "../models/company.model.js";

export const uploadCertificate = async (req, res) => {
  try {
    const {
      type,
      certificationName,
      legalOwner,
      issueDate,
      expiryDate,
      Description,
      sameAsRegistered,
      comments,
    } = req.body;

    const sellerId = req.user.userId;
    console.log("User ID:", sellerId);

    if (!sellerId) {
      return res.status(400).json({ message: "SellerId is required" });
    }

    const companyId = await Company.findOne({ sellerId });

    // Validate required fields
    if (
      !type ||
      !certificationName ||
      !legalOwner ||
      !issueDate ||
      !Description
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    let fileUrl = "";
    let cloudinaryId = "";

    // Upload file to Cloudinary if provided
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(
        req.file.path,
        req.file.mimetype
      );

      if (uploadResult) {
        fileUrl = uploadResult.secure_url;
        cloudinaryId = uploadResult.public_id;
      }

      // Remove temp file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // Save to MongoDB
    const newCertificate = await Certificate.create({
      companyId,
      type,
      certificationName,
      legalOwner,
      issueDate,
      expiryDate,
      Description,
      sameAsRegistered: sameAsRegistered === "1" || sameAsRegistered === true,
      comments,
      fileUrl,
      cloudinaryId,
    });

    return res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully.",
      data: newCertificate,
    });
  } catch (error) {
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
      return res.status(404).json({ message: "Certificate not found or not authorized" });
    }

    // Delete the certificate
    await Certificate.deleteOne({ _id: certificateId });

    return res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};