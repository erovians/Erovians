import asyncHandler from "../../middleware/buyer/asyncHandler.js";
import AppError from "../../utils/buyer/AppError.js";
import logger from "../../config/winston.js";
import {
  getAllCategoriesService,
  getProductsByCategoryService,
  getProductsBySubCategoryService,
} from "../../services/buyer/category.service.js";
import Product from "../../models/product.model.js";
import CompanyDetails from "../../models/company.model.js";
// ✅ SLUG TO CATEGORY NAME MAPPING (at top level)
const SLUG_TO_CATEGORY_MAP = {
  "natural-stones": "natural stones",
  "ceramic-tiles": "ceramic & tiles",
  "alternatives-finishes": "alternatives & finishes",
};

export const getAllCategories = asyncHandler(async (req, res, next) => {
  try {
    const result = await getAllCategoriesService();

    logger.info("All categories fetched successfully", {
      totalCategories: result.categories.length,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error fetching all categories", { error: error.message });
    return next(new AppError("Failed to fetch categories", 500));
  }
});

/**
 * @route   GET /api/categories/:categorySlug/products
 * @desc    Get all products for a specific category (from all companies)
 * @access  Public
 */
export const getProductsByCategory = asyncHandler(async (req, res, next) => {
  const { categorySlug } = req.params;
  const {
    page = 1,
    limit = 10,
    subCategory,
    grade,
    color,
    origin,
    priceMin,
    priceMax,
    lengthMin,
    lengthMax,
    widthMin,
    widthMax,
    thicknessMin,
    thicknessMax,
    weightMin,
    weightMax,
    sortBy,
    newArrivals,
  } = req.query;

  // ✅ Validate categorySlug using mapping
  if (!categorySlug || !SLUG_TO_CATEGORY_MAP[categorySlug]) {
    return next(new AppError("Invalid category", 400));
  }

  // ✅ Convert slug to category name using mapping
  const categoryName = SLUG_TO_CATEGORY_MAP[categorySlug];

  // Build filters object
  const filters = { category: categoryName };

  if (subCategory) {
    filters.subCategory = subCategory
      .split(",")
      .map((c) => c.trim().toLowerCase());
  }
  if (grade) {
    filters.grade = grade.split(",").map((g) => g.trim().toUpperCase());
  }
  if (color) {
    filters.color = color.split(",").map((c) => c.trim().toLowerCase());
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
  if (lengthMin) {
    filters.lengthMin = parseFloat(lengthMin);
  }
  if (lengthMax) {
    filters.lengthMax = parseFloat(lengthMax);
  }
  if (widthMin) {
    filters.widthMin = parseFloat(widthMin);
  }
  if (widthMax) {
    filters.widthMax = parseFloat(widthMax);
  }
  if (thicknessMin) {
    filters.thicknessMin = parseFloat(thicknessMin);
  }
  if (thicknessMax) {
    filters.thicknessMax = parseFloat(thicknessMax);
  }
  if (weightMin) {
    filters.weightMin = parseFloat(weightMin);
  }
  if (weightMax) {
    filters.weightMax = parseFloat(weightMax);
  }
  if (sortBy) {
    filters.sortBy = sortBy.trim();
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
    const result = await getProductsByCategoryService({
      page: pageNum,
      limit: limitNum,
      filters,
    });

    logger.info("Category products fetched successfully", {
      category: categoryName,
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
    logger.error("Error fetching category products", {
      category: categoryName,
      error: error.message,
    });
    return next(new AppError("Failed to fetch category products", 500));
  }
});

/**
 * @route   GET /api/categories/:categorySlug/:subCategorySlug/products
 * @desc    Get all products for a specific subcategory (from all companies)
 * @access  Public
 */
export const getProductsBySubCategory = asyncHandler(async (req, res, next) => {
  const { categorySlug, subCategorySlug } = req.params;
  const {
    page = 1,
    limit = 10,
    grade,
    color,
    origin,
    priceMin,
    priceMax,
    lengthMin,
    lengthMax,
    widthMin,
    widthMax,
    thicknessMin,
    thicknessMax,
    weightMin,
    weightMax,
    sortBy,
    newArrivals,
  } = req.query;

  // ✅ Validate params
  if (!categorySlug || !subCategorySlug) {
    return next(
      new AppError("Category and subcategory slugs are required", 400)
    );
  }

  // ✅ Validate category using mapping
  if (!SLUG_TO_CATEGORY_MAP[categorySlug]) {
    return next(new AppError("Invalid category", 400));
  }

  // ✅ Convert slugs to names
  const categoryName = SLUG_TO_CATEGORY_MAP[categorySlug];
  const subCategoryName = subCategorySlug.replace(/-/g, " ").toLowerCase();

  // Build filters object
  const filters = {
    category: categoryName,
    subCategory: [subCategoryName],
  };

  if (grade) {
    filters.grade = grade.split(",").map((g) => g.trim().toUpperCase());
  }
  if (color) {
    filters.color = color.split(",").map((c) => c.trim().toLowerCase());
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
  if (lengthMin) {
    filters.lengthMin = parseFloat(lengthMin);
  }
  if (lengthMax) {
    filters.lengthMax = parseFloat(lengthMax);
  }
  if (widthMin) {
    filters.widthMin = parseFloat(widthMin);
  }
  if (widthMax) {
    filters.widthMax = parseFloat(widthMax);
  }
  if (thicknessMin) {
    filters.thicknessMin = parseFloat(thicknessMin);
  }
  if (thicknessMax) {
    filters.thicknessMax = parseFloat(thicknessMax);
  }
  if (weightMin) {
    filters.weightMin = parseFloat(weightMin);
  }
  if (weightMax) {
    filters.weightMax = parseFloat(weightMax);
  }
  if (sortBy) {
    filters.sortBy = sortBy.trim();
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
    const result = await getProductsBySubCategoryService({
      page: pageNum,
      limit: limitNum,
      filters,
    });

    logger.info("Subcategory products fetched successfully", {
      category: categoryName,
      subCategory: subCategoryName,
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
    logger.error("Error fetching subcategory products", {
      category: categoryName,
      subCategory: subCategoryName,
      error: error.message,
    });
    return next(new AppError("Failed to fetch subcategory products", 500));
  }
});

export const universalSearchController = asyncHandler(
  async (req, res, next) => {
    const { q } = req.query;

    // Validation
    if (!q || q.trim().length < 2) {
      return next(
        new AppError("Search query must be at least 2 characters", 400)
      );
    }

    const searchQuery = q.trim();

    try {
      // Create regex for case-insensitive partial matching
      const searchRegex = new RegExp(searchQuery, "i");

      // Parallel search - Products & Companies with filters
      const [products, companies] = await Promise.all([
        // ✅ Search Products with seller verification check
        Product.find({
          $or: [
            { productName: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
            { subCategory: searchRegex },
          ],
          status: "active", // ✅ Only active products
        })
          .populate({
            path: "sellerId",
            select: "varificationStatus status",
            match: {
              varificationStatus: "Approved", // ✅ Only approved sellers
              status: "active", // ✅ Only active sellers
            },
          })
          .select(
            "productName productImages pricePerUnit priceUnit category subCategory sellerId"
          )
          .limit(10) // Fetch more to filter out null sellers
          .lean(),

        // ✅ Search Companies with seller verification check
        CompanyDetails.find({
          $or: [
            { "companyBasicInfo.companyName": searchRegex },
            { "companyIntro.companyDescription": searchRegex },
          ],
        })
          .populate({
            path: "sellerId",
            select: "varificationStatus status",
            match: {
              varificationStatus: "Approved", // ✅ Only approved sellers
              status: "active", // ✅ Only active sellers
            },
          })
          .select("companyBasicInfo.companyName companyIntro.logo sellerId")
          .limit(10) // Fetch more to filter out null sellers
          .lean(),
      ]);

      // ✅ Filter out products where seller is null (not approved/active)
      const validProducts = products
        .filter((p) => p.sellerId !== null)
        .slice(0, 3); // Take only 3 after filtering

      // ✅ Filter out companies where seller is null (not approved/active)
      const validCompanies = companies
        .filter((c) => c.sellerId !== null)
        .slice(0, 3); // Take only 3 after filtering

      // Format response (remove seller details from response)
      const formattedProducts = validProducts.map((p) => ({
        _id: p._id,
        productName: p.productName,
        productImage: p.productImages?.[0] || null,
        price: p.pricePerUnit,
        priceUnit: p.priceUnit,
        category: p.category,
        subCategory: p.subCategory,
        type: "product",
      }));

      const formattedCompanies = validCompanies.map((c) => ({
        _id: c._id,
        companyName: c.companyBasicInfo?.companyName,
        logo: c.companyIntro?.logo || null,
        type: "company",
      }));

      logger.info("Universal search completed", {
        query: searchQuery,
        productsFound: formattedProducts.length,
        companiesFound: formattedCompanies.length,
      });

      res.status(200).json({
        success: true,
        data: {
          products: formattedProducts,
          companies: formattedCompanies,
        },
      });
    } catch (error) {
      console.log("EXACT ERROR:", error);
      logger.error("Universal search error", {
        query: searchQuery,
        error: error.message,
        stack: error.stack,
      });
      return next(new AppError("Search failed", 500));
    }
  }
);
