import {
  registerCompanyService,
  updateCompanyService,
  getCompanyDetailsService,
} from "../../services/company.service.js";
import CompanyDetails from "../../models/company.model.js";
import Seller from "../../models/sellerSingnup.model.js";
import { cache } from "../../services/cache.service.js";

// ✅ GET Company Details (SAME AS BEFORE)
export const getCompanyDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Find seller by userId
    const seller = await Seller.findOne({ userId });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller account not found",
      });
    }

    const sellerId = seller._id.toString();

    // 2️⃣ Try to find company
    const company = await CompanyDetails.findOne({ sellerId });

    // ✅ If no company exists (Individual seller case)
    if (!company) {
      return res.status(200).json({
        success: true,
        company: null,
        seller_status: seller.seller_status,
        message: "No company profile found. You can create one.",
      });
    }

    const companyId = company._id;
    const cacheKey = `company:${companyId}`;

    // 3️⃣ Check cache
    const cached = await cache.get(cacheKey);
    if (cached) {
      console.log("🔥 Company Redis HIT:", cacheKey);
      return res.status(200).json({
        success: true,
        fromCache: true,
        company: cached,
        seller_status: seller.seller_status,
      });
    }

    // 4️⃣ Fetch from DB with full details
    const companyData = await getCompanyDetailsService({
      sellerId,
      companyId,
    });

    if (!companyData) {
      return res.status(200).json({
        success: true,
        company: null,
        seller_status: seller.seller_status,
      });
    }

    // 5️⃣ Set cache
    await cache.set(cacheKey, companyData, 3600);

    return res.status(200).json({
      success: true,
      fromCache: false,
      company: companyData,
      seller_status: seller.seller_status,
    });
  } catch (err) {
    console.error("❌ getCompanyDetails Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ NEW - SAVE Company (CREATE or UPDATE)
export const saveCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("💾 saveCompany called for userId:", userId);

    // 1️⃣ Find seller
    const seller = await Seller.findOne({ userId });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller account not found",
      });
    }
    console.log("✅ Seller found:", seller._id);

    // 2️⃣ Check if company exists
    const existingCompany = await CompanyDetails.findOne({
      sellerId: seller._id,
    });

    let company;
    let isUpdate = false;

    // 3️⃣ DECIDE: CREATE or UPDATE
    if (existingCompany) {
      console.log("📝 UPDATE mode - Company exists");
      isUpdate = true;
      company = await updateCompanyService(req.body, req.files, seller._id);
    } else {
      console.log("🆕 CREATE mode - New company");
      company = await registerCompanyService(req.body, req.files, seller._id);

      // 4️⃣ Update seller status (ONLY on CREATE)
      if (seller.seller_status === "individual") {
        console.log("🔄 Converting individual → professional");
        seller.seller_status = "professional";
        seller.seller_company_number = req.body.company_registration_number;
        await seller.save();
        console.log("✅ Seller status updated to professional");
      }
    }

    // 5️⃣ Clear and update cache
    const cacheKey = `company:${company._id}`;
    await cache.del(cacheKey);
    await cache.set(cacheKey, company, 3600);
    console.log("✅ Cache updated");

    // 6️⃣ Response
    res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: isUpdate
        ? "Company profile updated successfully! ✅"
        : "Company profile created successfully! 🎉",
      company,
      seller_status: seller.seller_status,
    });
  } catch (error) {
    console.error("❌ SaveCompany Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to save company",
    });
  }
};
