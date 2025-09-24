// otp.controller.js
import axios from "axios";
import qs from "qs";
import Seller from "../models/sellerSingnup.model.js";
import twilio from "twilio";

const TWILIO_ACCOUNT_SID = "AC01c46a6ae1ea755d36a017c380895612";
const TWILIO_AUTH_TOKEN = "ac18eab3e7de5ee4c611fd8a4df649d8";
const TWILIO_FROM_NUMBER = "+18723169588";

const TWILIO_API_URL = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOtp = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile)
    return res.status(400).json({ message: "Mobile number is required" });

  try {
    const seller = await Seller.findOne({ mobile });
    if (seller) {
      return res
        .status(409)
        .json({ message: "Mobile already exists" });
    } else {
      const otp = generateOTP();

      const data = {
        To: `+91${mobile}`, // assuming Indian numbers
        From: TWILIO_FROM_NUMBER,
        Body: `Your OTP is ${otp}`,
      };

      const response = await axios.post(TWILIO_API_URL, qs.stringify(data), {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // store OTP temporarily (better: use Redis or DB)
      global.otpStore = global.otpStore || {};
      global.otpStore[mobile] = otp;

      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully" });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp)
    return res.status(400).json({ message: "Mobile and OTP are required" });

  global.otpStore = global.otpStore || {};

  if (global.otpStore[mobile] && global.otpStore[mobile] === otp) {
    delete global.otpStore[mobile];

    global.verifiedMobiles = global.verifiedMobiles || {};
    global.verifiedMobiles[mobile] = true;

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  }

  return res
    .status(400)
    .json({ success: false, message: "Invalid or expired OTP" });
};
