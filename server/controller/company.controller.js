import {
  registerCompanyService,
  updateCompanyService,
  getCompanyDetailsService,
} from "../services/company.service.js";
import CompanyDetails from "../models/company.model.js";
import Seller from "../models/sellerSingnup.model.js";
import { cache } from "../services/cache.service.js";

// ======================== REGISTER COMPANY ========================
export const registerCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Find seller
    const seller = await Seller.findOne({ userId });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller account not found",
      });
    }

    // 2. Check if company already exists
    const existingCompany = await CompanyDetails.findOne({
      sellerId: seller._id,
    });
    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company already exists. Use update endpoint.",
      });
    }

    // 3. Register company
    const company = await registerCompanyService(
      req.body,
      req.files,
      seller._id
    );

    // 4. Update seller status to professional (if individual)
    if (seller.seller_status === "individual") {
      seller.seller_status = "professional";
      seller.seller_company_number = req.body.company_registration_number;
      await seller.save();
    }

    // 5. Cache company data
    await cache.set(`company:${company._id}`, company, 3600);

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company,
    });
  } catch (error) {
    console.error("RegisterCompany Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register company",
    });
  }
};

// ======================== UPDATE COMPANY ========================
export const updateCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Find seller
    const seller = await Seller.findOne({ userId });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller account not found",
      });
    }

    // 2. Check if company exists
    const existingCompany = await CompanyDetails.findOne({
      sellerId: seller._id,
    });
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found. Please register first.",
      });
    }

    // 3. Update company
    const updatedCompany = await updateCompanyService(
      req.body,
      req.files,
      seller._id
    );

    // 4. Update seller status if needed
    if (seller.seller_status === "individual") {
      seller.seller_status = "professional";
      if (req.body.company_registration_number) {
        seller.seller_company_number = req.body.company_registration_number;
      }
      await seller.save();
    }

    // 5. Clear and update cache
    await cache.del(`company:${updatedCompany._id}`);
    await cache.set(`company:${updatedCompany._id}`, updatedCompany, 3600);

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("UpdateCompany Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update company",
    });
  }
};

// ======================== GET COMPANY ========================
export const getCompanyDetails = async (req, res) => {
  try {
    let sellerId;
    let companyId;

    if (req.user.role.includes("seller")) {
      const userId = req.user.id;

      // Find seller by userId
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

    // Check cache
    const cached = await cache.get(cacheKey);
    if (cached) {
      console.log("🔥 Company Redis HIT:", cacheKey);
      return res.status(200).json({
        success: true,
        fromCache: true,
        company: cached,
      });
    }

    // Fetch from DB
    const companyData = await getCompanyDetailsService({ sellerId, companyId });

    if (!companyData) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Set cache
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
