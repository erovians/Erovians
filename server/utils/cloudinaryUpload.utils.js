import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import logger from "../config/winston.js";

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
      logger.error("No file path provided for Cloudinary upload");
      return null;
    }

    // Check if file exists
    logger.info(`Checking file before upload: ${localFilePath}`);
    if (!fs.existsSync(localFilePath)) {
      logger.error(`File not found before upload: ${localFilePath}`);
      return null;
    }
    logger.info("File exists, initiating upload to Cloudinary");

    const resourceType = mimetype === "application/pdf" ? "raw" : "auto";

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "ero_vians_uploads",
      resource_type: resourceType,
    });

    logger.info("File uploaded successfully to Cloudinary", {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    // Delete local file after successful upload
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        logger.info("Local file deleted after upload", {
          path: localFilePath,
        });
      }
    } catch (deleteError) {
      logger.warn("Failed to delete local file after upload", {
        path: localFilePath,
        error: deleteError.message,
      });
    }

    return uploadResult;
  } catch (error) {
    logger.error("Cloudinary upload failed", {
      error: error.message,
      path: localFilePath,
    });

    // Cleanup local file on error
    try {
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        logger.info("Local file cleaned up after upload failure", {
          path: localFilePath,
        });
      }
    } catch (cleanupError) {
      logger.warn("Failed to cleanup local file after upload failure", {
        path: localFilePath,
        error: cleanupError.message,
      });
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
  if (!publicId) {
    logger.warn("No public_id provided for Cloudinary deletion");
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info("File deleted from Cloudinary", { publicId });
  } catch (error) {
    logger.error("Failed to delete file from Cloudinary", {
      publicId,
      error: error.message,
    });
    // Note: do not throw here, just log to avoid breaking rollback flow
  }
};

export { uploadOnCloudinary, cloudinary, deleteFromCloudinary };
