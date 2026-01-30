import crypto from "crypto";
import Product from "../../models/product.model.js";
import CompanyDetails from "../../models/company.model.js";
import redisClient from "../../utils/redis.utils.js";
import logger from "../../config/winston.js";

/**
 * Get all categories with product counts and subcategories
 */
export const getAllCategoriesService = async () => {
  try {
    const cacheKey = "categories:all";

    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("Cache HIT for all categories", { cacheKey });
      return JSON.parse(cached);
    }

    logger.info("Cache MISS - Fetching categories from DB", { cacheKey });

    // Define categories structure
    const categoriesData = [
      {
        name: "Natural Stones",
        slug: "natural-stones",
        value: "natural stones",
        subcategories: [
          "marble",
          "granite",
          "sandstone",
          "limestone",
          "slate",
          "quartzite",
          "travertine",
        ],
      },
      {
        name: "Ceramic & Tiles",
        slug: "ceramic-tiles",
        value: "ceramic & tiles",
        subcategories: [
          "floor tiles",
          "wall tiles",
          "vitrified tiles",
          "glazed tiles",
          "porcelain tiles",
          "mosaic tiles",
        ],
      },
      {
        name: "Alternatives & Finishes",
        slug: "alternatives-finishes",
        value: "alternatives & finishes",
        subcategories: [
          "quartz",
          "engineered stone",
          "terrazzo",
          "concrete",
          "resin",
          "metal finishes",
        ],
      },
    ];

    // Get product counts for each category and subcategory
    const categoriesWithCounts = await Promise.all(
      categoriesData.map(async (category) => {
        // Count total products in this category
        const totalProducts = await Product.countDocuments({
          category: category.value,
          status: "active",
        });

        // Count products in each subcategory
        const subcategoriesWithCounts = await Promise.all(
          category.subcategories.map(async (subcat) => {
            const count = await Product.countDocuments({
              category: category.value,
              subCategory: subcat,
              status: "active",
            });

            return {
              name: subcat
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              slug: subcat.replace(/\s+/g, "-"),
              value: subcat,
              productCount: count,
            };
          })
        );

        return {
          name: category.name,
          slug: category.slug,
          value: category.value,
          totalProducts,
          subcategories: subcategoriesWithCounts,
        };
      })
    );

    const response = {
      categories: categoriesWithCounts,
    };

    // Cache for 1 hour (categories don't change frequently)
    const ttl = 3600;
    await redisClient.setEx(cacheKey, ttl, JSON.stringify(response));

    logger.info("Categories cached successfully", {
      cacheKey,
      ttl,
      totalCategories: categoriesWithCounts.length,
    });

    return response;
  } catch (error) {
    logger.error("getAllCategoriesService error", {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

/**
 * Get products by category with filters and pagination
 */
export const getProductsByCategoryService = async ({
  page,
  limit,
  filters = {},
}) => {
  try {
    // Generate cache key with filters hash
    const cacheKey = generateCategoryCacheKey("category", page, limit, filters);

    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("Cache HIT for category products", {
        cacheKey,
        category: filters.category,
      });
      return JSON.parse(cached);
    }

    logger.info("Cache MISS - Fetching category products from DB", {
      cacheKey,
      category: filters.category,
    });

    // Build MongoDB query
    const matchQuery = buildCategoryProductMatchQuery(filters);

    // Build sort query
    const sortQuery = buildSortQuery(filters.sortBy);

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch products with company details
    const products = await Product.find(matchQuery)
      .populate({
        path: "companyId",
        select:
          "companyBasicInfo.companyName companyBasicInfo.address companyIntro.logo",
      })
      .select(
        "productName productImages category subCategory grade color origin size weight weightMeasurement pricePerUnit priceUnit description views status createdAt companyId"
      )
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(matchQuery);

    // Format response (flatten company data)
    const formattedProducts = products.map((product) => ({
      ...product,
      company: product.companyId
        ? {
            _id: product.companyId._id,
            companyName: product.companyId.companyBasicInfo?.companyName,
            address: product.companyId.companyBasicInfo?.address,
            logo: product.companyId.companyIntro?.logo,
          }
        : null,
      companyId: product.companyId?._id, // Keep reference
    }));

    // Prepare response
    const response = {
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        limit,
      },
    };

    // Cache for 10 minutes
    const ttl = filters.newArrivals ? 300 : 600;
    await redisClient.setEx(cacheKey, ttl, JSON.stringify(response));

    logger.info("Category products cached successfully", {
      cacheKey,
      category: filters.category,
      ttl,
      totalProducts,
    });

    return response;
  } catch (error) {
    logger.error("getProductsByCategoryService error", {
      category: filters.category,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

/**
 * Get products by subcategory with filters and pagination
 */
export const getProductsBySubCategoryService = async ({
  page,
  limit,
  filters = {},
}) => {
  try {
    // Generate cache key with filters hash
    const cacheKey = generateCategoryCacheKey(
      "subcategory",
      page,
      limit,
      filters
    );

    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("Cache HIT for subcategory products", {
        cacheKey,
        category: filters.category,
        subCategory: filters.subCategory,
      });
      return JSON.parse(cached);
    }

    logger.info("Cache MISS - Fetching subcategory products from DB", {
      cacheKey,
      category: filters.category,
      subCategory: filters.subCategory,
    });

    // Build MongoDB query (same as category but with subCategory filter)
    const matchQuery = buildCategoryProductMatchQuery(filters);

    // Build sort query
    const sortQuery = buildSortQuery(filters.sortBy);

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch products with company details
    const products = await Product.find(matchQuery)
      .populate({
        path: "companyId",
        select:
          "companyBasicInfo.companyName companyBasicInfo.address companyIntro.logo",
      })
      .select(
        "productName productImages category subCategory grade color origin size weight weightMeasurement pricePerUnit priceUnit description views status createdAt companyId"
      )
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(matchQuery);

    // Format response (flatten company data)
    const formattedProducts = products.map((product) => ({
      ...product,
      company: product.companyId
        ? {
            _id: product.companyId._id,
            companyName: product.companyId.companyBasicInfo?.companyName,
            address: product.companyId.companyBasicInfo?.address,
            logo: product.companyId.companyIntro?.logo,
          }
        : null,
      companyId: product.companyId?._id, // Keep reference
    }));

    // Prepare response
    const response = {
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        limit,
      },
    };

    // Cache for 10 minutes
    const ttl = filters.newArrivals ? 300 : 600;
    await redisClient.setEx(cacheKey, ttl, JSON.stringify(response));

    logger.info("Subcategory products cached successfully", {
      cacheKey,
      category: filters.category,
      subCategory: filters.subCategory,
      ttl,
      totalProducts,
    });

    return response;
  } catch (error) {
    logger.error("getProductsBySubCategoryService error", {
      category: filters.category,
      subCategory: filters.subCategory,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate cache key with filters hash
 */
const generateCategoryCacheKey = (type, page, limit, filters) => {
  // Sort filters alphabetically for consistent hash
  const sortedFilters = Object.keys(filters)
    .sort()
    .reduce((acc, key) => {
      acc[key] = filters[key];
      return acc;
    }, {});

  // Create hash
  const filterHash = crypto
    .createHash("md5")
    .update(JSON.stringify(sortedFilters))
    .digest("hex")
    .substring(0, 8);

  return `${type}:${
    filters.category || "all"
  }:products:page:${page}:limit:${limit}:filters:${filterHash}`;
};

/**
 * Build MongoDB match query for category/subcategory products
 */
const buildCategoryProductMatchQuery = (filters) => {
  const matchQuery = {
    status: "active", // Only active products
  };

  // Category filter (required)
  if (filters.category) {
    matchQuery.category = filters.category;
  }

  // SubCategory filter (optional, array)
  if (filters.subCategory && filters.subCategory.length > 0) {
    matchQuery.subCategory = {
      $in: filters.subCategory,
    };
  }

  // Grade filter (optional, array)
  if (filters.grade && filters.grade.length > 0) {
    matchQuery.grade = {
      $in: filters.grade, // A, B, C
    };
  }

  // Color filter (optional, array with regex)
  if (filters.color && filters.color.length > 0) {
    matchQuery.color = {
      $in: filters.color.map((c) => new RegExp(c, "i")),
    };
  }

  // Origin filter (optional, regex)
  if (filters.origin) {
    matchQuery.origin = new RegExp(filters.origin, "i");
  }

  // Price range filter
  if (filters.priceMin || filters.priceMax) {
    matchQuery.pricePerUnit = {};
    if (filters.priceMin) {
      matchQuery.pricePerUnit.$gte = parseFloat(filters.priceMin);
    }
    if (filters.priceMax) {
      matchQuery.pricePerUnit.$lte = parseFloat(filters.priceMax);
    }
  }

  // Size filters (length, width, thickness)
  if (filters.lengthMin || filters.lengthMax) {
    matchQuery["size.length"] = {};
    if (filters.lengthMin) {
      matchQuery["size.length"].$gte = parseFloat(filters.lengthMin);
    }
    if (filters.lengthMax) {
      matchQuery["size.length"].$lte = parseFloat(filters.lengthMax);
    }
  }

  if (filters.widthMin || filters.widthMax) {
    matchQuery["size.width"] = {};
    if (filters.widthMin) {
      matchQuery["size.width"].$gte = parseFloat(filters.widthMin);
    }
    if (filters.widthMax) {
      matchQuery["size.width"].$lte = parseFloat(filters.widthMax);
    }
  }

  if (filters.thicknessMin || filters.thicknessMax) {
    matchQuery["size.thickness"] = {};
    if (filters.thicknessMin) {
      matchQuery["size.thickness"].$gte = parseFloat(filters.thicknessMin);
    }
    if (filters.thicknessMax) {
      matchQuery["size.thickness"].$lte = parseFloat(filters.thicknessMax);
    }
  }

  // Weight filter
  if (filters.weightMin || filters.weightMax) {
    matchQuery.weight = {};
    if (filters.weightMin) {
      matchQuery.weight.$gte = parseFloat(filters.weightMin);
    }
    if (filters.weightMax) {
      matchQuery.weight.$lte = parseFloat(filters.weightMax);
    }
  }

  // New arrivals filter (last 7 days)
  if (filters.newArrivals) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    matchQuery.createdAt = { $gte: sevenDaysAgo };
  }

  return matchQuery;
};

/**
 * Build sort query based on sortBy parameter
 */
const buildSortQuery = (sortBy) => {
  const sortOptions = {
    price_low_to_high: { pricePerUnit: 1 },
    price_high_to_low: { pricePerUnit: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { views: -1 },
    name_a_to_z: { productName: 1 },
    name_z_to_a: { productName: -1 },
  };

  return sortOptions[sortBy] || { createdAt: -1 }; // Default: newest first
};

/**
 * Cache invalidation helper for category products
 */
export const invalidateCategoryProductCache = async (category = null) => {
  try {
    const keys = [];
    const pattern = category
      ? `category:${category}:products:*`
      : "category:*:products:*";

    for await (const key of redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info("Category products cache invalidated", {
        category,
        keysDeleted: keys.length,
      });
    }
  } catch (error) {
    logger.error("Category products cache invalidation error", {
      category,
      error: error.message,
    });
  }
};

/**
 * Cache invalidation helper for subcategory products
 */
export const invalidateSubCategoryProductCache = async (
  category = null,
  subCategory = null
) => {
  try {
    const keys = [];
    let pattern = "subcategory:*:products:*";

    if (category && subCategory) {
      pattern = `subcategory:${category}:products:*`;
    } else if (category) {
      pattern = `subcategory:${category}:products:*`;
    }

    for await (const key of redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info("Subcategory products cache invalidated", {
        category,
        subCategory,
        keysDeleted: keys.length,
      });
    }
  } catch (error) {
    logger.error("Subcategory products cache invalidation error", {
      category,
      subCategory,
      error: error.message,
    });
  }
};

/**
 * Invalidate all categories cache (call this when categories list changes)
 */
export const invalidateAllCategoriesCache = async () => {
  try {
    const cacheKey = "categories:all";
    const deleted = await redisClient.del(cacheKey);

    if (deleted) {
      logger.info("All categories cache invalidated", { cacheKey });
    }
  } catch (error) {
    logger.error("All categories cache invalidation error", {
      error: error.message,
    });
  }
};
