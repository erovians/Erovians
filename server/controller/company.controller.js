import {
  registerCompanyService,
  getCompanyDetailsService,
} from "../services/company.service.js";
import CompanyDetails from "../models/company.model.js";
import Seller from "../models/sellerSingnup.model.js";
import { cache } from "../services/cache.service.js";

export const registerCompany = async (req, res) => {
  try {
    const userId = req.user.id; // Token se User ID aati hai

    // ✅ User ID se Seller find karo
    const seller = await Seller.findOne({ userId });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller account not found",
      });
    }

    // ✅ Seller ki ID use karo
    const sellerId = seller._id.toString();

    console.log("this is", req.body);

    const company = await registerCompanyService(req.body, req.files, sellerId);
    await cache.clearPattern(`company:*`);

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
    let sellerId;
    let companyId;

    if (req.user.role.includes("seller")) {
      // ✅ role array check
      const userId = req.user.id;

      // ✅ User ID se Seller find karo
      const seller = await Seller.findOne({ userId });

      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Seller account not found",
        });
      }

      sellerId = seller._id.toString();

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
      console.log("🔥 Company Redis HIT:", cacheKey);
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

    console.log("here is tempory consolling the compnay", companyData);
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
