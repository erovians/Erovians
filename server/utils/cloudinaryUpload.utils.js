import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, mimetype) => {
  try {
    if (!localFilePath) return null;

    const resourceType = mimetype === "application/pdf" ? "raw" : "auto";

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "ero_vians_uploads",
      resource_type: resourceType,
    });
    console.log("File is uploaded on Cloudinary:", uploadResult.url);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return uploadResult;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.log("Cloudinary upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary };