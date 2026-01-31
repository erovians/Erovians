import asyncHandler from "../../middleware/buyer/asyncHandler.js";
import AppError from "../../utils/buyer/AppError.js";
import logger from "../../config/winston.js";
import User from "../../models/user.model.js";
import Seller from "../../models/sellerSingnup.model.js";
import CompanyDetails from "../../models/company.model.js";
import Product from "../../models/product.model.js";
import Quotation from "../../models/quotation.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinaryUpload.utils.js";
import sendMail from "../../utils/buyer/sendEmailByBrevo.js";

const createQuotationRequest = asyncHandler(async (req, res, next) => {
  let {
    quotation_type,
    userId,
    sellerId,
    productId,
    category,
    subcategories,
    quantity,
    unit,
    message,
    requirements,
    specifications,
    timeline,
    location,
    budgetMin,
    budgetMax,
    contactEmail,
    contactPhone,
  } = req.body;

  // ==================== PARSE SUBCATEGORIES IF STRING ====================
  // Handle subcategories - parse if it's a JSON string
  if (subcategories) {
    if (typeof subcategories === "string") {
      try {
        subcategories = JSON.parse(subcategories);
        logger.info("Parsed subcategories from JSON string");
      } catch (parseError) {
        logger.error("Failed to parse subcategories:", parseError);
        return next(
          new AppError(
            "Invalid subcategories format. Must be a valid array.",
            400
          )
        );
      }
    }

    // Validate it's an array after parsing
    if (!Array.isArray(subcategories)) {
      return next(new AppError("subcategories must be an array", 400));
    }
  }

  // ==================== STEP 1: VALIDATE QUOTATION TYPE ====================
  if (!["product", "product-broadcast", "rfq"].includes(quotation_type)) {
    return next(new AppError("Invalid quotation type", 400));
  }

  logger.info(`Creating quotation request of type: ${quotation_type}`);

  // ==================== STEP 2: VALIDATE REQUIRED FIELDS BASED ON TYPE ====================
  let productExists = null; // Store product for later use

  if (quotation_type === "product" || quotation_type === "product-broadcast") {
    if (!sellerId || !productId || !message) {
      return next(
        new AppError(
          "sellerId, productId, and message are required for product quotations",
          400
        )
      );
    }

    // Verify seller exists
    const sellerExists = await Seller.findById(sellerId);
    if (!sellerExists) {
      return next(new AppError("Seller not found", 404));
    }

    // Verify product exists and store it
    productExists = await Product.findById(productId);
    if (!productExists) {
      return next(new AppError("Product not found", 404));
    }

    if (quotation_type === "product-broadcast") {
      if (!category) {
        return next(
          new AppError("category is required for product-broadcast", 400)
        );
      }
    }
  }

  if (quotation_type === "rfq") {
    if (!category) {
      return next(new AppError("category is required for RFQ", 400));
    }

    if (
      !subcategories ||
      !Array.isArray(subcategories) ||
      subcategories.length === 0
    ) {
      return next(
        new AppError("At least one subcategory is required for RFQ", 400)
      );
    }

    if (!requirements) {
      return next(new AppError("requirements are required for RFQ", 400));
    }
  }

  // Validate common required fields
  if (!quantity || !timeline || !location) {
    return next(
      new AppError("quantity, timeline, and location are required", 400)
    );
  }

  // ==================== STEP 3: HANDLE USER AUTHENTICATION ====================
  let finalContactEmail = contactEmail;
  let finalContactPhone = contactPhone;

  if (userId) {
    // Authenticated user
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Use user's email and mobile if not provided
    finalContactEmail = user.email || contactEmail;
    finalContactPhone = user.mobile || contactPhone;
  } else {
    // Guest user - require email (mandatory for communication)
    if (!contactEmail) {
      return next(
        new AppError("contactEmail is required for guest users", 400)
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return next(new AppError("Invalid email format", 400));
    }
  }

  // ==================== STEP 4: HANDLE FILE UPLOADS ====================
  const uploadedFilesData = [];
  const uploadedPublicIds = []; // Track for rollback

  try {
    if (req.files && req.files.length > 0) {
      const maxFiles = quotation_type === "rfq" ? 5 : 3;

      if (req.files.length > maxFiles) {
        return next(
          new AppError(
            `Maximum ${maxFiles} files allowed for ${quotation_type}`,
            400
          )
        );
      }

      logger.info(`Uploading ${req.files.length} files to Cloudinary`);

      for (const file of req.files) {
        const uploadResult = await uploadOnCloudinary(file.path, file.mimetype);

        if (!uploadResult) {
          // Rollback: delete already uploaded files
          for (const publicId of uploadedPublicIds) {
            await deleteFromCloudinary(publicId);
          }
          return next(new AppError("File upload failed", 500));
        }

        uploadedFilesData.push({
          url: uploadResult.secure_url,
          name: file.originalname,
          type: file.mimetype,
          size: file.size,
          uploadedAt: Date.now(),
        });

        uploadedPublicIds.push(uploadResult.public_id);
      }

      logger.info(`Successfully uploaded ${uploadedFilesData.length} files`);
    }
  } catch (error) {
    // Rollback: delete uploaded files
    for (const publicId of uploadedPublicIds) {
      await deleteFromCloudinary(publicId);
    }
    logger.error("File upload error:", error);
    return next(new AppError("File upload failed", 500));
  }

  // ==================== STEP 5: FIND SELLERS FOR BROADCASTING ====================
  let broadcastSellerIds = [];

  if (quotation_type === "product-broadcast" || quotation_type === "rfq") {
    try {
      logger.info(`Finding sellers for category: ${category}`);

      // Build query
      const companyQuery = {
        "companyBasicInfo.mainCategory": category.toLowerCase().trim(),
      };

      // Add subcategory filter for RFQ
      if (
        quotation_type === "rfq" &&
        Array.isArray(subcategories) &&
        subcategories.length > 0
      ) {
        const normalizedSubcategories = subcategories.map((sub) =>
          sub.toLowerCase().trim()
        );
        companyQuery["companyBasicInfo.subCategory"] = {
          $in: normalizedSubcategories,
        };
      }

      // For product-broadcast, also filter by product subcategories if available
      if (
        quotation_type === "product-broadcast" &&
        productExists?.subCategory?.length > 0
      ) {
        const normalizedSubcategories = productExists.subCategory.map((sub) =>
          sub.toLowerCase().trim()
        );
        companyQuery["companyBasicInfo.subCategory"] = {
          $in: normalizedSubcategories,
        };
      }

      // Find matching companies
      const companies = await CompanyDetails.find(companyQuery).select(
        "sellerId"
      );

      broadcastSellerIds = companies
        .map((company) => company.sellerId)
        .filter((id) => id); // Remove null/undefined

      // For product-broadcast, exclude the original seller
      if (quotation_type === "product-broadcast" && sellerId) {
        broadcastSellerIds = broadcastSellerIds.filter(
          (id) => id.toString() !== sellerId.toString()
        );
      }

      logger.info(
        `Found ${broadcastSellerIds.length} sellers for broadcasting`
      );

      if (broadcastSellerIds.length === 0) {
        logger.warn(`No sellers found for category: ${category}`);
      }
    } catch (error) {
      logger.error("Error finding sellers for broadcast:", error);
      // Continue even if broadcast fails - quotation will still be created
    }
  }

  // ==================== STEP 6: BUILD QUOTATION DATA ====================
  const quotationData = {
    quotation_type,
    userId: userId || null,
    quantity: parseInt(quantity),
    unit,
    timeline,
    location,
    budgetMin: budgetMin ? parseFloat(budgetMin) : undefined,
    budgetMax: budgetMax ? parseFloat(budgetMax) : undefined,
    uploadedFiles: uploadedFilesData,
    status: "pending",
  };

  // Add fields based on quotation type
  if (quotation_type === "product" || quotation_type === "product-broadcast") {
    quotationData.sellerId = sellerId;
    quotationData.productId = productId;
    quotationData.message = message;
  }

  if (quotation_type === "product-broadcast" || quotation_type === "rfq") {
    quotationData.category = category;
  }

  if (quotation_type === "product-broadcast") {
    // Save subcategories from product (denormalized for historical record)
    quotationData.subcategories = productExists?.subCategory || [];
    quotationData.broadcastToSellers = broadcastSellerIds;
  }

  if (quotation_type === "rfq") {
    quotationData.subcategories = subcategories;
    quotationData.requirements = requirements;
    quotationData.specifications = specifications || undefined;
    quotationData.broadcastToSellers = broadcastSellerIds;
  }

  // Add contact info for guest users
  if (!userId) {
    quotationData.contactEmail = finalContactEmail;
    quotationData.contactPhone = finalContactPhone || undefined;
  }

  // ==================== STEP 7: SAVE QUOTATION ====================
  try {
    const quotation = await Quotation.create(quotationData);
    logger.info(`Quotation created successfully: ${quotation._id}`);

    // ==================== STEP 8: SEND EMAIL NOTIFICATIONS ====================
    // Send emails in background (don't await to avoid blocking response)
    setImmediate(async () => {
      try {
        // Get all seller emails to notify
        const sellerIdsToNotify = [];

        if (quotation_type === "product") {
          sellerIdsToNotify.push(sellerId);
        } else if (
          quotation_type === "product-broadcast" ||
          quotation_type === "rfq"
        ) {
          sellerIdsToNotify.push(...broadcastSellerIds);
          if (quotation_type === "product-broadcast" && sellerId) {
            sellerIdsToNotify.push(sellerId);
          }
        }

        if (sellerIdsToNotify.length > 0) {
          // Fetch seller details with user emails
          const sellers = await Seller.find({
            _id: { $in: sellerIdsToNotify },
          }).populate("userId", "email name");

          // Send email to each seller
          for (const seller of sellers) {
            if (seller.userId && seller.userId.email) {
              try {
                // Customize email based on quotation type
                let emailSubject = "New Quotation Request";
                let quotationDetails = "";

                if (quotation_type === "product") {
                  emailSubject = "New Product Quotation Request";
                  quotationDetails = `
                    <p><strong>Product:</strong> ${
                      productExists?.productName || "N/A"
                    }</p>
                    <p><strong>Message:</strong> ${message}</p>
                  `;
                } else if (quotation_type === "product-broadcast") {
                  emailSubject = "New Product Broadcast Quotation Request";
                  quotationDetails = `
                    <p><strong>Product:</strong> ${
                      productExists?.productName || "N/A"
                    }</p>
                    <p><strong>Category:</strong> ${category}</p>
                    <p><strong>Message:</strong> ${message}</p>
                  `;
                } else if (quotation_type === "rfq") {
                  emailSubject = "New RFQ Request";
                  // Safely handle subcategories for email
                  const subcategoriesText = Array.isArray(subcategories)
                    ? subcategories.join(", ")
                    : "N/A";
                  quotationDetails = `
                    <p><strong>Category:</strong> ${category}</p>
                    <p><strong>Subcategories:</strong> ${subcategoriesText}</p>
                    <p><strong>Requirements:</strong> ${requirements}</p>
                    ${
                      specifications
                        ? `<p><strong>Specifications:</strong> ${specifications}</p>`
                        : ""
                    }
                  `;
                }

                await sendMail({
                  email: seller.userId.email,
                  subject: emailSubject,
                  message: `
                    <h2>${emailSubject}</h2>
                    <p>Dear ${seller.userId.name || "Seller"},</p>
                    <p>You have received a new quotation request.</p>
                    <br>
                    ${quotationDetails}
                    <p><strong>Quantity:</strong> ${quantity} ${unit}</p>
                    <p><strong>Timeline:</strong> ${timeline}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    ${
                      budgetMin || budgetMax
                        ? `<p><strong>Budget:</strong> ₹${budgetMin || 0} - ₹${
                            budgetMax || "Not specified"
                          }</p>`
                        : ""
                    }
                    <br>
                    <p>Please log in to your dashboard to view full details and respond.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>Your Platform Team</p>
                  `,
                });
                logger.info(`Email sent to seller: ${seller.userId.email}`);
              } catch (emailError) {
                logger.error(
                  `Failed to send email to ${seller.userId.email}:`,
                  emailError.message
                );
              }
            }
          }
        }
      } catch (notificationError) {
        logger.error("Error sending notifications:", notificationError);
      }
    });

    // ==================== STEP 9: SEND RESPONSE ====================
    res.status(201).json({
      success: true,
      message: "Quotation request created successfully",
      data: {
        quotation,
        sellersNotified:
          quotation_type === "product"
            ? 1
            : broadcastSellerIds.length +
              (quotation_type === "product-broadcast" ? 1 : 0),
      },
    });
  } catch (error) {
    // Rollback: delete uploaded files from Cloudinary
    for (const publicId of uploadedPublicIds) {
      await deleteFromCloudinary(publicId);
    }

    logger.error("Error creating quotation:", error);
    return next(new AppError("Failed to create quotation request", 500));
  }
});

export default createQuotationRequest;
