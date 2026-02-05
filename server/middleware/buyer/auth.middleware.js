import asyncHandler from "../buyer/asyncHandler.js";
import AppError from "../../utils/buyer/AppError.js";
import logger from "../../config/winston.js";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";

// authenticated middlewares
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    logger.warn("Access attempt without token", {
      path: req.originalUrl,
      ip: req.ip,
    });
    return next(new AppError("Access Token Required", 401));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    // ✅ Log successful authentication
    logger.info(`User authenticated: ${decoded.id}`, {
      path: req.originalUrl,
    });

    // Attach decoded user data to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.warn("Access token expired", { ip: req.ip });
      return next(new AppError("Access Token Expired", 401));
    }
    logger.warn("Invalid access token attempt", { ip: req.ip });
    return next(new AppError("Invalid Access Token", 401));
  }
});

//generate access token using refresh token
export const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      logger.warn("Refresh token missing", { ip: req.ip });
      return next(new AppError("Please login again", 401));
    }
    console.log(refreshToken);
    const decoded = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      logger.warn(`User not found for token refresh: ${decoded.id}`);
      return next(new AppError("User no longer exists", 401));
    }

    const accessToken = user.getAccessToken();

    logger.info(`Access token refreshed for user: ${user._id}`);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn("Invalid refresh token", { ip: req.ip });
      return next(new AppError("Invalid refresh token", 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn("Refresh token expired", { ip: req.ip });
      return next(new AppError("Refresh token has expired", 401));
    }

    logger.error("Token refresh failed", { error: error.message });
    return next(new AppError("Token refresh failed", 500));
  }
});

// roles middlewares
export const authorizeRoles = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    const userRoles = Array.isArray(req.user.role)
      ? req.user.role
      : [req.user.role];

    const isAllowed = userRoles.some((role) => allowedRoles.includes(role));

    if (!isAllowed) {
      return next(
        new AppError(`Role (${userRoles.join(", ")}) is not authorized`, 403)
      );
    }

    next();
  });
};

// ========================================
// OPTIONAL AUTHENTICATION MIDDLEWARE
// Attaches user to req if token exists, but doesn't fail if no token
// ========================================
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(); // Continue without user
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    // Token invalid or expired, continue without user
    next();
  }
});
