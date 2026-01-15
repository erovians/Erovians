import asyncHandler from "../../middleware/buyer/asyncHandler.js";
import AppError from "../../utils/buyer/AppError.js";
import logger from "../../config/winston.js";
import { getCompaniesListService } from "../../services/buyer/company.service.js";

export const fetchCompany = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    mainCategory,
    subCategory,
    country,
    state,
    city,
    yearFrom,
    yearTo,
    paymentMethods,
    currency,
    language,
    newArrivals,
  } = req.query;

  const filters = {};

  if (mainCategory) {
    filters.mainCategory = mainCategory.split(",").map((c) => c.trim());
  }
  if (subCategory) {
    filters.subCategory = subCategory.split(",").map((c) => c.trim());
  }
  if (country) filters.country = country;
  if (state) filters.state = state;
  if (city) filters.city = city;
  if (yearFrom) filters.yearFrom = parseInt(yearFrom);
  if (yearTo) filters.yearTo = parseInt(yearTo);
  if (paymentMethods) {
    filters.paymentMethods = paymentMethods.split(",").map((p) => p.trim());
  }
  if (currency) {
    filters.currency = currency.split(",").map((c) => c.trim());
  }
  if (language) {
    filters.language = language.split(",").map((l) => l.trim());
  }
  if (newArrivals === "true") {
    filters.newArrivals = true;
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    return next(new AppError("Invalid pagination parameters", 400));
  }

  try {
    const result = await getCompaniesListService({
      filters,
      page: pageNum,
      limit: limitNum,
    });

    logger.info("Companies fetched successfully", {
      page: pageNum,
      limit: limitNum,
      totalCompanies: result.totalCompanies,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error fetching companies", { error: error.message });
    return next(new AppError("Failed to fetch companies", 500));
  }
});
