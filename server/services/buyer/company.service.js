import crypto from "crypto";
import CompanyDetails from "../../models/company.model.js";
import Seller from "../../models/sellerSingnup.model.js";
import redisClient from "../../utils/redis.utils.js";
import logger from "../../config/winston.js";

export const getCompaniesListService = async ({ filters, page, limit }) => {
  try {
    // Generate cache key with hash
    const cacheKey = generateCacheKey(filters, page, limit);

    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("Cache HIT for companies list", { cacheKey });
      return JSON.parse(cached);
    }

    logger.info("Cache MISS - Fetching from DB", { cacheKey });

    // Build MongoDB query
    const matchQuery = buildMatchQuery(filters);

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch companies with pagination
    const companies = await CompanyDetails.find(matchQuery)
      .select(
        "companyBasicInfo.companyName companyBasicInfo.address companyBasicInfo.mainCategory companyBasicInfo.subCategory companyBasicInfo.companyRegistrationYear companyIntro.logo companyIntro.companyPhotos sellerId"
      )
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCompanies = await CompanyDetails.countDocuments(matchQuery);

    // Populate seller data manually (better control)
    const sellerIds = companies.map((c) => c.sellerId);
    const sellers = await Seller.find({ _id: { $in: sellerIds } })
      .select(
        "sellername companyregstartionlocation varificationStatus seller_status"
      )
      .lean();

    // Create seller map for quick lookup
    const sellerMap = sellers.reduce((acc, seller) => {
      acc[seller._id.toString()] = seller;
      return acc;
    }, {});

    // Merge company + seller data
    const result = companies.map((company) => ({
      _id: company._id,
      companyBasicInfo: company.companyBasicInfo,
      companyIntro: {
        logo: company.companyIntro.logo,
        companyPhotos: company.companyIntro.companyPhotos,
      },
      seller: sellerMap[company.sellerId.toString()] || null,
    }));

    // Prepare response
    const response = {
      companies: result,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCompanies / limit),
        totalCompanies,
        limit,
      },
    };

    // Cache for 30 minutes (or 10 mins for newArrivals)
    const ttl = filters.newArrivals ? 600 : 1800;
    await redisClient.setEx(cacheKey, ttl, JSON.stringify(response));

    logger.info("Data cached successfully", { cacheKey, ttl });

    return response;
  } catch (error) {
    logger.error("getCompaniesListService error", {
      error: error.message,
      stack: error.stack, // ✅ Add this
      name: error.name,
    });
    console.error("FULL ERROR:", error);
    throw error;
  }
};

// Generate cache key with hash
const generateCacheKey = (filters, page, limit) => {
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

  return `companies:list:page:${page}:limit:${limit}:filters:${filterHash}`;
};

// Build MongoDB match query
const buildMatchQuery = (filters) => {
  const matchQuery = {};

  if (filters.mainCategory && filters.mainCategory.length > 0) {
    matchQuery["companyBasicInfo.mainCategory"] = {
      $in: filters.mainCategory.map((c) => c.toLowerCase()),
    };
  }

  if (filters.subCategory && filters.subCategory.length > 0) {
    matchQuery["companyBasicInfo.subCategory"] = {
      $in: filters.subCategory.map((c) => c.toLowerCase()),
    };
  }

  if (filters.country) {
    matchQuery["companyBasicInfo.address.countryOrRegion"] = filters.country;
  }

  if (filters.state) {
    matchQuery["companyBasicInfo.address.stateOrProvince"] = filters.state;
  }

  if (filters.city) {
    matchQuery["companyBasicInfo.address.city"] = filters.city;
  }

  if (filters.yearFrom || filters.yearTo) {
    matchQuery["companyBasicInfo.companyRegistrationYear"] = {};
    if (filters.yearFrom) {
      matchQuery["companyBasicInfo.companyRegistrationYear"].$gte =
        filters.yearFrom.toString();
    }
    if (filters.yearTo) {
      matchQuery["companyBasicInfo.companyRegistrationYear"].$lte =
        filters.yearTo.toString();
    }
  }

  if (filters.paymentMethods && filters.paymentMethods.length > 0) {
    matchQuery["companyBasicInfo.acceptedPaymentType"] = {
      $in: filters.paymentMethods,
    };
  }

  if (filters.currency && filters.currency.length > 0) {
    matchQuery["companyBasicInfo.acceptedCurrency"] = {
      $in: filters.currency,
    };
  }

  if (filters.language && filters.language.length > 0) {
    matchQuery["companyBasicInfo.languageSpoken"] = {
      $in: filters.language,
    };
  }

  if (filters.newArrivals) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    matchQuery.createdAt = { $gte: sevenDaysAgo };
  }

  return matchQuery;
};

// Cache invalidation helper (call this when company is updated)
export const invalidateCompanyListCache = async () => {
  try {
    const keys = [];
    for await (const key of redisClient.scanIterator({
      MATCH: "companies:list:*",
      COUNT: 100,
    })) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await redisClient.del(keys); // del() same hai
      logger.info("Company list cache invalidated", {
        keysDeleted: keys.length,
      });
    }
  } catch (error) {
    logger.error("Cache invalidation error", { error: error.message });
  }
};
