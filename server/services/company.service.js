// src/services/company.service.js
import mongoose from "mongoose";
import CompanyDetails from "../models/company.model.js";
import Seller from "../models/sellerSingnup.model.js";
import { registerCompanySchema } from "../zodSchemas/company/registerCompany.schema.js";
import { uploadOnCloudinary, cloudinary } from "../utils/cloudinaryUpload.utils.js";

// export const registerCompanyService = async (data, files) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const SellerId = "6870e6e558e2ba32d6b1eb37"; // frontend must send sellerId with form data
//     if (!SellerId) throw new Error("SellerId is required");

//     // // Step 1: Validate seller exists
//     // const seller = await Seller.findById(SellerId).session(session);
//     // if (!seller) throw new Error("Seller not found");

//     // Step 2: Check if company already exists
//     const existingCompany = await CompanyDetails.findOne({ SellerId }).session(session);
//     if (existingCompany) throw new Error("Company already registered for this seller");

//     // Step 3: Handle file uploads
//     let logoUrl = "";
//     let photoUrls = [];
//     let videoUrls = [];

//     // Upload logo
//     if (files?.logo?.[0]) {
//       const result = await uploadOnCloudinary(files.logo[0].path, files.logo[0].mimetype);
//       if (!result?.secure_url) throw new Error("Logo upload failed");
//       logoUrl = result.secure_url;
//     }

//     // Upload photos
//     for (const file of files?.companyPhotos || []) {
//       const result = await uploadOnCloudinary(file.path, file.mimetype);
//       if (!result?.secure_url) throw new Error("One of the photos failed to upload");
//       photoUrls.push(result.secure_url);
//     }

//     // Upload video
//     if (files?.companyVideo?.[0]) {
//       const result = await uploadOnCloudinary(files.companyVideo[0].path, files.companyVideo[0].mimetype);
//       if (!result?.secure_url) throw new Error("Video upload failed");
//       videoUrls.push(result.secure_url);
//     }

//     // Step 4: Parse and validate address
//     let address = data.address;
//     if (typeof address === "string") {
//       try {
//         address = JSON.parse(address);
//       } catch {
//         throw new Error("Invalid address format");
//       }
//     }

//     // Step 5: Prepare object
//     const companyData = {
//       SellerId,
//       companyBasicInfo: {
//         companyName: data.companyName,
//         address,
//         legalowner: data.legalowner,
//         locationOfRegistration: data.locationOfRegistration,
//         companyRegistrationYear: new Date(data.companyRegistrationYear),
//         mainCategory: data.mainCategory,
//         subCategory: data.subCategory,
//         acceptedCurrency: data.acceptedCurrency,
//         acceptedPaymentType: data.acceptedPaymentType,
//         languageSpoken: data.languageSpoken,
//       },
//       companyIntro: {
//         logo: logoUrl,
//         companyDescription: data.companyDescription,
//         companyPhotos: photoUrls,
//         companyVideos: videoUrls,
//       },
//     };

//     // Step 6: Validate with Zod
//     const validatedData = registerCompanySchema.parse(companyData);

//     // Step 7: Save in DB inside transaction
//     const savedCompany = await CompanyDetails.create([validatedData], { session });

//     // Commit
//     await session.commitTransaction();
//     session.endSession();

//     return savedCompany[0];
//   } catch (error) {
//     // Abort on any error
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

export const registerCompanyService = async (data, files) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  // keep track of uploaded Cloudinary files in case rollback is needed
  const uploadedFiles = [];

  try {
    const SellerId = "6870e6e558e2ba32d6b1eb37"; // frontend must send sellerId
    if (!SellerId) throw new Error("SellerId is required");

    // Step 1: Check if company already exists
    const existingCompany = await CompanyDetails.findOne({ SellerId }).session(session);
    if (existingCompany) throw new Error("Company already registered for this seller");

    // Step 2: Parse address safely
    let address = data.address;
    if (typeof address === "string") {
      try {
        address = JSON.parse(address);
      } catch {
        throw new Error("Invalid address format");
      }
    }

    // Step 3: Run Zod validation FIRST
    const validatedInput = await registerCompanySchema.parseAsync({
      SellerId,
      companyBasicInfo: {
        companyName: data.companyName,
        address,
        legalowner: data.legalowner,
        locationOfRegistration: data.locationOfRegistration,
        companyRegistrationYear: data.companyRegistrationYear, // still string here
        mainCategory: data.mainCategory,
        subCategory: data.subCategory,
        acceptedCurrency: data.acceptedCurrency,
        acceptedPaymentType: data.acceptedPaymentType,
        languageSpoken: data.languageSpoken,
      },
      companyIntro: {
        companyDescription: data.companyDescription,
        logo: "", // placeholder
        companyPhotos: [],
        companyVideos: [],
      },
    });

    // Step 4: Upload files AFTER validation
    let logoUrl = "";
    if (files?.logo?.[0]) {
      const result = await uploadOnCloudinary(files.logo[0].path, files.logo[0].mimetype);
      if (!result?.secure_url) throw new Error("Logo upload failed");
      logoUrl = result.secure_url;
      uploadedFiles.push(result.public_id);
    }

    let photoUrls = [];
    for (const file of files?.companyPhotos || []) {
      const result = await uploadOnCloudinary(file.path, file.mimetype);
      if (!result?.secure_url) throw new Error("One of the photos failed to upload");
      photoUrls.push(result.secure_url);
      uploadedFiles.push(result.public_id);
    }

    let videoUrls = [];
    if (files?.companyVideo?.[0]) {
      const result = await uploadOnCloudinary(files.companyVideo[0].path, files.companyVideo[0].mimetype);
      if (!result?.secure_url) throw new Error("Video upload failed");
      videoUrls.push(result.secure_url);
      uploadedFiles.push(result.public_id);
    }

    // Step 5: Convert date AFTER validation
    validatedInput.companyBasicInfo.companyRegistrationYear = new Date(
      validatedInput.companyBasicInfo.companyRegistrationYear
    );

    // Add files
    validatedInput.companyIntro.logo = logoUrl;
    validatedInput.companyIntro.companyPhotos = photoUrls;
    validatedInput.companyIntro.companyVideos = videoUrls;

    // Step 6: Save in DB inside transaction
    const savedCompany = await CompanyDetails.create([validatedInput], { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return savedCompany[0];
  } catch (error) {
    // Abort DB transaction
    await session.abortTransaction();
    session.endSession();

    // Rollback Cloudinary uploads if any
    if (uploadedFiles.length > 0) {
      for (const public_id of uploadedFiles) {
        try {
          await cloudinary.uploader.destroy(public_id);
        } catch (rollbackErr) {
          console.error("Failed to rollback Cloudinary file:", rollbackErr);
        }
      }
    }

    throw error;
  }
};
