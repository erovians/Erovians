import mongoose from "mongoose";
import Product from "../../models/product.model.js";
import redisClient from "../../utils/redis.utils.js";
import logger from "../../config/winston.js";

export const getProductDetailService = async (productId) => {
  try {
    // Generate cache key
    const cacheKey = `product:${productId}:detail`;

    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("Cache HIT for product detail", { cacheKey, productId });

      // Increment views asynchronously (don't block response)
      incrementProductViews(productId).catch((err) =>
        logger.error("Failed to increment views", {
          productId,
          error: err.message,
        })
      );

      return JSON.parse(cached);
    }

    logger.info("Cache MISS - Fetching product detail from DB", {
      cacheKey,
      productId,
    });

    // Fetch product with aggregation (joins Company + Seller in one query)
    const result = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(productId),
          status: "active", // Only active products
        },
      },
      // Lookup Company
      {
        $lookup: {
          from: "companies", // Collection name in MongoDB
          localField: "companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: false, // Product must have a company
        },
      },
      // Lookup Seller
      {
        $lookup: {
          from: "sellers", // Collection name in MongoDB
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
        },
      },
      {
        $unwind: {
          path: "$seller",
          preserveNullAndEmptyArrays: false, // Product must have a seller
        },
      },
      // Project only required fields
      {
        $project: {
          // Product fields
          product: {
            _id: "$_id",
            productName: "$productName",
            productImages: "$productImages",
            category: "$category",
            subCategory: "$subCategory",
            grade: "$grade",
            color: "$color",
            origin: "$origin",
            size: "$size",
            weight: "$weight",
            weightMeasurement: "$weightMeasurement",
            pricePerUnit: "$pricePerUnit",
            priceUnit: "$priceUnit",
            description: "$description",
            views: "$views",
            status: "$status",
            createdAt: "$createdAt",
          },
          // Company fields
          company: {
            _id: "$company._id",
            companyName: "$company.companyBasicInfo.companyName",
            address: "$company.companyBasicInfo.address",
            mainCategory: "$company.companyBasicInfo.mainCategory",
            subCategory: "$company.companyBasicInfo.subCategory",
            companyRegistrationYear:
              "$company.companyBasicInfo.companyRegistrationYear",
            logo: "$company.companyIntro.logo",
            companyPhotos: "$company.companyIntro.companyPhotos",
          },
          // Seller fields
          seller: {
            _id: "$seller._id",
            sellername: "$seller.sellername",
            companyregstartionlocation: "$seller.companyregstartionlocation",
            varificationStatus: "$seller.varificationStatus",
            seller_status: "$seller.seller_status",
          },
        },
      },
    ]);

    // Check if product exists
    if (!result || result.length === 0) {
      logger.warn("Product not found or inactive", { productId });
      return null;
    }

    const productDetail = result[0];

    // Cache for 15 minutes
    const ttl = 900; // 15 minutes
    await redisClient.setEx(cacheKey, ttl, JSON.stringify(productDetail));

    logger.info("Product detail cached successfully", {
      cacheKey,
      productId,
      ttl,
    });

    // Increment views asynchronously
    incrementProductViews(productId).catch((err) =>
      logger.error("Failed to increment views", {
        productId,
        error: err.message,
      })
    );

    return productDetail;
  } catch (error) {
    logger.error("getProductDetailService error", {
      productId,
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
    console.error("FULL ERROR:", error);
    throw error;
  }
};

// Helper: Increment product views (async, non-blocking)
const incrementProductViews = async (productId) => {
  try {
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { views: 1 } },
      { new: false } // Don't need updated doc
    );
    logger.info("Product views incremented", { productId });
  } catch (error) {
    // Don't throw - this is a background task
    logger.error("Error incrementing views", {
      productId,
      error: error.message,
    });
  }
};

// Cache invalidation helper for single product
export const invalidateProductDetailCache = async (productId) => {
  try {
    const cacheKey = `product:${productId}:detail`;
    const deleted = await redisClient.del(cacheKey);

    if (deleted) {
      logger.info("Product detail cache invalidated", { productId, cacheKey });
    }
  } catch (error) {
    logger.error("Product detail cache invalidation error", {
      productId,
      error: error.message,
    });
  }
};

// Invalidate all products of a company (when company/seller updates)
export const invalidateCompanyProductDetailsCache = async (companyId) => {
  try {
    // First, get all productIds for this company
    const products = await Product.find({ companyId }, { _id: 1 }).lean();

    const keys = products.map((p) => `product:${p._id}:detail`);

    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info("Company product details cache invalidated", {
        companyId,
        keysDeleted: keys.length,
      });
    }
  } catch (error) {
    logger.error("Company product details cache invalidation error", {
      companyId,
      error: error.message,
    });
  }
};
