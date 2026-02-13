import Seller from "../../models/sellerSingnup.model.js";
import Company from "../../models/company.model.js";
import sendEmailByBrevo from "../../utils/buyer/sendEmailByBrevo.js";

// ✅ Get all pending requests
export const getPendingRequests = async (req, res) => {
  try {
    // Get individual sellers (Pending)
    const individualSellers = await Seller.find({
      seller_status: "individual",
      varificationStatus: "Pending",
    }).populate("userId", "name email");

    // Get professional sellers with companies
    const professionalSellers = await Seller.find({
      seller_status: "professional",
      varificationStatus: "Pending",
    }).populate("userId", "name email");

    // Get companies for professional sellers
    const companiesWithSellers = await Promise.all(
      professionalSellers.map(async (seller) => {
        const company = await Company.findOne({ sellerId: seller._id });
        return {
          seller,
          company,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        individualSellers,
        professionalSellers: companiesWithSellers,
      },
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
};

// ✅ Approve Individual Seller
export const approveIndividualSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = id;

    const seller = await Seller.findById(sellerId).populate(
      "userId",
      "email name"
    );
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    // Update seller status
    seller.varificationStatus = "Approved";
    seller.status = "active";
    await seller.save();

    // Send email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <h2>Dear ${seller.seller_name},</h2>
            <p>We are pleased to inform you that your seller account has been <strong>approved</strong>!</p>
            <p>You can now start adding products to your store and begin selling.</p>
            <a href="${process.env.FRONTEND_URL}/seller/dashboard" class="button">Go to Dashboard</a>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br><strong>Erovians Admin Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2026 Erovians. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmailByBrevo({
      to: [{ email: seller.seller_email || seller.userId.email }],
      subject: "🎉 Your Seller Account Has Been Approved!",
      htmlContent: emailHtml,
    });

    res.status(200).json({
      success: true,
      message: "Seller approved and email sent",
      data: seller,
    });
  } catch (error) {
    console.error("Error approving seller:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Reject Individual Seller
export const rejectIndividualSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = id;
    const { reason } = req.body;

    const seller = await Seller.findById(sellerId).populate(
      "userId",
      "email name"
    );
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    // Update seller status
    seller.varificationStatus = "Rejected";
    seller.status = "inactive";
    await seller.save();

    // Send email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reason-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Application Rejected</h1>
          </div>
          <div class="content">
            <h2>Dear ${seller.seller_name},</h2>
            <p>We regret to inform you that your seller application has been <strong>rejected</strong>.</p>
            <div class="reason-box">
              <strong>Reason:</strong><br>
              ${reason || "Your application did not meet our requirements."}
            </div>
            <p>Please review the reason above and feel free to reapply with correct information.</p>
            <p>Best regards,<br><strong>Erovians Admin Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2026 Erovians. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmailByBrevo({
      to: [{ email: seller.seller_email || seller.userId.email }],
      subject: "❌ Your Seller Application Status",
      htmlContent: emailHtml,
    });

    res.status(200).json({
      success: true,
      message: "Seller rejected and email sent",
      data: seller,
    });
  } catch (error) {
    console.error("Error rejecting seller:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Suspend Seller
export const suspendSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = id;
    const { reason } = req.body;

    const seller = await Seller.findById(sellerId).populate(
      "userId",
      "email name"
    );
    if (!seller) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    // Update seller status
    seller.status = "suspended";
    await seller.save();

    // Send email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Account Suspended</h1>
          </div>
          <div class="content">
            <h2>Dear ${seller.seller_name},</h2>
            <p>Your seller account has been <strong>suspended</strong>.</p>
            <div class="warning-box">
              <strong>Reason:</strong><br>
              ${reason || "Violation of our terms and conditions."}
            </div>
            <p>Please contact our support team for more information.</p>
            <p>Best regards,<br><strong>Erovians Admin Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2026 Erovians. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmailByBrevo({
      to: [{ email: seller.seller_email || seller.userId.email }],
      subject: "⚠️ Your Seller Account Has Been Suspended",
      htmlContent: emailHtml,
    });

    res.status(200).json({
      success: true,
      message: "Seller suspended and email sent",
      data: seller,
    });
  } catch (error) {
    console.error("Error suspending seller:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Approve Company (with all fields verified)
export const approveCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = id;
    const { verifiedFields } = req.body;

    const company = await Company.findById(companyId).populate({
      path: "sellerId",
      populate: { path: "userId", select: "email name" },
    });

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Update company status
    company.status = "approved";
    await company.save();

    // Update seller status
    const seller = company.sellerId;
    seller.varificationStatus = "Approved";
    seller.status = "active";
    await seller.save();

    // Send email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .button { background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Company Approved!</h1>
          </div>
          <div class="content">
            <h2>Dear ${seller.seller_name},</h2>
            <p>Congratulations! Your company <strong>${company.companyBasicInfo?.companyName}</strong> has been approved!</p>
            <div class="success-box">
              <strong>✅ What's Next?</strong><br>
              • You can now add products to your store<br>
              • Start selling to customers<br>
              • Manage your inventory<br>
              • Access all seller features
            </div>
            <a href="${process.env.FRONTEND_URL}/seller/dashboard" class="button">Go to Dashboard & Add Products</a>
            <p>Thank you for joining Erovians!</p>
            <p>Best regards,<br><strong>Erovians Admin Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2026 Erovians. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmailByBrevo({
      to: [{ email: seller.seller_email || seller.userId.email }],
      subject: "🎉 Your Company Has Been Approved - Start Selling Now!",
      htmlContent: emailHtml,
    });

    res.status(200).json({
      success: true,
      message: "Company approved, seller activated, and email sent",
      data: { company, seller },
    });
  } catch (error) {
    console.error("Error approving company:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Reject Company (with invalid fields list)
export const rejectCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = id;
    const { invalidFields, message } = req.body;

    const company = await Company.findById(companyId).populate({
      path: "sellerId",
      populate: { path: "userId", select: "email name" },
    });

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Update company status
    company.status = "rejected";
    await company.save();

    // Update seller status
    const seller = company.sellerId;
    seller.varificationStatus = "Rejected";
    seller.status = "inactive";
    await seller.save();

    // Create list of invalid fields
    const fieldsList =
      invalidFields && invalidFields.length > 0
        ? invalidFields
            .map((f) => `<li style="margin: 8px 0;">❌ ${f}</li>`)
            .join("")
        : "<li>Please review all information</li>";

    // Send email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .error-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .fields-list { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          ul { list-style: none; padding: 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Company Application Rejected</h1>
          </div>
          <div class="content">
            <h2>Dear ${seller.seller_name},</h2>
            <p>Your company application for <strong>${
              company.companyBasicInfo?.companyName
            }</strong> has been rejected.</p>
            <div class="error-box">
              <strong>Reason:</strong><br>
              ${
                message ||
                "Some information provided is incorrect or incomplete."
              }
            </div>
            <div class="fields-list">
              <strong>❌ Fields that need correction:</strong>
              <ul>${fieldsList}</ul>
            </div>
            <p><strong>What to do next:</strong></p>
            <ul style="margin-left: 20px;">
              <li>✅ Review the fields listed above</li>
              <li>✅ Update your company information with correct details</li>
              <li>✅ Resubmit your application</li>
            </ul>
            <p>We'll review your updated application as soon as possible.</p>
            <p>Best regards,<br><strong>Erovians Admin Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2026 Erovians. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmailByBrevo({
      to: [{ email: seller.seller_email || seller.userId.email }],
      subject: "❌ Company Application Rejected - Action Required",
      htmlContent: emailHtml,
    });

    res.status(200).json({
      success: true,
      message: "Company rejected and email sent with correction details",
      data: { company, seller },
    });
  } catch (error) {
    console.error("Error rejecting company:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
