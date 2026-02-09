import { getCountryFromIP } from "../../utils/buyer/country.utils.js";
import logger from "../../config/winston.js";

// ======================== DETECT COUNTRY FROM IP ========================
export const detectCountryFromIP = (req, res, next) => {
  try {
    // Get IP from various possible headers (for proxy/nginx)
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;

    const detectedCountry = getCountryFromIP(ip);

    req.detectedCountry = detectedCountry;

    logger.info("Country detected from IP", {
      ip,
      country: detectedCountry,
      path: req.path,
    });

    next();
  } catch (error) {
    logger.error("GeoIP middleware error", { error: error.message });
    // Don't fail the request, just set default
    req.detectedCountry = "IN";
    next();
  }
};
