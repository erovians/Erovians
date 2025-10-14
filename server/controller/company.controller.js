// import { registerCompanyService, getCompanyDetailsService } from "../services/company.service.js";

// export const registerCompany = async (req, res) => {
//   try {
//     const savedCompany = await registerCompanyService(req.body, req.files);
//     res.status(201).json({
//       success: true,
//       message: "Company registered successfully.",
//       company: savedCompany,
//     });
//   } catch (error) {
//     console.error("Error registering company:", error);

//     // Zod validation errors
//     if (error.name === "ZodError") {
//       return res.status(400).json({ success: false, errors: error.errors });
//     }

//     res.status(400).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };

// export const getCompanyDetails = async (req, res) => {
//   try {
//     const sellerId = req.params.sellerId; // or from req.user if you have auth
//     const { company, products } = await getCompanyDetailsService(sellerId);

//     console.log(products);

//     res.status(200).json({
//       success: true,
//       company,
//       products
//     });
//   } catch (error) {
//     console.error("Error fetching company details:", error);
//     res.status(404).json({
//       success: false,
//       message: error.message || "Company not found",
//     });
//   }
// };

import {
  registerCompanyService,
  getCompanyDetailsService,
} from "../services/company.service.js";

import Certificate from "../models/certificate.model.js";

export const registerCompany = async (req, res) => {
  try {
    console.log("RegisterCompany Request Body:", req.body);
    const company = await registerCompanyService(req.body, req.files);
    return res.status(201).json({
      success: true,
      message: "Company registered successfully.",
      company,
    });
  } catch (error) {
    console.error("RegisterCompany Error:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.errors,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getCompanyDetails = async (req, res) => {
  try {
    // const sellerId = req.user._id; // safe, from auth middleware

    const sellerId = "6870e6e558e2ba32d6b1eb33";

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "SellerId is required",
      });
    }

    const companyData = await getCompanyDetailsService(sellerId);

    return res.status(200).json({
      success: true,
      company: companyData, // includes all company fields + products array
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message || "Company not found",
    });
  }
};

