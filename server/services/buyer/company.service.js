import CompanyDetails from "../../models/company.model.js";
import Seller from "../../models/sellerSingnup.model.js";
import User from "../../models/user.model.js";
import logger from "../../config/winston.js";

export const getCompaniesListService = async ({ filters, page, limit }) => {
  try {
    logger.info("Fetching companies from database", { filters, page, limit });

    // Build MongoDB query (filters are now optional)
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

    // ✅ Populate seller data with userId
    const sellerIds = companies.map((c) => c.sellerId);
    const sellers = await Seller.find({ _id: { $in: sellerIds } })
      .select(
        "userId businessName companyregstartionlocation varificationStatus seller_status"
      )
      .lean();

    // ✅ Get all user IDs from sellers
    const userIds = sellers.map((s) => s.userId);
    const users = await User.find({ _id: { $in: userIds } })
      .select("name email")
      .lean();

    // ✅ Create user map for quick lookup
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    // ✅ Create seller map with user data
    const sellerMap = sellers.reduce((acc, seller) => {
      const user = userMap[seller.userId.toString()];
      acc[seller._id.toString()] = {
        ...seller,
        sellername: user ? user.name : "Unknown", // ✅ User ka naam as sellername
        email: user ? user.email : null,
      };
      return acc;
    }, {});

    // Merge company + seller data
    const result = companies.map((company) => ({
      _id: company._id,
      companyBasicInfo: company.companyBasicInfo,
      companyIntro: company.companyIntro
        ? {
            logo: company.companyIntro.logo || null,
            companyPhotos: company.companyIntro.companyPhotos || [],
          }
        : { logo: null, companyPhotos: [] }, // ✅ Default value agar companyIntro hi nahi hai
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

    logger.info("Companies fetched successfully from database", {
      totalCompanies,
      page,
      limit,
    });

    return response;
  } catch (error) {
    logger.error("getCompaniesListService error", {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
    console.error("FULL ERROR:", error);
    throw error;
  }
};

// Build MongoDB match query (handles empty filters gracefully)
const buildMatchQuery = (filters) => {
  const matchQuery = {};

  // Agar filters object hi nahi hai ya empty hai, toh empty query return hogi
  // Iska matlab ALL companies fetch hongi
  if (!filters || Object.keys(filters).length === 0) {
    return matchQuery; // Empty query = fetch all
  }

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
