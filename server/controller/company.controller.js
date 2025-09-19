import Company from "../models/company.model.js";

export const createCompany = async (req, res) => {
  try {
    const { companyBasicInfo, companyIntro } = req.body;

    if (!companyBasicInfo || !companyIntro) {
      return res.status(400).json({
        success: false,
        message: "companyBasicInfo and companyIntro are required",
      });
    }

    const existingCompany = await Company.findOne({
      "companyBasicInfo.companyName": companyBasicInfo.companyName.trim(),
    });
    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company with this name already exists",
      });
    }

    const company = new Company({
      companyBasicInfo,
      companyIntro,
      createdBy: req.user?._id,
    });

    const savedCompany = await company.save();

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: savedCompany,
    });
  } catch (error) {
    console.error("Error creating Company:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
