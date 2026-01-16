import asyncHandler from "../../middleware/buyer/asyncHandler.js";
import AppError from "../../utils/buyer/AppError.js";
import logger from "../../config/winston.js";
import { getCompaniesListService } from "../../services/buyer/company.service.js";
import { getCompanyProductsService } from "../../services/buyer/product.service.js";
import { getProductDetailService } from "../../services/buyer/productDetail.service.js";
import mongoose from "mongoose";

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

export const fetchCompanyProduct = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const {
    page = 1,
    limit = 5,
    category,
    subCategory,
    grade,
    color,
    origin,
    priceMin,
    priceMax,
    newArrivals,
  } = req.query;

  // Validate companyId
  if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
    return next(new AppError("Invalid company ID", 400));
  }

  // Build filters object
  const filters = {};

  if (category) {
    filters.category = category.split(",").map((c) => c.trim());
  }
  if (subCategory) {
    filters.subCategory = subCategory.split(",").map((c) => c.trim());
  }
  if (grade) {
    filters.grade = grade.split(",").map((g) => g.trim().toUpperCase());
  }
  if (color) {
    filters.color = color.trim();
  }
  if (origin) {
    filters.origin = origin.trim();
  }
  if (priceMin) {
    filters.priceMin = parseFloat(priceMin);
  }
  if (priceMax) {
    filters.priceMax = parseFloat(priceMax);
  }
  if (newArrivals === "true") {
    filters.newArrivals = true;
  }

  // Pagination validation
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    return next(new AppError("Invalid pagination parameters", 400));
  }

  try {
    const result = await getCompanyProductsService({
      companyId,
      page: pageNum,
      limit: limitNum,
      filters,
    });

    logger.info("Company products fetched successfully", {
      companyId,
      page: pageNum,
      limit: limitNum,
      totalProducts: result.pagination.totalProducts,
      appliedFilters: filters,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error fetching company products", {
      companyId,
      error: error.message,
    });
    return next(new AppError("Failed to fetch company products", 500));
  }
});

export const fetchProductDetails = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  // Validate productId
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return next(new AppError("Invalid product ID", 400));
  }

  try {
    const result = await getProductDetailService(productId);

    // Check if product exists
    if (!result) {
      return next(new AppError("Product not found or inactive", 404));
    }

    logger.info("Product detail fetched successfully", {
      productId,
      productName: result.product.productName,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error fetching product details", {
      productId,
      error: error.message,
    });
    return next(new AppError("Failed to fetch product details", 500));
  }
});
