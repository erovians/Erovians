import Company from "../models/company.model.js";

export const createCompanyBasicInfo = async (req, res) => {
  try {
    const { companyBasicInfo } = req.body;

    if (!companyBasicInfo) {
      return res
        .status(400)
        .json({ success: false, message: "companyBasicInfo is required" });
    }

    const {
      companyName,
      address,
      mainCategory,
      acceptedCurrency,
      acceptedPaymentType,
    } = companyBasicInfo;

    if (!companyName || companyName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "companyName must be at least 2 characters",
      });
    }

    if (
      !address?.street ||
      !address.city ||
      !address.stateOrProvince ||
      !address.countryOrRegion ||
      !address.postalCode
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Complete address is required" });
    }

    if (!mainCategory) {
      return res
        .status(400)
        .json({ success: false, message: "mainCategory is required" });
    }

    if (!acceptedCurrency) {
      return res
        .status(400)
        .json({ success: false, message: "acceptedCurrency is required" });
    }

    if (!acceptedPaymentType || acceptedPaymentType.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one acceptedPaymentType is required",
      });
    }

    let company = await Company.findOne({
      "companyBasicInfo.companyName": companyBasicInfo.companyName.trim(),
    });

    if (company) {
      company.companyBasicInfo = {
        ...company.companyBasicInfo,
        ...companyBasicInfo,
      };
    } else {
      company = new Company({ companyBasicInfo });
    }

    const savedCompany = await company.save();

    return res.status(201).json({
      success: true,
      message: "Company basic info saved successfully",
      data: savedCompany,
    });
  } catch (error) {
    console.error("Error saving company basic info:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const createCompanyIntro = async (req, res) => {
  try {
    const { companyIntro, companyName } = req.body;

    if (!companyIntro || !companyName) {
      return res.status(400).json({
        success: false,
        message: "companyIntro and companyName are required",
      });
    }

    const { logo, companyDescription, companyPhotos } = companyIntro;

    if (!logo)
      return res
        .status(400)
        .json({ success: false, message: "Logo is required" });
    if (!companyDescription || companyDescription.length < 50) {
      return res.status(400).json({
        success: false,
        message: "companyDescription must be at least 50 characters",
      });
    }
    if (!Array.isArray(companyPhotos)) {
      return res
        .status(400)
        .json({ success: false, message: "companyPhotos must be an array" });
    }

    let company = await Company.findOne({
      "companyBasicInfo.companyName": companyName.trim(),
    });

    if (company) {
      company.companyIntro = { ...company.companyIntro, ...companyIntro };
    } else {
      company = new Company({
        companyBasicInfo: { companyName },
        companyIntro,
      });
    }

    const savedCompany = await company.save();

    return res.status(201).json({
      success: true,
      message: "Company intro saved successfully",
      data: savedCompany,
    });
  } catch (error) {
    console.error("Error saving company intro:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
