import Brevo from "@getbrevo/brevo";
import logger from "../../config/winston.js";

const sendMail = async (options) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.message;
    sendSmtpEmail.sender = {
      name: process.env.SMTP_NAME,
      email: process.env.SMTP_USER,
    };
    sendSmtpEmail.to = [{ email: options.email }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    logger.info("Email sent successfully", {
      to: options.email,
      subject: options.subject,
      sender: process.env.SMTP_USER,
    });
  } catch (error) {
    logger.error("Email sending failed", {
      to: options.email,
      subject: options.subject,
      error: error.message,
      errorCode: error.response?.body?.code,
      stack: error.stack,
    });

    throw error;
  }
};

export default sendMail;
