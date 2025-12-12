import {
  registerCompanyService,
  getCompanyDetailsService,
} from "../services/company.service.js";
import CompanyDetails from "../models/company.model.js";
import { cache } from "../services/cache.service.js";

export const registerCompany = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    // console.log("RegisterCompany Request Body:", req.body);
    const company = await registerCompanyService(req.body, req.files, sellerId);
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

// export const getCompanyDetails = async (req, res) => {
//   try {
//     let sellerId;
//     let companyId;

//     if (req.user.role === "seller") {
//       // Seller can only see their own company
//       sellerId = req.user.userId;
//       if (!sellerId) {
//         return res.status(400).json({
//           success: false,
//           message: "SellerId is required",
//         });
//       }
//       // ✅ Automatically fetch companyId for this seller
//       const company = await CompanyDetails.findOne({ sellerId }).select("_id");
//       if (!company) {
//         return res.status(404).json({
//           success: false,
//           message: "Company not found for this seller",
//         });
//       }
//       companyId = company._id;
//     } else if (req.user.role === "buyer" || req.user.role === "admin") {
//       // Buyer/Admin can pass either sellerId or companyId in query
//       sellerId = req.query.sellerId;
//       companyId = req.query.companyId;

//       if (!sellerId && !companyId) {
//         return res.status(400).json({
//           success: false,
//           message: "sellerId or companyId is required",
//         });
//       }
//     }

//     const companyData = await getCompanyDetailsService({ sellerId, companyId });

//     return res.status(200).json({
//       success: true,
//       company: companyData, // includes all company fields + products array
//     });
//   } catch (error) {
//     return res.status(404).json({
//       success: false,
//       message: error.message || "Company not found",
//     });
//   }
// };

export const getCompanyDetails = async (req, res) => {
  try {
    let sellerId;
    let companyId;

    if (req.user.role === "seller") {
      sellerId = req.user.userId;

      const company = await CompanyDetails.findOne({ sellerId }).select("_id");
      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found for this seller",
        });
      }

      companyId = company._id;
    } else {
      sellerId = req.query.sellerId;
      companyId = req.query.companyId;

      if (!sellerId && !companyId) {
        return res.status(400).json({
          success: false,
          message: "sellerId or companyId is required",
        });
      }
    }

    const cacheKey = `company:${companyId}`;

    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        company: cached,
      });
    }

    const companyData = await getCompanyDetailsService({ sellerId, companyId });

    if (!companyData) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    await cache.set(cacheKey, companyData, 3600);

    return res.status(200).json({
      success: true,
      fromCache: false,
      company: companyData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
