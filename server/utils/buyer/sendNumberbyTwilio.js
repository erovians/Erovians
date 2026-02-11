// utils/twilioClient.js
import twilio from "twilio";
import logger from "../../config/winston.js";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER; // ⚠️ Ye add karna padega .env mein

const client = twilio(accountSid, authToken);

export const sendSMS = async (to, message) => {
  try {
    logger.info("Attempting to send SMS", { to });

    const sms = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to, // format: +919876543210
    });

    logger.info("SMS sent successfully", {
      sid: sms.sid,
      status: sms.status,
    });

    return {
      success: true,
      sid: sms.sid,
      status: sms.status,
    };
  } catch (error) {
    console.log(error);
    logger.error("Error sending SMS", {
      error: error.message,
      to,
    });

    return {
      success: false,
      message: error.message,
    };
  }
};

// Helper function - OTP SMS template
export const sendOTPSMS = async (mobile, otp) => {
  const message = `Your OTP is: ${otp}. Valid for 30 minutes. Do not share this with anyone.`;
  return await sendSMS(mobile, message);
};
