import logger from "../../config/winston.js";

export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // ✅ Log error creation
    logger.error("AppError thrown", {
      message,
      statusCode,
      stack: this.stack,
    });

    Error.captureStackTrace(this, this.constructor);
  }
}
