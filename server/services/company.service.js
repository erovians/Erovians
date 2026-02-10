import mongoose from "mongoose";
import fs from "fs";
import CompanyDetails from "../models/company.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.utils.js";

// ======================== REGISTER COMPANY ========================
export const registerCompanyService = async (data, files, sellerId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const uploadedFiles = [];

  try {
    console.log("\n🚀 ========== REGISTER COMPANY SERVICE START ==========");
    console.log("📦 sellerId:", sellerId);
    console.log("📂 Files received:", {
      logo: files?.logo?.length || 0,
      photos: files?.companyPhotos?.length || 0,
      video: files?.companyVideo?.length || 0,
      docs: files?.registration_documents?.length || 0,
    });

    if (!sellerId) throw new Error("sellerId is required");

    const existingCompany = await CompanyDetails.findOne({ sellerId })
      .session(session)
      .lean();

    if (existingCompany)
      throw new Error("Company already registered for this seller");

    // Parse JSON fields
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

    // ========== 1. UPLOAD REGISTRATION DOCUMENTS ==========
    console.log("\n📄 === STEP 1: Registration Documents ===");
    const docUrls = [];
    if (
      files?.registration_documents &&
      files.registration_documents.length > 0
    ) {
      console.log(
        `📄 Total documents to upload: ${files.registration_documents.length}`
      );

      for (let i = 0; i < files.registration_documents.length; i++) {
        const file = files.registration_documents[i];

        console.log(
          `\n📤 Document ${i + 1}/${files.registration_documents.length}:`
        );
        console.log(`  ├─ Original name: ${file.originalname}`);
        console.log(`  ├─ Field name: ${file.fieldname}`);
        console.log(`  ├─ File path: ${file.path}`);
        console.log(`  ├─ File size: ${file.size} bytes`);
        console.log(`  ├─ Mimetype: ${file.mimetype}`);
        console.log(`  ├─ File exists: ${fs.existsSync(file.path)}`);

        try {
          const res = await uploadOnCloudinary(file.path, file.mimetype);

          if (!res) {
            console.error(
              `  ❌ Cloudinary returned NULL for document ${i + 1}`
            );
            throw new Error(`Document ${i + 1} upload returned null`);
          }

          if (!res.secure_url) {
            console.error(
              `  ❌ Cloudinary returned no URL for document ${i + 1}`
            );
            console.error(`  Response:`, JSON.stringify(res, null, 2));
            throw new Error(`Document ${i + 1} upload failed - no URL`);
          }

          uploadedFiles.push(res.public_id);
          docUrls.push(res.secure_url);

          console.log(`  ✅ Document ${i + 1} uploaded successfully`);
          console.log(`  └─ URL: ${res.secure_url}`);
        } catch (uploadError) {
          console.error(`  ❌ Document ${i + 1} upload error:`, uploadError);
          throw new Error(
            `Document ${i + 1} (${file.originalname}) upload failed: ${
              uploadError.message
            }`
          );
        }
      }
      console.log(`✅ All ${docUrls.length} documents uploaded`);
    } else {
      console.log("⚠️ No registration documents provided");
    }

    // ========== 2. UPLOAD LOGO ==========
    console.log("\n🎨 === STEP 2: Logo ===");
    let logoUrl = "";
    if (files?.logo && files.logo[0]) {
      const file = files.logo[0];
      console.log(`📤 Logo upload:`);
      console.log(`  ├─ Original name: ${file.originalname}`);
      console.log(`  ├─ File path: ${file.path}`);
      console.log(`  ├─ File size: ${file.size} bytes`);
      console.log(`  ├─ Mimetype: ${file.mimetype}`);
      console.log(`  ├─ File exists: ${fs.existsSync(file.path)}`);

      try {
        const res = await uploadOnCloudinary(file.path, file.mimetype);

        if (!res) {
          console.error(`  ❌ Cloudinary returned NULL for logo`);
          throw new Error("Logo upload returned null");
        }

        if (!res.secure_url) {
          console.error(`  ❌ Cloudinary returned no URL for logo`);
          console.error(`  Response:`, JSON.stringify(res, null, 2));
          throw new Error("Logo upload failed - no URL");
        }

        uploadedFiles.push(res.public_id);
        logoUrl = res.secure_url;
        console.log(`  ✅ Logo uploaded successfully`);
        console.log(`  └─ URL: ${logoUrl}`);
      } catch (uploadError) {
        console.error(`  ❌ Logo upload error:`, uploadError);
        throw new Error(`Logo upload failed: ${uploadError.message}`);
      }
    } else {
      console.log("⚠️ No logo provided");
    }

    // ========== 3. UPLOAD PHOTOS ==========
    console.log("\n📷 === STEP 3: Company Photos ===");
    const photoUrls = [];
    if (files?.companyPhotos && files.companyPhotos.length > 0) {
      console.log(`📷 Total photos to upload: ${files.companyPhotos.length}`);

      for (let i = 0; i < files.companyPhotos.length; i++) {
        const file = files.companyPhotos[i];

        console.log(`\n📤 Photo ${i + 1}/${files.companyPhotos.length}:`);
        console.log(`  ├─ Original name: ${file.originalname}`);
        console.log(`  ├─ Field name: ${file.fieldname}`);
        console.log(`  ├─ File path: ${file.path}`);
        console.log(`  ├─ File size: ${file.size} bytes`);
        console.log(`  ├─ Mimetype: ${file.mimetype}`);
        console.log(`  ├─ File exists: ${fs.existsSync(file.path)}`);

        try {
          const res = await uploadOnCloudinary(file.path, file.mimetype);

          if (!res) {
            console.error(`  ❌ Cloudinary returned NULL for photo ${i + 1}`);
            throw new Error(`Photo ${i + 1} upload returned null`);
          }

          if (!res.secure_url) {
            console.error(`  ❌ Cloudinary returned no URL for photo ${i + 1}`);
            console.error(`  Response:`, JSON.stringify(res, null, 2));
            throw new Error(`Photo ${i + 1} upload failed - no URL`);
          }

          uploadedFiles.push(res.public_id);
          photoUrls.push(res.secure_url);

          console.log(`  ✅ Photo ${i + 1} uploaded successfully`);
          console.log(`  └─ URL: ${res.secure_url}`);
        } catch (uploadError) {
          console.error(`  ❌ Photo ${i + 1} upload error:`, uploadError);
          throw new Error(
            `Photo ${i + 1} (${file.originalname}) upload failed: ${
              uploadError.message
            }`
          );
        }
      }
      console.log(`✅ All ${photoUrls.length} photos uploaded`);
    } else {
      console.log("⚠️ No photos provided");
    }

    // ========== 4. UPLOAD VIDEO ==========
    console.log("\n🎥 === STEP 4: Company Video ===");
    const videoUrls = [];
    if (files?.companyVideo && files.companyVideo[0]) {
      const file = files.companyVideo[0];
      console.log(`📤 Video upload:`);
      console.log(`  ├─ Original name: ${file.originalname}`);
      console.log(`  ├─ File path: ${file.path}`);
      console.log(`  ├─ File size: ${file.size} bytes`);
      console.log(`  ├─ Mimetype: ${file.mimetype}`);
      console.log(`  ├─ File exists: ${fs.existsSync(file.path)}`);

      try {
        const res = await uploadOnCloudinary(file.path, file.mimetype);

        if (!res) {
          console.error(`  ❌ Cloudinary returned NULL for video`);
          throw new Error("Video upload returned null");
        }

        if (!res.secure_url) {
          console.error(`  ❌ Cloudinary returned no URL for video`);
          console.error(`  Response:`, JSON.stringify(res, null, 2));
          throw new Error("Video upload failed - no URL");
        }

        uploadedFiles.push(res.public_id);
        videoUrls.push(res.secure_url);
        console.log(`  ✅ Video uploaded successfully`);
        console.log(`  └─ URL: ${res.secure_url}`);
      } catch (uploadError) {
        console.error(`  ❌ Video upload error:`, uploadError);
        throw new Error(`Video upload failed: ${uploadError.message}`);
      }
    } else {
      console.log("⚠️ No video provided");
    }

    // ========== 5. BUILD COMPANY DATA ==========
    console.log("\n🏗️ === STEP 5: Building Company Data ===");
    const companyData = {
      sellerId,
      companyBasicInfo: {
        companyName: data.companyName,
        company_registration_number: data.company_registration_number,
        address,
        legalowner: data.legalowner,
        locationOfRegistration: data.locationOfRegistration,
        companyRegistrationYear: data.companyRegistrationYear,
        mainCategory,
        subCategory,
        acceptedCurrency: data.acceptedCurrency?.split(",") || [],
        acceptedPaymentType: data.acceptedPaymentType?.split(",") || [],
        languageSpoken: data.languageSpoken?.split(",") || [],
        registration_documents: docUrls,

        // Optional fields
        ...(data.totalEmployees && {
          totalEmployees: parseInt(data.totalEmployees),
        }),
        ...(data.businessType && { businessType: data.businessType }),
        ...(data.factorySize && { factorySize: data.factorySize }),
        ...(data.factoryCountryOrRegion && {
          factoryCountryOrRegion: data.factoryCountryOrRegion,
        }),
        ...(data.contractManufacturing !== undefined && {
          contractManufacturing:
            data.contractManufacturing === "true" ||
            data.contractManufacturing === true,
        }),
        ...(data.numberOfProductionLines && {
          numberOfProductionLines: parseInt(data.numberOfProductionLines),
        }),
        ...(data.annualOutputValue && {
          annualOutputValue: data.annualOutputValue,
        }),
        ...(data.rdTeamSize && { rdTeamSize: parseInt(data.rdTeamSize) }),
        ...(data.tradeCapabilities && {
          tradeCapabilities: data.tradeCapabilities?.split(",") || [],
        }),
      },
      companyIntro: {
        companyDescription: data.companyDescription,
        logo: logoUrl,
        companyPhotos: photoUrls,
        companyVideos: videoUrls,
      },
    };

    console.log("📋 Company data structure built");
    console.log(`  ├─ Logo: ${logoUrl ? "✅" : "❌"}`);
    console.log(`  ├─ Photos: ${photoUrls.length} uploaded`);
    console.log(`  ├─ Videos: ${videoUrls.length} uploaded`);
    console.log(`  └─ Docs: ${docUrls.length} uploaded`);

    // ========== 6. SAVE TO DATABASE ==========
    console.log("\n💾 === STEP 6: Saving to Database ===");
    const [savedCompany] = await CompanyDetails.create([companyData], {
      session,
    });

    console.log("✅ Company saved to database");
    console.log(`  └─ Company ID: ${savedCompany._id}`);

    await session.commitTransaction();
    session.endSession();

    console.log(
      "\n✅ ========== REGISTER COMPANY SERVICE SUCCESS ==========\n"
    );

    return savedCompany;
  } catch (error) {
    console.error("\n❌ ========== REGISTER COMPANY SERVICE FAILED ==========");
    console.error("❌ Error:", error.message);
    console.error("❌ Stack:", error.stack);

    await session.abortTransaction();
    session.endSession();

    // Cleanup uploaded files
    console.log("\n🗑️ Rolling back - deleting uploaded files...");
    console.log(`🗑️ Files to delete: ${uploadedFiles.length}`);

    await Promise.all(
      uploadedFiles.map((id, index) => {
        console.log(
          `  🗑️ Deleting ${index + 1}/${uploadedFiles.length}: ${id}`
        );
        return deleteFromCloudinary(id).catch((err) => {
          console.error(`  ❌ Failed to delete ${id}:`, err.message);
        });
      })
    );

    console.log("❌ ========== ROLLBACK COMPLETE ==========\n");

    throw error;
  }
};

