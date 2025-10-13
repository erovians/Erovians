// controllers/certificateController.js
import jwt from "jsonwebtoken";
import fs from "fs";
import Company from "../models/company.model.js";
import Certificate from "../models/certificate.js";
import {uploadOnCloudinary} from "../utils/cloudinaryUpload.utils.js";


export const uploadCertificate = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sellerId = decoded?.sellerId;
    if (!sellerId) return res.status(401).json({ error: "Invalid token" });

    const company = await Company.findOne({ sellerId });
    if (!company) return res.status(404).json({ error: "Company not found" });

    const {
      type,
      certificationName,
      legalOwner,
      expiryDate,
      sameAsRegistered,
      comments,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "File exceeds 5MB limit" });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadOnCloudinary.uploader.upload(req.file.path, {
      folder: "certificates",
      resource_type: "auto",
    });

    fs.unlinkSync(req.file.path);

    const certificate = new Certificate({
      companyId: company._id,
      type,
      certificationName,
      legalOwner,
      expiryDate,
      sameAsRegistered: sameAsRegistered === "1",
      comments,
      fileUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
    });

    await certificate.save();

    res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      certificate,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
