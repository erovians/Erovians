// utils/sendToken.js
import logger from "../../config/winston.js";

const sendToken = (user, statusCode, res, message = "Success") => {
  // Generate tokens
  const accessToken = user.getAccessToken();
  const refreshToken = user.getRefreshToken();

  // Cookie options
  const accessTokenOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_ACCESS_COOKIE_EXPIRES_IN || 15) * 60 * 1000 // 15 minutes default
    ),
    httpOnly: true,
  };

  const refreshTokenOptions = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_REFRESH_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000 // 7 days default
    ),
    httpOnly: true,
  };

  // Update last login
  user.updateLastLogin();

  // Log successful token generation
  logger.info("Tokens generated successfully", {
    userId: user._id,
    email: user.email,
    mobile: user.mobile,
  });

  // Set cookies
  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  // Send response
  res.status(statusCode).json({
    success: true,
    message,
    data: user.toSafeObject(),
    accessToken, // Also send in response body for mobile apps
    refreshToken, // Also send in response body for mobile apps
  });
};

export default sendToken;
