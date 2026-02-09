import geoip from "geoip-lite";

// ======================== BUSINESS ID CONFIGS ========================
const BUSINESS_ID_CONFIGS = {
  IN: {
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    message: "Invalid GSTIN format. Must be 15 characters",
  },
  US: {
    pattern: /^\d{2}-?\d{7}$/,
    message: "Invalid EIN format. Must be XX-XXXXXXX",
  },
  GB: {
    pattern: /^GB\d{9,12}$/,
    message: "Invalid UK VAT format. Must be GB + 9-12 digits",
  },
  DE: {
    pattern: /^DE\d{9}$/,
    message: "Invalid German VAT format. Must be DE + 9 digits",
  },
  FR: {
    pattern: /^\d{14}$/,
    message: "Invalid SIRET format. Must be 14 digits",
  },
  AE: {
    pattern: /^\d{15}$/,
    message: "Invalid TRN format. Must be 15 digits",
  },
  AU: {
    pattern: /^\d{11}$/,
    message: "Invalid ABN format. Must be 11 digits",
  },
  CA: {
    pattern: /^\d{9}$/,
    message: "Invalid BN format. Must be 9 digits",
  },
};

// ======================== VALIDATE BUSINESS ID BY COUNTRY ========================
export const validateBusinessIdByCountry = (businessId, country) => {
  if (!businessId) {
    return {
      isValid: false,
      message: "Business ID is required for professional sellers",
    };
  }

  const config = BUSINESS_ID_CONFIGS[country];

  if (!config) {
    // Unsupported country - basic validation
    if (businessId.length < 5 || businessId.length > 20) {
      return {
        isValid: false,
        message: "Business ID must be between 5-20 characters",
      };
    }
    return { isValid: true };
  }

  if (!config.pattern.test(businessId)) {
    return {
      isValid: false,
      message: config.message,
    };
  }

  return { isValid: true };
};

// ======================== GET COUNTRY FROM IP ========================
export const getCountryFromIP = (ip) => {
  try {
    // Handle localhost/development
    if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.includes("localhost")) {
      return "IN"; // Default to India in development
    }

    // Remove IPv6 prefix if present
    const cleanIP = ip.replace(/^::ffff:/, "");

    const geo = geoip.lookup(cleanIP);

    if (geo && geo.country) {
      return geo.country;
    }

    return "IN"; // Fallback to India
  } catch (error) {
    console.error("IP to country conversion failed:", error);
    return "IN";
  }
};

// ======================== IS COUNTRY SUPPORTED ========================
export const isCountrySupported = (country) => {
  return BUSINESS_ID_CONFIGS.hasOwnProperty(country);
};
