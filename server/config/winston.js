import winston from "winston";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
  quiet: true,
});

// ✅ Custom colors with background
const customColors = {
  error: "bold white redBG", // ✅ White text, red background
  warn: "bold black yellowBG", // ✅ Black text, yellow background
  info: "bold black cyanBG", // ✅ Black text, cyan background
  http: "bold white magentaBG", // ✅ White text, magenta background
};

winston.addColors(customColors);

// ✅ Console format (clean & readable) - Development ke liye
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "HH:mm:ss" }), // ✅ Sirf time
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`; // ✅ No JSON clutter
  })
);

// ✅ Production format (detailed with metadata) - Console ke liye bhi
const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += ` | ${JSON.stringify(meta)}`;
    }

    return log;
  })
);

// ✅ Transports array
const transports = [];

// ✅ Development: Clean colored console
if (process.env.NODE_ENV === "development") {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat, // ✅ Clean format with colors
    })
  );
}

// ✅ Production: Detailed console (Render logs automatically capture karega)
if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.Console({
      format: productionFormat, // ✅ Detailed format for debugging
    })
  );
}

// ✅ Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: transports,

  // ✅ Exception handlers - Console pe (file nahi)
  exceptionHandlers: [
    new winston.transports.Console({
      format: productionFormat,
    }),
  ],

  // ✅ Rejection handlers - Console pe (file nahi)
  rejectionHandlers: [
    new winston.transports.Console({
      format: productionFormat,
    }),
  ],

  exitOnError: false,
});

export default logger;
