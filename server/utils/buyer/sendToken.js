import logger from "../../config/winston.js";

const sendToken = async (user, statusCode, res, message = "Success") => {
  // Generate tokens
  const accessToken = user.getAccessToken();
  const refreshToken = user.getRefreshToken();

  // Cookie options
  const accessTokenOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_ACCESS_COOKIE_EXPIRES_IN || 15) * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  const refreshTokenOptions = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_REFRESH_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // ✅ FIX: Await updateLastLogin
  await user.updateLastLogin();

  logger.info("Tokens generated successfully", {
    userId: user._id,
    email: user.email,
    mobile: user.mobile,
  });

  // Set cookies
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  // Send response
  res.status(statusCode).json({
    success: true,
    message,
    data: user.toSafeObject(),
    accessToken,
  });
};

export default sendToken;
