import crypto from "crypto";
import Product from "../../models/product.model.js";
import redisClient from "../../utils/redis.utils.js";
import logger from "../../config/winston.js";

export const getCompanyProductsService = async ({
  companyId,
  page,
  limit,
  filters = {},
}) => {
  try {
    // Generate cache key with filters hash
    const cacheKey = generateProductCacheKey(companyId, page, limit, filters);

    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("Cache HIT for company products", { cacheKey, companyId });
      return JSON.parse(cached);
    }

    logger.info("Cache MISS - Fetching products from DB", {
      cacheKey,
      companyId,
    });

    // Build MongoDB query
    const matchQuery = buildProductMatchQuery(companyId, filters);

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const products = await Product.find(matchQuery)
      .select(
        "productName productImages category subCategory grade color origin size weight weightMeasurement pricePerUnit priceUnit description views status createdAt"
      )
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(matchQuery);

    // Prepare response
    const response = {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        limit,
      },
    };

    // Cache for 10 minutes (products update more frequently)
    const ttl = filters.newArrivals ? 300 : 600; // 5 mins for new arrivals, 10 mins otherwise
    await redisClient.setEx(cacheKey, ttl, JSON.stringify(response));

    logger.info("Products cached successfully", {
      cacheKey,
      companyId,
      ttl,
      totalProducts,
    });

    return response;
  } catch (error) {
    logger.error("getCompanyProductsService error", {
      companyId,
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
    console.error("FULL ERROR:", error);
    throw error;
  }
};

// Generate cache key with filters hash
const generateProductCacheKey = (companyId, page, limit, filters) => {
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

  return `company:${companyId}:products:page:${page}:limit:${limit}:filters:${filterHash}`;
};

// Build MongoDB match query for products
const buildProductMatchQuery = (companyId, filters) => {
  const matchQuery = {
    companyId,
    status: "active", // Only active products
  };

  if (filters.category && filters.category.length > 0) {
    matchQuery.category = {
      $in: filters.category.map((c) => c.toLowerCase()),
    };
  }

  if (filters.subCategory && filters.subCategory.length > 0) {
    matchQuery.subCategory = {
      $in: filters.subCategory.map((c) => c.toLowerCase()),
    };
  }

  if (filters.grade && filters.grade.length > 0) {
    matchQuery.grade = {
      $in: filters.grade, // A, B, C
    };
  }

  if (filters.color) {
    // Case-insensitive partial match
    matchQuery.color = new RegExp(filters.color, "i");
  }

  if (filters.origin) {
    // Case-insensitive partial match
    matchQuery.origin = new RegExp(filters.origin, "i");
  }

  if (filters.priceMin || filters.priceMax) {
    matchQuery.pricePerUnit = {};
    if (filters.priceMin) {
      matchQuery.pricePerUnit.$gte = parseFloat(filters.priceMin);
    }
    if (filters.priceMax) {
      matchQuery.pricePerUnit.$lte = parseFloat(filters.priceMax);
    }
  }

  if (filters.newArrivals) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    matchQuery.createdAt = { $gte: sevenDaysAgo };
  }

  return matchQuery;
};

// Cache invalidation helper for products
export const invalidateCompanyProductCache = async (companyId) => {
  try {
    const keys = [];
    const pattern = companyId
      ? `company:${companyId}:products:*`
      : "company:*:products:*";

    for await (const key of redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info("Company products cache invalidated", {
        companyId,
        keysDeleted: keys.length,
      });
    }
  } catch (error) {
    logger.error("Products cache invalidation error", {
      companyId,
      error: error.message,
    });
  }
};
