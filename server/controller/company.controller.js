// import CompanyDetails from "../models/company.model.js";
// import Seller from "../models/sellerSingnup.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinaryUpload.utils.js";

// export const registerCompany = async (req, res) => {
//   console.log("REQ.BODY:");
//   try {
//     const  sellerId  = "6870e6e558e2ba32d6b1eb36"; // frontend must send sellerId with form data

//     // Step 1: Validate seller exists
//     // const seller = await Seller.findById(sellerId);
//     // if (!seller) {
//     //   return res
//     //     .status(404)
//     //     .json({ success: false, message: "Seller not found" });
//     // }

//     // // Step 2: Check if company already exists for this seller
//     // const existingCompany = await CompanyDetails.findOne({
//     //   SellerId: seller._id,
//     // });
//     // if (existingCompany) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Company already registered for this seller",
//     //   });
//     // }
//     // Get files from multer
//     const logoFile = req.files?.logo?.[0];
//     const photoFiles = req.files?.companyPhotos || [];
//     const videoFile = req.files?.companyVideo?.[0];

//     // Upload logo
//     let logoUrl = "";
//     if (logoFile) {
//       const result = await uploadOnCloudinary(logoFile.path, logoFile.mimetype);
//       logoUrl = result?.secure_url || "";
//     }

//     // Upload photos
//     let photoUrls = [];
//     for (const file of photoFiles) {
//       const result = await uploadOnCloudinary(file.path, file.mimetype);
//       if (result?.secure_url) photoUrls.push(result.secure_url);
//     }

//     // Upload video
//     let videoUrl = "";
//     if (videoFile) {
//       const result = await uploadOnCloudinary(
//         videoFile.path,
//         videoFile.mimetype
//       );
//       videoUrl = result?.secure_url || "";
//     }

//     // Parse address safely
//     let address = req.body.address;
//     if (typeof address === "string") {
//       try {
//         address = JSON.parse(address);
//       } catch {
//         return res.status(400).json({ message: "Invalid address format" });
//       }
//     }

//     // Save to DB
//     const companyDoc = new CompanyDetails({
//       SellerId: sellerId,
//       companyBasicInfo: {
//         companyName: req.body.companyName,
//         address,
//         legalowner: req.body.legalowner,
//         locationOfRegistration: req.body.locationOfRegistration,
//         companyRegistrationYear: new Date(req.body.companyRegistrationYear),
//         mainCategory: req.body.mainCategory,
//         subCategory: req.body.subCategory,
//         acceptedCurrency: req.body.acceptedCurrency,
//         acceptedPaymentType: req.body.acceptedPaymentType,
//         languageSpoken: req.body.languageSpoken,
//       },
//       companyIntro: {
//         logo: logoUrl,
//         companyDescription: req.body.companyDescription,
//         companyPhotos: photoUrls,
//         companyVideos: [videoUrl].filter(Boolean),
//       },
//     });

//     const savedCompany = await companyDoc.save();

//     res.status(201).json({
//       success: true,
//       message: "Company registered successfully.",
//       company: savedCompany,
//     });
//   } catch (error) {
//     console.error("Error registering company:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

import { registerCompanyService, getCompanyDetailsService } from "../services/company.service.js";

export const registerCompany = async (req, res) => {
  try {
    const savedCompany = await registerCompanyService(req.body, req.files);
    res.status(201).json({
      success: true,
      message: "Company registered successfully.",
      company: savedCompany,
    });
  } catch (error) {
    console.error("Error registering company:", error);

    // Zod validation errors
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, errors: error.errors });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export const getCompanyDetails = async (req, res) => {
  try {
    const sellerId = req.params.sellerId; // or from req.user if you have auth
    const company = await getCompanyDetailsService(sellerId);

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Error fetching company details:", error);
    res.status(404).json({
      success: false,
      message: error.message || "Company not found",
    });
  }
};
