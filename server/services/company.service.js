import mongoose from "mongoose";
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

    // ✅ Upload logo
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
    const photoUrls = await Promise.all(
      (files?.companyPhotos || []).map(async (file, index) => {
        const res = await uploadOnCloudinary(file.path, file.mimetype);
        if (!res?.secure_url) {
          throw new Error(`Photo ${index + 1} upload failed`);
        }
        uploadedFiles.push(res.public_id);
        return res.secure_url;
      })
    );

    // ✅ Upload video
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

    // ✅ Upload registration documents
    const docUrls = await Promise.all(
      (files?.registration_documents || []).map(async (file, index) => {
        const res = await uploadOnCloudinary(file.path, file.mimetype);
        if (!res?.secure_url) {
          throw new Error(`Document ${index + 1} upload failed`);
        }
        uploadedFiles.push(res.public_id);
        return res.secure_url;
      })
    );

    // ✅ Build company object
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

    // ✅ Save
    const [savedCompany] = await CompanyDetails.create([companyData], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return savedCompany;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Cleanup uploaded files
    await Promise.all(
      uploadedFiles.map((id) => deleteFromCloudinary(id).catch(() => {}))
    );

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
      const newPhotos = await Promise.all(
        files.companyPhotos.map(async (file, index) => {
          const res = await uploadOnCloudinary(file.path, file.mimetype);
          if (!res?.secure_url) {
            throw new Error(`Photo ${index + 1} upload failed`);
          }
          uploadedFiles.push(res.public_id);
          return res.secure_url;
        })
      );
      photoUrls = [...photoUrls, ...newPhotos];
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

    // ✅ Handle registration documents (APPEND)
    let docUrls =
      existingCompany.companyBasicInfo?.registration_documents || [];
    if (
      files?.registration_documents &&
      files.registration_documents.length > 0
    ) {
      const newDocs = await Promise.all(
        files.registration_documents.map(async (file, index) => {
          const res = await uploadOnCloudinary(file.path, file.mimetype);
          if (!res?.secure_url) {
            throw new Error(`Document ${index + 1} upload failed`);
          }
          uploadedFiles.push(res.public_id);
          return res.secure_url;
        })
      );
      docUrls = [...docUrls, ...newDocs];
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

    if (!result.length) throw new Error("Company not found");

    return result[0];
  } catch (err) {
    throw err;
  }
};
