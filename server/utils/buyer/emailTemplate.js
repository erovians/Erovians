// utils/emailTemplates.js

export const getOTPEmailTemplate = (otp, purpose = "verification") => {
  const purposeText = {
    login: "Login",
    register: "Registration",
    forgot_password: "Password Reset",
    device_verification: "Device Verification",
    verification: "Verification",
  };

  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: #ffffff; 
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header { 
            text-align: center; 
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
          }
          .header h1 {
            color: #1a1a1a;
            margin: 0;
            font-size: 24px;
          }
          .content { 
            padding: 30px 0; 
            text-align: center;
          }
          .otp-box { 
            background: #f8f9fa; 
            padding: 20px; 
            margin: 20px 0;
            border-radius: 8px;
            border: 2px dashed #ddd;
          }
          .otp-code { 
            font-size: 32px; 
            font-weight: bold; 
            color: #1a1a1a; 
            letter-spacing: 8px;
            margin: 10px 0;
          }
          .warning { 
            color: #666; 
            font-size: 14px; 
            margin-top: 20px;
            padding: 15px;
            background: #fff3cd;
            border-radius: 4px;
          }
          .footer { 
            text-align: center; 
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            color: #999; 
            font-size: 12px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your OTP Code</h1>
          </div>
          
          <div class="content">
            <p>Hello,</p>
            <p>You requested an OTP for <strong>${
              purposeText[purpose] || "Verification"
            }</strong>.</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #666; font-size: 14px;">Valid for 30 minutes</p>
            </div>
            
            <p>If you didn't request this code, please ignore this email.</p>
            
            <div class="warning">
              <strong>⚠️ Security Warning:</strong><br>
              Never share this OTP with anyone. Our team will never ask for your OTP.
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};
