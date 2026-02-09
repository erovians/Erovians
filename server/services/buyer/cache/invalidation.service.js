import redisClient from "../../../utils/redis.utils.js";
import logger from "../../../config/winston.js";

// ✅ Invalidate ALL company-related caches
export const invalidateAllCompanyCaches = async (companyId = null) => {
  try {
    const patterns = companyId
      ? [
          `companies:list:*`, // List cache
          `company:${companyId}:*`, // Specific company
        ]
      : [`companies:list:*`]; // All lists

    let totalDeleted = 0;

    for (const pattern of patterns) {
      const keys = [];
      for await (const key of redisClient.scanIterator({
        MATCH: pattern,
        COUNT: 100,
      })) {
        keys.push(key);
      }

      if (keys.length > 0) {
        await redisClient.del(keys);
        totalDeleted += keys.length;
      }
    }

    logger.info("Company caches invalidated", {
      companyId,
      keysDeleted: totalDeleted,
    });

    return totalDeleted;
  } catch (error) {
    logger.error("Company cache invalidation error", {
      companyId,
      error: error.message,
    });
    return 0;
  }
};

// ✅ Invalidate product caches
export const invalidateProductCaches = async (companyId, productId = null) => {
  try {
    const patterns = [];

    if (productId) {
      patterns.push(`product:${productId}:*`); // Specific product
    }

    if (companyId) {
      patterns.push(`company:${companyId}:products:*`); // Company products list
    }

    let totalDeleted = 0;

    for (const pattern of patterns) {
      const keys = [];
      for await (const key of redisClient.scanIterator({
        MATCH: pattern,
        COUNT: 100,
      })) {
        keys.push(key);
      }

      if (keys.length > 0) {
        await redisClient.del(keys);
        totalDeleted += keys.length;
      }
    }

    logger.info("Product caches invalidated", {
      companyId,
      productId,
      keysDeleted: totalDeleted,
    });

    return totalDeleted;
  } catch (error) {
    logger.error("Product cache invalidation error", {
      companyId,
      productId,
      error: error.message,
    });
    return 0;
  }
};

// ✅ Invalidate seller approval cache (when admin approves/rejects)
export const invalidateSellerApprovalCache = async () => {
  try {
    await invalidateAllCompanyCaches(); // Clear all company lists
    logger.info("Seller approval cache invalidated");
  } catch (error) {
    logger.error("Seller approval cache invalidation error", {
      error: error.message,
    });
  }
};

// ✅ Clear everything (use carefully - only for testing/admin)
export const flushAllCache = async () => {
  try {
    await redisClient.flushAll();
    logger.warn("🔥 ALL REDIS CACHE FLUSHED");
    return true;
  } catch (error) {
    logger.error("Cache flush error", { error: error.message });
    return false;
  }
};
