import express from "express";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    console.log("req.files:", req.files);

    if (!req.files || !req.files.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const file = req.files.file;

    const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!acceptedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: "Invalid file type. Only JPG, PNG, and PDF are allowed.",
      });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return res
        .status(400)
        .json({ success: false, error: "File size exceeds 5MB." });
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "ero_vians_uploads",
      resource_type: "auto",
    });

    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
