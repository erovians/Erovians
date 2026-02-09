import crypto from "crypto";
import CompanyDetails from "../../models/company.model.js";
import Seller from "../../models/sellerSingnup.model.js";
import User from "../../models/user.model.js";
import redisClient from "../../utils/redis.utils.js";
import logger from "../../config/winston.js";

export const getCompaniesListService = async ({ filters, page, limit }) => {
  try {
    // Generate cache key
    const cacheKey = generateCompanyCacheKey(page, limit, filters);

    // ✅ Step 1: Check Redis cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info("Cache HIT - Companies", { cacheKey });
      return JSON.parse(cached);
    }

    logger.info("Cache MISS - Fetching from DB", { cacheKey });

    // ✅ Step 2: Build query & fetch from DB
    const matchQuery = buildMatchQuery(filters);
    const skip = (page - 1) * limit;

    const companies = await CompanyDetails.find(matchQuery)
      .select(
        "companyBasicInfo.companyName companyBasicInfo.address companyBasicInfo.mainCategory companyBasicInfo.subCategory companyBasicInfo.companyRegistrationYear companyIntro.logo companyIntro.companyPhotos sellerId"
      )
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCompanies = await CompanyDetails.countDocuments(matchQuery);

    // ✅ Step 3: Get ONLY APPROVED sellers
    const sellerIds = companies.map((c) => c.sellerId);
    const sellers = await Seller.find({
      _id: { $in: sellerIds },
      varificationStatus: "Approved", // ✅ Only approved
      status: "active", // ✅ Only active
    })
      .select("userId seller_name seller_status varificationStatus")
      .lean();

    // ✅ Step 4: Get user details
    const userIds = sellers.map((s) => s.userId);
    const users = await User.find({ _id: { $in: userIds } })
      .select("name email")
      .lean();

    // ✅ Step 5: Create maps
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    const sellerMap = sellers.reduce((acc, seller) => {
      const user = userMap[seller.userId.toString()];
      acc[seller._id.toString()] = {
        _id: seller._id,
        sellername: user?.name || "Unknown",
        email: user?.email || null,
        seller_status: seller.seller_status,
        varificationStatus: seller.varificationStatus,
      };
      return acc;
    }, {});

    // ✅ Step 6: Filter - Only companies with approved sellers
    const result = companies
      .filter((company) => sellerMap[company.sellerId.toString()])
      .map((company) => ({
        _id: company._id,
        companyBasicInfo: company.companyBasicInfo,
        companyIntro: company.companyIntro
          ? {
              logo: company.companyIntro.logo || null,
              companyPhotos: company.companyIntro.companyPhotos || [],
            }
          : { logo: null, companyPhotos: [] },
        seller: sellerMap[company.sellerId.toString()],
      }));

    // ✅ Step 7: Prepare response
    const response = {
      companies: result,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(result.length / limit),
        totalCompanies: result.length,
        limit,
      },
    };

    // ✅ Step 8: Store in Redis
    const ttl = filters?.newArrivals ? 600 : 1800; // 10 min for new, 30 min normal
    await redisClient.setEx(cacheKey, ttl, JSON.stringify(response));

    logger.info("Companies cached", { cacheKey, ttl, count: result.length });

    return response;
  } catch (error) {
    logger.error("getCompaniesListService error", {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

// ✅ Generate unique cache key
const generateCompanyCacheKey = (page, limit, filters) => {
  const sortedFilters = Object.keys(filters || {})
    .sort()
    .reduce((acc, key) => {
      acc[key] = filters[key];
      return acc;
    }, {});

  const filterHash = crypto
    .createHash("md5")
    .update(JSON.stringify(sortedFilters))
    .digest("hex")
    .substring(0, 8);

  return `companies:list:page:${page}:limit:${limit}:filters:${filterHash}`;
};

// ✅ Build MongoDB query
const buildMatchQuery = (filters) => {
  const matchQuery = {};

  if (!filters || Object.keys(filters).length === 0) {
    return matchQuery;
  }

  if (filters.mainCategory?.length > 0) {
    matchQuery["companyBasicInfo.mainCategory"] = {
      $in: filters.mainCategory.map((c) => c.toLowerCase()),
    };
  }

  if (filters.subCategory?.length > 0) {
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

  if (filters.paymentMethods?.length > 0) {
    matchQuery["companyBasicInfo.acceptedPaymentType"] = {
      $in: filters.paymentMethods,
    };
  }

  if (filters.currency?.length > 0) {
    matchQuery["companyBasicInfo.acceptedCurrency"] = {
      $in: filters.currency,
    };
  }

  if (filters.language?.length > 0) {
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
