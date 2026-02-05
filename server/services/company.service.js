import mongoose from "mongoose";
import CompanyDetails from "../models/company.model.js";
import { registerCompanySchema } from "../zodSchemas/company/registerCompany.schema.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.utils.js";

// services/company.service.js

export const registerCompanyService = async (data, files, sellerId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const uploadedFiles = [];

  try {
    if (!sellerId) throw new Error("sellerId is required");

    const existingCompany = await CompanyDetails.findOne({ sellerId })
      .session(session)
      .lean();

    if (existingCompany)
      throw new Error("Company already registered for this seller");

    const address =
      typeof data.address === "string"
        ? JSON.parse(data.address)
        : data.address;

    const mainCategory =
      typeof data.mainCategory === "string"
        ? JSON.parse(data.mainCategory)
        : data.mainCategory;
    const subCategory =
      typeof data.subCategory === "string"
        ? JSON.parse(data.subCategory)
        : data.subCategory;

    const validated = await registerCompanySchema.parseAsync({
      sellerId,
      companyBasicInfo: {
        companyName: data.companyName,
        address,
        legalowner: data.legalowner,
        locationOfRegistration: data.locationOfRegistration,
        companyRegistrationYear: data.companyRegistrationYear,
        mainCategory,
        subCategory,
        acceptedCurrency: data.acceptedCurrency,
        acceptedPaymentType: data.acceptedPaymentType,
        languageSpoken: data.languageSpoken,
      },
      companyIntro: {
        companyDescription: data.companyDescription,
        logo: "",
        companyPhotos: [],
        companyVideos: [],
      },
    });

    // ✅ Upload logo (agar hai to)
    let logoUrl = "";
    if (files?.logo && files.logo[0]) {
      const res = await uploadOnCloudinary(
        files.logo[0].path,
        files.logo[0].mimetype
      );
      if (!res?.secure_url) throw new Error("Logo upload failed");
      uploadedFiles.push(res.public_id);
      logoUrl = res.secure_url;
    }

    // ✅ Upload photos
    // Upload photos with better error handling
    const photoUrls = await Promise.all(
      (files?.companyPhotos || []).map(async (file, index) => {
        try {
          console.log(`Uploading photo ${index + 1}:`, {
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
          });

          const res = await uploadOnCloudinary(file.path, file.mimetype);

          console.log(`Photo ${index + 1} upload result:`, res);

          if (!res?.secure_url) {
            throw new Error(
              `Photo ${index + 1} upload failed - no secure_url in response`
            );
          }

          uploadedFiles.push(res.public_id);
          return res.secure_url;
        } catch (err) {
          console.error(`Photo ${index + 1} upload error:`, err);
          throw new Error(`Photo ${index + 1} upload failed: ${err.message}`);
        }
      })
    );

    // ✅ Upload videos (field name: companyVideo, not companyVideos)
    const videoUrls = [];
    if (files?.companyVideo && files.companyVideo[0]) {
      const res = await uploadOnCloudinary(
        files.companyVideo[0].path,
        files.companyVideo[0].mimetype
      );
      if (!res?.secure_url) throw new Error("Video upload failed");
      uploadedFiles.push(res.public_id);
      videoUrls.push(res.secure_url);
    }

    // ✅ Build final object
    validated.companyBasicInfo.companyRegistrationYear = new Date(
      validated.companyBasicInfo.companyRegistrationYear
    );
    validated.companyIntro = {
      ...validated.companyIntro,
      logo: logoUrl, // ✅ Ab defined hai
      companyPhotos: photoUrls,
      companyVideos: videoUrls,
    };

    // ✅ Save inside a transaction
    const [savedCompany] = await CompanyDetails.create([validated], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return savedCompany;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    await Promise.all(
      uploadedFiles.map((id) => deleteFromCloudinary(id).catch(() => {}))
    );

    throw error;
  }
};

export const getCompanyDetailsService = async ({ sellerId, companyId }) => {
  try {
    const matchFilter = {};

    if (sellerId) matchFilter.sellerId = new mongoose.Types.ObjectId(sellerId);
    if (companyId) matchFilter._id = new mongoose.Types.ObjectId(companyId);

    const result = await CompanyDetails.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "companyId",
          as: "products",
          pipeline: [
            {
              $project: {
                productName: 1,
                productImages: 1,
                grade: 1,
                description: 1,
                status: 1,
              },
            },
            { $limit: 20 },
          ],
        },
      },
    ]);

    if (!result.length) throw new Error("Company not found");

    return result[0];
  } catch (err) {
    // logger.error("getCompanyDetailsService failed", { sellerId,companyId, error: err.message });
    throw err;
  }
};
