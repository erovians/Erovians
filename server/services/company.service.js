import mongoose from "mongoose";
import CompanyDetails from "../models/company.model.js";
import { registerCompanySchema } from "../zodSchemas/company/registerCompany.schema.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.utils.js";

export const registerCompanyService = async (data, files) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const uploadedFiles = [];

  try {
    const SellerId = "6870e6e558e2ba32d6b1eb47";
    if (!SellerId) throw new Error("SellerId is required");

    // ✅ Step 1: Check for existing company
    const existingCompany = await CompanyDetails.findOne({ SellerId })
      .session(session)
      .lean();

    if (existingCompany)
      throw new Error("Company already registered for this seller");

    // ✅ Step 2: Parse and validate input
    const address =
      typeof data.address === "string"
        ? JSON.parse(data.address)
        : data.address;

    const validated = await registerCompanySchema.parseAsync({
      SellerId,
      companyBasicInfo: {
        companyName: data.companyName,
        address,
        legalowner: data.legalowner,
        locationOfRegistration: data.locationOfRegistration,
        companyRegistrationYear: data.companyRegistrationYear,
        mainCategory: data.mainCategory,
        subCategory: data.subCategory,
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

    const logoUrl = await (async () => {
      if (!files?.logo?.[0]) return "";
      const file = files.logo[0];
      const res = await uploadOnCloudinary(file.path, file.mimetype);
      if (!res?.secure_url) throw new Error("Logo upload failed");
      uploadedFiles.push(res.public_id);
      return res.secure_url;
    })();

    const photoUrls = await Promise.all(
      (files?.companyPhotos || []).map(async (file) => {
        const res = await uploadOnCloudinary(file.path, file.mimetype);
        if (!res?.secure_url) throw new Error("Photo upload failed");
        uploadedFiles.push(res.public_id);
        return res.secure_url;
      })
    );

    const videoUrls = await Promise.all(
      (files?.companyVideos || []).map(async (file) => {
        const res = await uploadOnCloudinary(file.path, file.mimetype);
        if (!res?.secure_url) throw new Error("Video upload failed");
        uploadedFiles.push(res.public_id);
        return res.secure_url;
      })
    );

    // ✅ Step 4: Build final object
    validated.companyBasicInfo.companyRegistrationYear = new Date(
      validated.companyBasicInfo.companyRegistrationYear
    );
    validated.companyIntro = {
      ...validated.companyIntro,
      logo: logoUrl,
      companyPhotos: photoUrls,
      companyVideos: videoUrls,
    };

    // ✅ Step 5: Save inside a transaction
    const [savedCompany] = await CompanyDetails.create([validated], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return savedCompany;
  } catch (error) {
    // 🔁 Rollback DB
    await session.abortTransaction();
    session.endSession();

    // 🔁 Rollback Cloudinary uploads
    await Promise.all(
      uploadedFiles.map((id) => deleteFromCloudinary(id).catch(() => {}))
    );

    throw error;
  }
};

export const getCompanyDetailsService = async (sellerId) => {
  try {
    if (!sellerId) throw new Error("SellerId is required");

    const result = await CompanyDetails.aggregate([
      { $match: { SellerId: new mongoose.Types.ObjectId(sellerId) } },
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
    throw err;
  }
};
