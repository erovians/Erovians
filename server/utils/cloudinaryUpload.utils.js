import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// cloudinaryUpload.utils.js
const uploadOnCloudinary = async (localFilePath, mimetype) => {
  try {
    if (!localFilePath) {
      console.error("❌ No file path provided");
      return null;
    }

    // ✅ PEHLE CHECK KARO
    console.log(`📂 Checking file: ${localFilePath}`);
    if (!fs.existsSync(localFilePath)) {
      console.error(`❌ File not found BEFORE upload: ${localFilePath}`);
      return null;
    }
    console.log(`✅ File exists, uploading...`);

    const resourceType = mimetype === "application/pdf" ? "raw" : "auto";

    // Upload
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "ero_vians_uploads",
      resource_type: resourceType,
    });

    console.log("✅ File uploaded on Cloudinary:", uploadResult.secure_url);

    // Delete AFTER upload
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("🗑️ Local file deleted:", localFilePath);
      }
    } catch (deleteError) {
      console.error("⚠️ Failed to delete local file:", deleteError);
    }

    return uploadResult;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);

    // Cleanup on error
    try {
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("🗑️ Local file cleaned up:", localFilePath);
      }
    } catch (cleanupError) {
      console.error("⚠️ Failed to cleanup local file:", cleanupError);
    }

    return null;
  }
};

/**
 * Deletes a file from Cloudinary by its public_id
 * @param {string} publicId - The Cloudinary public_id of the file
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Cloudinary file deleted: ${publicId}`);
  } catch (error) {
    console.error(`❌ Failed to delete Cloudinary file ${publicId}:`, error);
    // Note: do not throw here, just log to avoid breaking rollback flow
  }
};

export { uploadOnCloudinary, cloudinary, deleteFromCloudinary };
