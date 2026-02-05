export const getOTPEmailTemplate = (otp, purpose) => {
  const templates = {
    register: {
      title: "Welcome! Verify Your Email",
      message:
        "Thank you for registering with us. Use the OTP below to verify your email address:",
      note: "Complete your registration by verifying your email.",
    },
    login: {
      title: "Login Verification",
      message: "Use the OTP below to complete your login:",
      note: "For your security, never share this OTP with anyone.",
    },
    email_change: {
      // ✅ NEW
      title: "Verify Your New Email Address",
      message:
        "You requested to change your email address. Use the OTP below to verify your new email:",
      note: "If you didn't request this change, please ignore this email and your email will remain unchanged.",
    },
  };

  const template = templates[purpose] || templates.login;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          padding:1rem;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #003366 0%, #004080 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 30px 20px;
        }
        .otp-box {
          background: linear-gradient(135deg, #f4f4f4 0%, #e8e8e8 100%);
          padding: 25px;
          margin: 25px 0;
          text-align: center;
          border-radius: 8px;
          border: 2px dashed #003366;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #003366;
          font-family: 'Courier New', monospace;
        }
        .message {
          font-size: 16px;
          color: #555;
          margin-bottom: 20px;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .warning strong {
          color: #856404;
          display: block;
          margin-bottom: 5px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        .note {
          font-size: 14px;
          color: #666;
          font-style: italic;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${template.title}</h1>
        </div>
        <div class="content">
          <p class="message">${template.message}</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>

          <div class="warning">
            <strong>⏰ Expires in 10 minutes</strong>
            <p style="margin: 5px 0 0 0;">This OTP is valid for 10 minutes only. Please use it before it expires.</p>
          </div>

          <p class="note">${template.note}</p>

          <div class="footer">
            <p><strong>This is an automated email. Please do not reply.</strong></p>
            <p>If you need help, contact our support team.</p>
            <p style="margin-top: 10px; color: #999;">© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
