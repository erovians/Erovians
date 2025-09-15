// otp.controller.js
import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Temporary in-memory store (better: use Redis for production)
const otpStore = {};

export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: "Mobile is required" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send SMS using Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobile}`, // Add country code
    });

    // Store OTP temporarily (valid for 5 min)
    otpStore[mobile] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = (req, res) => {
  const { mobile, otp } = req.body;

  const record = otpStore[mobile];
  if (!record) return res.status(400).json({ message: "OTP not sent" });

  if (record.expiresAt < Date.now()) {
    delete otpStore[mobile];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  // OTP verified successfully
  delete otpStore[mobile];
  res.status(200).json({ message: "Mobile verified successfully" });
};
