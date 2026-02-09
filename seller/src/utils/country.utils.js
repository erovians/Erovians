import axios from "axios";

// ======================== COUNTRY CONFIGS ========================
const BUSINESS_ID_CONFIGS = {
  IN: {
    label: "GSTIN",
    placeholder: "00AAAAA0000A0Z0 (15 characters)",
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    errorMessage:
      "Invalid GSTIN format. Must be 15 characters (e.g., 27AAPFU0939F1ZV)",
    example: "27AAPFU0939F1ZV",
  },
  US: {
    label: "EIN (Employer Identification Number)",
    placeholder: "XX-XXXXXXX (9 digits)",
    pattern: /^\d{2}-?\d{7}$/,
    errorMessage: "Invalid EIN format. Must be XX-XXXXXXX (e.g., 12-3456789)",
    example: "12-3456789",
  },
  GB: {
    label: "VAT Number",
    placeholder: "GB000000000 (9-12 digits)",
    pattern: /^GB\d{9,12}$/,
    errorMessage:
      "Invalid UK VAT format. Must be GB + 9-12 digits (e.g., GB123456789)",
    example: "GB123456789",
  },
  DE: {
    label: "VAT Number (Umsatzsteuer-ID)",
    placeholder: "DE000000000 (9 digits)",
    pattern: /^DE\d{9}$/,
    errorMessage:
      "Invalid German VAT format. Must be DE + 9 digits (e.g., DE123456789)",
    example: "DE123456789",
  },
  FR: {
    label: "SIRET Number",
    placeholder: "00000000000000 (14 digits)",
    pattern: /^\d{14}$/,
    errorMessage:
      "Invalid SIRET format. Must be 14 digits (e.g., 12345678901234)",
    example: "12345678901234",
  },
  AE: {
    label: "TRN (Tax Registration Number)",
    placeholder: "000000000000000 (15 digits)",
    pattern: /^\d{15}$/,
    errorMessage:
      "Invalid TRN format. Must be 15 digits (e.g., 123456789012345)",
    example: "123456789012345",
  },
  AU: {
    label: "ABN (Australian Business Number)",
    placeholder: "00000000000 (11 digits)",
    pattern: /^\d{11}$/,
    errorMessage: "Invalid ABN format. Must be 11 digits (e.g., 12345678901)",
    example: "12345678901",
  },
  CA: {
    label: "BN (Business Number)",
    placeholder: "000000000 (9 digits)",
    pattern: /^\d{9}$/,
    errorMessage: "Invalid BN format. Must be 9 digits (e.g., 123456789)",
    example: "123456789",
  },
};

// ======================== DETECT USER COUNTRY ========================
export const detectUserCountry = async () => {
  try {
    // Check localStorage cache (24hr validity)
    const cached = localStorage.getItem("detectedCountry");
    const cachedTime = localStorage.getItem("detectedCountryTime");

    if (cached && cachedTime) {
      const hoursPassed =
        (Date.now() - parseInt(cachedTime)) / (1000 * 60 * 60);
      if (hoursPassed < 24) {
        return cached;
      }
    }

    // Fetch from ipapi.co
    const response = await axios.get("https://ipapi.co/json/", {
      timeout: 5000,
    });

    const countryCode = response.data.country_code || "IN";

    // Cache for 24 hours
    localStorage.setItem("detectedCountry", countryCode);
    localStorage.setItem("detectedCountryTime", Date.now().toString());

    return countryCode;
  } catch (error) {
    console.error("Country detection failed:", error);

    // Fallback: Check cached even if expired
    const fallback = localStorage.getItem("detectedCountry") || "IN";
    return fallback;
  }
};

// ======================== GET BUSINESS ID CONFIG ========================
export const getBusinessIdConfig = (countryCode) => {
  const config = BUSINESS_ID_CONFIGS[countryCode];

  if (!config) {
    // Default config for unsupported countries
    return {
      label: "Business Registration Number",
      placeholder: "Enter your business registration number",
      pattern: /^.{5,20}$/,
      errorMessage: "Business ID must be between 5-20 characters",
      example: "ABC123456",
    };
  }

  return config;
};

// ======================== VALIDATE BUSINESS ID ========================
export const validateBusinessIdByCountry = (value, countryCode) => {
  if (!value) {
    return "Business ID is required for professional sellers";
  }

  const config = getBusinessIdConfig(countryCode);

  if (!config.pattern.test(value)) {
    return config.errorMessage;
  }

  return "";
};

// ======================== GET SUPPORTED COUNTRIES ========================
export const getSupportedCountries = () => {
  return Object.keys(BUSINESS_ID_CONFIGS);
};

// ======================== IS COUNTRY SUPPORTED ========================
export const isCountrySupported = (countryCode) => {
  return BUSINESS_ID_CONFIGS.hasOwnProperty(countryCode);
};
