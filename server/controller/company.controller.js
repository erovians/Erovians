import CompanyDetails from "../models/company.model.js";

export const createCompanyBasicInfo = async (req, res) => {
  try {
    // Renamed createdBy to SellerId to match the schema
    const { companyBasicInfo, SellerId } = req.body;

    // --- Your validation logic here is good, no changes needed ---
    if (!SellerId) {
      return res
        .status(400)
        .json({ success: false, message: "SellerId is required" });
    }
    if (!companyBasicInfo) {
      return res
        .status(400)
        .json({ success: false, message: "companyBasicInfo is required" });
    }
    // ... all other specific field validations

    // Find by SellerId and update/create the document
    const company = await CompanyDetails.findOneAndUpdate(
      { SellerId: SellerId }, // Use the unique SellerId as the filter
      {
        $set: { companyBasicInfo: companyBasicInfo }, // Use $set to update the nested document
        $setOnInsert: { SellerId: SellerId }, // This sets the SellerId only on document creation
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(201).json({
      success: true,
      message: "Company basic info saved successfully",
      data: company,
    });
  } catch (error) {
    // ... your error handling is good
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
    });
  }
};

export const createCompanyIntro = async (req, res) => {
  try {
    // We need SellerId to find the document to update
    const { companyIntro, SellerId } = req.body;

    if (!companyIntro || !SellerId) {
      return res.status(400).json({
        success: false,
        message: "companyIntro and SellerId are required",
      });
    }

    // --- Your validation logic here is good, no changes needed ---
    const { logo, companyDescription, companyPhotos } = companyIntro;
    if (!logo) {
      return res
        .status(400)
        .json({ success: false, message: "Logo is required" });
    }
    if (!companyDescription || companyDescription.length < 50) {
      return res.status(400).json({
        success: false,
        message: "companyDescription must be at least 50 characters",
      });
    }
    if (!Array.isArray(companyPhotos) || companyPhotos.length < 3) {
      return res.status(400).json({
        success: false,
        message: "At least 3 company photos are required",
      });
    }

    // Find by SellerId and update/create the document
    const company = await CompanyDetails.findOneAndUpdate(
      { SellerId: SellerId }, // Use the unique SellerId as the filter
      {
        $set: { companyIntro: companyIntro },
        $setOnInsert: { SellerId: SellerId },
      },
      { new: true, upsert: true, runValidators: true }
    );

    if (!company) {
      // This case is unlikely with upsert:true but good for robustness
      return res.status(404).json({
        success: false,
        message: "Could not create or find company document.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Company intro saved successfully",
      data: company,
    });
  } catch (error) {
    // ... your error handling is good
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
    });
  }
};
