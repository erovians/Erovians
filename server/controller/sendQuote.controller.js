import nodemailer from "nodemailer";
import Partner from "../models/partner.model.js";
import axios from "axios";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const sendQuote = async (req, res) => {
  try {
    const { partner: partnerName, quote } = req.body;
    const partner = await Partner.findOne({ name: partnerName }).lean();
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    if (partner.webhook_url) {
      await axios.post(partner.webhook_url, { quote, partner: partnerName });
      return res.json({ sent: true, via: "webhook" });
    }

    if (!partner.email)
      return res
        .status(400)
        .json({ message: "Partner webhook or email not configured" });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: partner.email,
      subject: `New Quote from ${quote.sender || "Your Company"}`,
      text: `Quote details:\n${JSON.stringify(quote, null, 2)}`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ sent: true, via: "email" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
