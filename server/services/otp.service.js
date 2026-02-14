import redisClient from "../utils/redis.utils.js";
import logger from "../config/winston.js";
import crypto from "crypto";

const OTP_EXPIRY = 10 * 60; // 10 minutes
const OTP_COOLDOWN = 60; // 60 seconds
const MAX_OTP_ATTEMPTS = 5; // Max 5 OTP requests per hour
const VERIFIED_EXPIRY = 30 * 60; // 30 minutes after verification

// ======================== GENERATE OTP ========================
export const generateOTP = () => {
  const buffer = crypto.randomBytes(3);
  const number = parseInt(buffer.toString("hex"), 16);
  const otp = (number % 900000) + 100000;
  return otp.toString();
};

// ======================== STORE OTP IN REDIS ========================
export const storeOTP = async (identifier, otp) => {
  const key = `otp:${identifier}`;
  const cooldownKey = `otp:cooldown:${identifier}`;
  const attemptKey = `otp:attempts:${identifier}`;

  try {
    // Check cooldown
    const cooldown = await redisClient.get(cooldownKey);
    if (cooldown) {
      return {
        success: false,
        message: "Please wait 60 seconds before requesting new OTP",
      };
    }

    // Check rate limit
    const attempts = await redisClient.get(attemptKey);
    if (attempts && parseInt(attempts) >= MAX_OTP_ATTEMPTS) {
      return {
        success: false,
        message: "Too many OTP requests. Please try after 1 hour",
      };
    }

    // Store OTP with 10 min expiry
    await redisClient.setEx(key, OTP_EXPIRY, otp);

    // Set cooldown (60 seconds)
    await redisClient.setEx(cooldownKey, OTP_COOLDOWN, "1");

    // Increment attempts counter (1 hour TTL)
    if (!attempts) {
      await redisClient.setEx(attemptKey, 3600, "1");
    } else {
      await redisClient.incr(attemptKey);
    }

    logger.info("OTP stored in Redis", { identifier });

    return { success: true, expiresIn: OTP_EXPIRY };
  } catch (error) {
    logger.error("Failed to store OTP in Redis", {
      error: error.message,
      identifier,
    });
    throw error;
  }
};

// ======================== VERIFY OTP FROM REDIS ========================
export const verifyOTP = async (identifier, inputOTP) => {
  const key = `otp:${identifier}`;
  const verifiedKey = `verified:${identifier}`;

  try {
    const storedOTP = await redisClient.get(key);

    if (!storedOTP) {
      return {
        valid: false,
        message: "OTP expired or not found. Please request a new one",
      };
    }

    if (storedOTP !== inputOTP) {
      return { valid: false, message: "Invalid OTP" };
    }

    // Delete OTP after successful verification
    await redisClient.del(key);

    // Mark as verified for 30 minutes (for registration completion)
    await redisClient.setEx(verifiedKey, VERIFIED_EXPIRY, "1");

    logger.info("OTP verified successfully", { identifier });

    return { valid: true, message: "OTP verified successfully" };
  } catch (error) {
    logger.error("Failed to verify OTP from Redis", {
      error: error.message,
      identifier,
    });
    throw error;
  }
};

// ======================== CHECK IF VERIFIED ========================
export const isVerified = async (identifier) => {
  const verifiedKey = `verified:${identifier}`;
  try {
    const verified = await redisClient.get(verifiedKey);
    return !!verified;
  } catch (error) {
    logger.error("Failed to check verification status", {
      error: error.message,
      identifier,
    });
    return false;
  }
};

// ======================== MARK AS REGISTERED (DELETE VERIFIED FLAG) ========================
export const markAsRegistered = async (identifier) => {
  const verifiedKey = `verified:${identifier}`;
  try {
    await redisClient.del(verifiedKey);
    logger.info("Marked as registered, verification flag deleted", {
      identifier,
    });
  } catch (error) {
    logger.error("Failed to delete verification flag", {
      error: error.message,
      identifier,
    });
  }
};

// ======================== DELETE OTP ========================
export const deleteOTP = async (identifier) => {
  const key = `otp:${identifier}`;
  try {
    await redisClient.del(key);
    logger.info("OTP deleted from Redis", { identifier });
  } catch (error) {
    logger.error("Failed to delete OTP from Redis", {
      error: error.message,
      identifier,
    });
  }
};
