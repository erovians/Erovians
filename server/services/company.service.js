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
    console.log("\n🔄 ========== UPDATE COMPANY SERVICE START ==========");
    console.log("📦 sellerId:", sellerId);
    console.log("📂 Files received:", {
      logo: files?.logo?.length || 0,
      photos: files?.companyPhotos?.length || 0,
      video: files?.companyVideo?.length || 0,
      docs: files?.registration_documents?.length || 0,
    });
    console.log("📋 Data received:", {
      companyName: data.companyName,
      company_registration_number: data.company_registration_number,
      legalowner: data.legalowner,
      mainCategory: data.mainCategory,
      subCategory: data.subCategory,
      companyDescription: data.companyDescription,
    });

    if (!sellerId) throw new Error("sellerId is required");

    const existingCompany = await CompanyDetails.findOne({ sellerId }).session(
      session
    );

    if (!existingCompany) {
      console.log("❌ Company not found for sellerId:", sellerId);
      throw new Error("Company not found for this seller");
    }

    console.log("✅ Existing company found:", existingCompany._id);
    console.log("📊 Existing company data:", {
      companyName: existingCompany.companyBasicInfo?.companyName,
      hasLogo: !!existingCompany.companyIntro?.logo,
      photosCount: existingCompany.companyIntro?.companyPhotos?.length || 0,
      videosCount: existingCompany.companyIntro?.companyVideos?.length || 0,
      docsCount:
        existingCompany.companyBasicInfo?.registration_documents?.length || 0,
    });

    // Parse JSON fields
    console.log("\n📝 === Parsing JSON Fields ===");
    const address =
      typeof data.address === "string"
        ? JSON.parse(data.address)
        : data.address;
    console.log("✅ Address parsed:", address);

    const mainCategory =
      typeof data.mainCategory === "string"
        ? JSON.parse(data.mainCategory)
        : data.mainCategory;
    console.log("✅ mainCategory parsed:", mainCategory);

    const subCategory =
      typeof data.subCategory === "string"
        ? JSON.parse(data.subCategory)
        : data.subCategory;
    console.log("✅ subCategory parsed:", subCategory);

    // ========== 1. HANDLE LOGO UPDATE ==========
    console.log("\n🎨 === STEP 1: Logo Update ===");
    let logoUrl = existingCompany.companyIntro?.logo || "";
    console.log("📌 Current logo:", logoUrl);

    if (files?.logo && files.logo[0]) {
      console.log("📤 New logo received:", files.logo[0].originalname);

      // Delete old logo
      if (existingCompany.companyIntro?.logo) {
        console.log("🗑️ Deleting old logo...");
        const oldPublicId = existingCompany.companyIntro.logo
          .split("/")
          .pop()
          .split(".")[0];
        await deleteFromCloudinary(oldPublicId).catch((err) => {
          console.log("⚠️ Old logo delete failed (non-critical):", err.message);
        });
      }

      console.log("📤 Uploading new logo...");
      const res = await uploadOnCloudinary(
        files.logo[0].path,
        files.logo[0].mimetype
      );

      if (!res?.secure_url) {
        console.error("❌ Logo upload failed - no URL returned");
        throw new Error("Logo upload failed");
      }

      uploadedFiles.push(res.public_id);
      logoUrl = res.secure_url;
      console.log("✅ New logo uploaded:", logoUrl);
    } else {
      console.log("ℹ️ No new logo provided, keeping existing");
    }

    // ========== 2. HANDLE PHOTOS UPDATE (APPEND) ==========
    console.log("\n📷 === STEP 2: Photos Update (APPEND) ===");
    let photoUrls = existingCompany.companyIntro?.companyPhotos || [];
    console.log("📌 Existing photos count:", photoUrls.length);

    if (files?.companyPhotos && files.companyPhotos.length > 0) {
      console.log(`📤 Uploading ${files.companyPhotos.length} new photos...`);

      for (let i = 0; i < files.companyPhotos.length; i++) {
        const file = files.companyPhotos[i];
        console.log(`\n📤 Photo ${i + 1}/${files.companyPhotos.length}:`);
        console.log(`  ├─ Original name: ${file.originalname}`);
        console.log(`  ├─ File path: ${file.path}`);
        console.log(`  ├─ File exists: ${fs.existsSync(file.path)}`);

        if (!fs.existsSync(file.path)) {
          console.error(`  ❌ File not found at path: ${file.path}`);
          throw new Error(
            `Photo ${i + 1} file not found: ${file.originalname}`
          );
        }

        try {
          const res = await uploadOnCloudinary(file.path, file.mimetype);

          if (!res || !res.secure_url) {
            console.error(`  ❌ Upload failed for photo ${i + 1}`);
            throw new Error(
              `Photo ${i + 1} upload failed: ${file.originalname}`
            );
          }

          uploadedFiles.push(res.public_id);
          photoUrls.push(res.secure_url);
          console.log(`  ✅ Photo ${i + 1} uploaded: ${res.secure_url}`);
        } catch (uploadError) {
          console.error(`  ❌ Photo ${i + 1} upload error:`, uploadError);
          throw uploadError;
        }
      }
      console.log(`✅ Total photos now: ${photoUrls.length}`);
    } else {
      console.log("ℹ️ No new photos provided");
    }

    // ========== 3. HANDLE VIDEO UPDATE (REPLACE) ==========
    console.log("\n🎥 === STEP 3: Video Update (REPLACE) ===");
    let videoUrls = existingCompany.companyIntro?.companyVideos || [];
    console.log("📌 Existing videos count:", videoUrls.length);

    if (files?.companyVideo && files.companyVideo[0]) {
      console.log("📤 New video received:", files.companyVideo[0].originalname);

      // Delete old videos
      if (existingCompany.companyIntro?.companyVideos?.length > 0) {
        console.log(
          `🗑️ Deleting ${existingCompany.companyIntro.companyVideos.length} old videos...`
        );
        await Promise.all(
          existingCompany.companyIntro.companyVideos.map((url) => {
            const publicId = url.split("/").pop().split(".")[0];
            return deleteFromCloudinary(publicId).catch((err) => {
              console.log(
                "⚠️ Old video delete failed (non-critical):",
                err.message
              );
            });
          })
        );
      }

      console.log("📤 Uploading new video...");
      const res = await uploadOnCloudinary(
        files.companyVideo[0].path,
        files.companyVideo[0].mimetype
      );

      if (!res?.secure_url) {
        console.error("❌ Video upload failed - no URL returned");
        throw new Error("Video upload failed");
      }

      uploadedFiles.push(res.public_id);
      videoUrls = [res.secure_url];
      console.log("✅ New video uploaded:", res.secure_url);
    } else {
      console.log("ℹ️ No new video provided, keeping existing");
    }

    // ========== 4. HANDLE REGISTRATION DOCUMENTS (APPEND) ==========
    console.log("\n📄 === STEP 4: Registration Documents (APPEND) ===");
    let docUrls =
      existingCompany.companyBasicInfo?.registration_documents || [];
    console.log("📌 Existing docs count:", docUrls.length);

    if (
      files?.registration_documents &&
      files.registration_documents.length > 0
    ) {
      console.log(
        `📤 Uploading ${files.registration_documents.length} new documents...`
      );

      for (let i = 0; i < files.registration_documents.length; i++) {
        const file = files.registration_documents[i];
        console.log(
          `\n📤 Document ${i + 1}/${files.registration_documents.length}:`
        );
        console.log(`  ├─ Original name: ${file.originalname}`);
        console.log(`  ├─ File path: ${file.path}`);
        console.log(`  ├─ File exists: ${fs.existsSync(file.path)}`);

        try {
          if (!fs.existsSync(file.path)) {
            console.error(`  ❌ File not found at path: ${file.path}`);
            throw new Error(`File not found at path: ${file.path}`);
          }

          const res = await uploadOnCloudinary(file.path, file.mimetype);

          if (!res || !res.secure_url) {
            console.error(`  ❌ Cloudinary returned no URL`);
            throw new Error(
              `Cloudinary returned no URL for ${file.originalname}`
            );
          }

          uploadedFiles.push(res.public_id);
          docUrls.push(res.secure_url);
          console.log(`  ✅ Document ${i + 1} uploaded: ${res.secure_url}`);
        } catch (uploadError) {
          console.error(`  ❌ Document ${i + 1} upload error:`, uploadError);
          throw new Error(
            `Document ${i + 1} (${file.originalname}) upload failed: ${
              uploadError.message
            }`
          );
        }
      }
      console.log(`✅ Total docs now: ${docUrls.length}`);
    } else {
      console.log("ℹ️ No new documents provided");
    }

    // ========== 5. BUILD UPDATE OBJECT ==========
    console.log("\n🏗️ === STEP 5: Building Update Object ===");

    const updateData = {
      companyBasicInfo: {
        // ✅ REQUIRED FIELDS - Direct assign
        companyName:
          data.companyName || existingCompany.companyBasicInfo?.companyName,
        company_registration_number:
          data.company_registration_number ||
          existingCompany.companyBasicInfo?.company_registration_number,
        legalowner:
          data.legalowner || existingCompany.companyBasicInfo?.legalowner,
        locationOfRegistration:
          data.locationOfRegistration ||
          existingCompany.companyBasicInfo?.locationOfRegistration,
        companyRegistrationYear:
          data.companyRegistrationYear ||
          existingCompany.companyBasicInfo?.companyRegistrationYear,
        address: address || existingCompany.companyBasicInfo?.address,

        // ✅ ARRAYS - Direct assign (override)
        mainCategory:
          mainCategory || existingCompany.companyBasicInfo?.mainCategory || [],
        subCategory:
          subCategory || existingCompany.companyBasicInfo?.subCategory || [],
        acceptedCurrency: data.acceptedCurrency
          ? data.acceptedCurrency.split(",").map((c) => c.trim())
          : existingCompany.companyBasicInfo?.acceptedCurrency || [],
        acceptedPaymentType: data.acceptedPaymentType
          ? data.acceptedPaymentType.split(",").map((p) => p.trim())
          : existingCompany.companyBasicInfo?.acceptedPaymentType || [],
        languageSpoken: data.languageSpoken
          ? data.languageSpoken.split(",").map((l) => l.trim())
          : existingCompany.companyBasicInfo?.languageSpoken || ["English"],

        // ✅ DOCUMENTS - Already prepared (append)
        registration_documents: docUrls,

        // ✅ OPTIONAL FIELDS - Use existing if not provided
        totalEmployees: data.totalEmployees
          ? parseInt(data.totalEmployees)
          : existingCompany.companyBasicInfo?.totalEmployees,
        businessType:
          data.businessType || existingCompany.companyBasicInfo?.businessType,
        factorySize:
          data.factorySize || existingCompany.companyBasicInfo?.factorySize,
        factoryCountryOrRegion:
          data.factoryCountryOrRegion ||
          existingCompany.companyBasicInfo?.factoryCountryOrRegion,
        contractManufacturing:
          data.contractManufacturing !== undefined
            ? data.contractManufacturing === "true" ||
              data.contractManufacturing === true
            : existingCompany.companyBasicInfo?.contractManufacturing || false,
        numberOfProductionLines: data.numberOfProductionLines
          ? parseInt(data.numberOfProductionLines)
          : existingCompany.companyBasicInfo?.numberOfProductionLines,
        annualOutputValue:
          data.annualOutputValue ||
          existingCompany.companyBasicInfo?.annualOutputValue,
        rdTeamSize: data.rdTeamSize
          ? parseInt(data.rdTeamSize)
          : existingCompany.companyBasicInfo?.rdTeamSize,
        tradeCapabilities: data.tradeCapabilities
          ? data.tradeCapabilities.split(",").map((t) => t.trim())
          : existingCompany.companyBasicInfo?.tradeCapabilities || [],
      },
      companyIntro: {
        companyDescription:
          data.companyDescription ||
          existingCompany.companyIntro?.companyDescription,
        logo: logoUrl,
        companyPhotos: photoUrls,
        companyVideos: videoUrls,
      },
    };

    console.log("📋 Update object built:");
    console.log("  ├─ companyName:", updateData.companyBasicInfo.companyName);
    console.log("  ├─ mainCategory:", updateData.companyBasicInfo.mainCategory);
    console.log("  ├─ subCategory:", updateData.companyBasicInfo.subCategory);
    console.log(
      "  ├─ acceptedCurrency:",
      updateData.companyBasicInfo.acceptedCurrency
    );
    console.log(
      "  ├─ acceptedPaymentType:",
      updateData.companyBasicInfo.acceptedPaymentType
    );
    console.log(
      "  ├─ languageSpoken:",
      updateData.companyBasicInfo.languageSpoken
    );
    console.log("  ├─ logo:", !!updateData.companyIntro.logo);
    console.log(
      "  ├─ photos count:",
      updateData.companyIntro.companyPhotos.length
    );
    console.log(
      "  ├─ videos count:",
      updateData.companyIntro.companyVideos.length
    );
    console.log(
      "  └─ docs count:",
      updateData.companyBasicInfo.registration_documents.length
    );

    // ========== 6. UPDATE DATABASE ==========
    console.log("\n💾 === STEP 6: Updating Database ===");
    const updatedCompany = await CompanyDetails.findOneAndUpdate(
      { sellerId },
      { $set: updateData },
      { new: true, session, runValidators: true }
    );

    if (!updatedCompany) {
      console.error("❌ Database update returned null");
      throw new Error("Failed to update company in database");
    }

    console.log("✅ Database updated successfully");
    console.log("📊 Updated company ID:", updatedCompany._id);

    await session.commitTransaction();
    session.endSession();

    console.log("✅ Transaction committed");
    console.log("✅ ========== UPDATE COMPANY SERVICE SUCCESS ==========\n");

    return updatedCompany;
  } catch (error) {
    console.error("\n❌ ========== UPDATE COMPANY SERVICE FAILED ==========");
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);

    await session.abortTransaction();
    session.endSession();
    console.log("🔄 Transaction aborted");

    // Cleanup newly uploaded files
    console.log("\n🗑️ === Rolling Back Uploaded Files ===");
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
