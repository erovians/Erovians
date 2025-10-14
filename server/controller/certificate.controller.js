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
      expiryDate,
      sameAsRegistered,
      comments,
      companyId,
    } = req.body;

    // Validate required fields
    if (!type || !certificationName || !legalOwner || !expiryDate) {
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
      expiryDate,
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
    // const sellerId = req.user?.sellerId || req.user?.id;
    const sellerId = "6870e6e558e2ba32d6b1eb32";

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