// ======================== UPDATE COMPANY ========================
export const updateCompanyService = async (data, files, sellerId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const uploadedFiles = [];

  try {
    if (!sellerId) throw new Error("sellerId is required");

    const existingCompany = await CompanyDetails.findOne({ sellerId }).session(
      session
    );

    if (!existingCompany) {
      throw new Error("Company not found for this seller");
    }

    // Parse JSON fields
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

    // ✅ Handle logo update
    let logoUrl = existingCompany.companyIntro?.logo || "";
    if (files?.logo && files.logo[0]) {
      // Delete old logo
      if (existingCompany.companyIntro?.logo) {
        const oldPublicId = existingCompany.companyIntro.logo
          .split("/")
          .pop()
          .split(".")[0];
        await deleteFromCloudinary(oldPublicId).catch(() => {});
      }

      const res = await uploadOnCloudinary(
        files.logo[0].path,
        files.logo[0].mimetype
      );
      if (!res?.secure_url) throw new Error("Logo upload failed");
      uploadedFiles.push(res.public_id);
      logoUrl = res.secure_url;
    }

    // ✅ Handle photos update (APPEND)
    let photoUrls = existingCompany.companyIntro?.companyPhotos || [];
    if (files?.companyPhotos && files.companyPhotos.length > 0) {
      console.log(`📷 Uploading ${files.companyPhotos.length} photos...`);

      for (let i = 0; i < files.companyPhotos.length; i++) {
        const file = files.companyPhotos[i];

        if (!fs.existsSync(file.path)) {
          throw new Error(
            `Photo ${i + 1} file not found: ${file.originalname}`
          );
        }

        const res = await uploadOnCloudinary(file.path, file.mimetype);

        if (!res || !res.secure_url) {
          throw new Error(`Photo ${i + 1} upload failed: ${file.originalname}`);
        }

        uploadedFiles.push(res.public_id);
        photoUrls.push(res.secure_url);
      }
    }

    // ✅ Handle video update (REPLACE)
    let videoUrls = existingCompany.companyIntro?.companyVideos || [];
    if (files?.companyVideo && files.companyVideo[0]) {
      // Delete old videos
      if (existingCompany.companyIntro?.companyVideos?.length > 0) {
        await Promise.all(
          existingCompany.companyIntro.companyVideos.map((url) => {
            const publicId = url.split("/").pop().split(".")[0];
            return deleteFromCloudinary(publicId).catch(() => {});
          })
        );
      }

      const res = await uploadOnCloudinary(
        files.companyVideo[0].path,
        files.companyVideo[0].mimetype
      );
      if (!res?.secure_url) throw new Error("Video upload failed");
      uploadedFiles.push(res.public_id);
      videoUrls = [res.secure_url];
    }

    // ✅ Handle registration documents (APPEND) - SEQUENTIAL UPLOAD
    let docUrls =
      existingCompany.companyBasicInfo?.registration_documents || [];

    if (
      files?.registration_documents &&
      files.registration_documents.length > 0
    ) {
      console.log(
        `📄 Uploading ${files.registration_documents.length} registration documents...`
      );

      for (let i = 0; i < files.registration_documents.length; i++) {
        const file = files.registration_documents[i];

        try {
          console.log(
            `📤 Uploading document ${i + 1}/${
              files.registration_documents.length
            }: ${file.originalname}`
          );
          console.log(`📂 File path: ${file.path}`);
          console.log(`📋 File exists: ${fs.existsSync(file.path)}`);

          // ✅ Verify file exists
          if (!fs.existsSync(file.path)) {
            throw new Error(`File not found at path: ${file.path}`);
          }

          const res = await uploadOnCloudinary(file.path, file.mimetype);

          if (!res || !res.secure_url) {
            throw new Error(
              `Cloudinary returned no URL for ${file.originalname}`
            );
          }

          uploadedFiles.push(res.public_id);
          docUrls.push(res.secure_url);

          console.log(
            `✅ Document ${i + 1} uploaded successfully: ${res.secure_url}`
          );
        } catch (uploadError) {
          console.error(`❌ Error uploading document ${i + 1}:`, uploadError);
          throw new Error(
            `Document ${i + 1} (${file.originalname}) upload failed: ${
              uploadError.message
            }`
          );
        }
      }

      console.log(`✅ All ${docUrls.length} documents uploaded successfully`);
    }

    // ✅ Build update object
    const updateData = {
      companyBasicInfo: {
        ...existingCompany.companyBasicInfo,
        ...(data.companyName && { companyName: data.companyName }),
        ...(data.company_registration_number && {
          company_registration_number: data.company_registration_number,
        }),
        ...(address && { address }),
        ...(data.legalowner && { legalowner: data.legalowner }),
        ...(data.locationOfRegistration && {
          locationOfRegistration: data.locationOfRegistration,
        }),
        ...(data.companyRegistrationYear && {
          companyRegistrationYear: data.companyRegistrationYear,
        }),
        ...(mainCategory && { mainCategory }),
        ...(subCategory && { subCategory }),
        ...(data.acceptedCurrency && {
          acceptedCurrency: data.acceptedCurrency.split(","),
        }),
        ...(data.acceptedPaymentType && {
          acceptedPaymentType: data.acceptedPaymentType.split(","),
        }),
        ...(data.languageSpoken && {
          languageSpoken: data.languageSpoken.split(","),
        }),
        registration_documents: docUrls,

        // Optional fields
        ...(data.totalEmployees && {
          totalEmployees: parseInt(data.totalEmployees),
        }),
        ...(data.businessType && { businessType: data.businessType }),
        ...(data.factorySize && { factorySize: data.factorySize }),
        ...(data.factoryCountryOrRegion && {
          factoryCountryOrRegion: data.factoryCountryOrRegion,
        }),
        ...(data.contractManufacturing !== undefined && {
          contractManufacturing:
            data.contractManufacturing === "true" ||
            data.contractManufacturing === true,
        }),
        ...(data.numberOfProductionLines && {
          numberOfProductionLines: parseInt(data.numberOfProductionLines),
        }),
        ...(data.annualOutputValue && {
          annualOutputValue: data.annualOutputValue,
        }),
        ...(data.rdTeamSize && { rdTeamSize: parseInt(data.rdTeamSize) }),
        ...(data.tradeCapabilities && {
          tradeCapabilities: data.tradeCapabilities.split(","),
        }),
      },
      companyIntro: {
        ...(data.companyDescription && {
          companyDescription: data.companyDescription,
        }),
        logo: logoUrl,
        companyPhotos: photoUrls,
        companyVideos: videoUrls,
      },
    };

    // ✅ Update
    const updatedCompany = await CompanyDetails.findOneAndUpdate(
      { sellerId },
      { $set: updateData },
      { new: true, session, runValidators: true }
    );

    await session.commitTransaction();
    session.endSession();

    return updatedCompany;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Cleanup newly uploaded files
    console.log("🗑️ Rolling back - deleting uploaded files...");
    await Promise.all(
      uploadedFiles.map((id) => deleteFromCloudinary(id).catch(() => {}))
    );

    throw error;
  }
};

// ======================== GET COMPANY ========================
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

    if (!result.length) return null;

    return result[0];
  } catch (err) {
    throw err;
  }
};
