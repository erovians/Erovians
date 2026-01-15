import AppError from "../../utils/buyer/AppError.js";
import logger from "../../config/winston.js";

const globalErrorHandler = (err, req, res, next) => {
  // Set default error status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  let error = { ...err };
  error.message = message;

  // ✅ Log the original error
  logger.error(`Error occurred: ${err.message}`, {
    statusCode,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Handle MongoDB CastError (Invalid ID format)
  if (err.name === "CastError") {
    error = new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
    logger.warn(`CastError: Invalid ${err.path} - ${err.value}`);
  }

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = value
      ? `Duplicate value '${value}' found for field '${field}'. Please use a different value.`
      : `Duplicate value found for field '${field}'. Please provide a valid value.`;

    error = new AppError(message, 400);
    logger.warn(`Duplicate Key Error: ${field} = ${value}`);
  }

  // Handle Invalid JWT (JSON Web Token) Error
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again.", 401);
    logger.warn("Invalid JWT token attempt");
  }

  // Handle Expired JWT Error
  if (err.name === "TokenExpiredError") {
    error = new AppError("Your token has expired. Please log in again.", 401);
    logger.warn("Expired JWT token attempt");
  }

  // Handle Unauthorized User Error
  if (err.name === "UserNotAuthorized") {
    error = new AppError("You are not authorized to perform this action.", 403);
    logger.warn("Unauthorized access attempt", { path: req.originalUrl });
  }

  // Send error response
  res.status(error.statusCode || statusCode).json({
    success: false,
    message: error.message || message,
    error,
  });
};

export default globalErrorHandler;
