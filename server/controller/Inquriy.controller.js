const { Types } = mongoose;
import InquiryModel from "../models/Inquiry.model.js";
import Product from "../models/product.model.js";
import Seller from "../models/sellerSingnup.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import exceljs from "exceljs";

/* ========== HELPER FUNCTIONS ========== */

/**
 * Resolve seller ObjectId from authenticated user
 * SINGLE SOURCE OF TRUTH for seller resolution
 */
const resolveSellerObjectId = async (req) => {
  const authId = req.user?.userId || req.user?._id || req.user?.id;
  if (!authId) {
    throw { status: 401, message: "Not authenticated" };
  }

  // Check if authId is already a Seller _id
  if (
    mongoose.isValidObjectId(authId) &&
    (await Seller.exists({ _id: authId }))
  ) {
    return new mongoose.Types.ObjectId(authId);
  }

  // Otherwise, map User -> Seller via Seller.userId
  const sellerDoc = await Seller.findOne({ userId: authId })
    .select("_id")
    .lean();
  if (!sellerDoc) {
    throw { status: 403, message: "No seller matched this user" };
  }

  return sellerDoc._id;
};

/**
 * Check seller access permission
 */
const checkSellerAccess = (req, inquiry) => {
  if (!req.user) throw { status: 401, message: "Not authenticated" };
  if (req.user.role === "admin") return true;
  if (String(req.user.userId) !== String(inquiry.sellerId)) {
    throw { status: 403, message: "Forbidden" };
  }
  return true;
};

/* ========== CONTROLLER FUNCTIONS ========== */

/**
 * Create inquiry (buyer side)
 * POST /inquiry/create/:productId
 */

export const createInquiry = async (req, res, next) => {
  try {
    const { quantity, message, country, countryCode, platform } = req.body;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId param missing",
      });
    }

    const userId = req.user?._id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const product = await Product.findById(productId).select("sellerId").lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const inquiry = await InquiryModel.create({
      userId,
      sellerId: product.sellerId,
      productId,
      quantity,
      message,
      country,
      countryCode,
      platform,
      audit: [{ actor: userId, action: "create", meta: {} }],
    });

    return res.status(201).json({ success: true, inquiry });
  } catch (err) {
    console.error("createInquiry error:", err);
    return next(err);
  }
};

/**
 * Mark inquiry as viewed (clear isNew flag)
 * PATCH /inquiry/:id/mark-viewed
 */
export const markInquiryAsViewed = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid inquiry ID" });
    }

    const inquiry = await InquiryModel.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    checkSellerAccess(req, inquiry);

    // Use the model method
    await inquiry.markAsViewed(req.user?.userId || req.user?._id);

    return res.json({
      success: true,
      inquiry: {
        _id: inquiry._id,
        isNew: inquiry.isNew,
        readInfo: inquiry.readInfo,
        updatedAt: inquiry.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Single inquiry action
 * PATCH /inquiry/:id/action
 */
export const patchAction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, meta = {}, orderId } = req.body;

    if (!action) {
      return res.status(400).json({ message: "action required" });
    }

    const inquiry = await InquiryModel.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    checkSellerAccess(req, inquiry);

    const actorId = req.user?.userId || req.user?._id;

    // Use model instance methods
    switch (action) {
      case "mark_viewed":
        await inquiry.markAsViewed(actorId);
        break;
      case "mark_read":
        await inquiry.markRead(actorId);
        break;
      case "mark_unread":
        await inquiry.markUnread(actorId);
        break;
      case "flag":
      case "unflag":
        await inquiry.toggleFlag(actorId);
        break;
      case "mark_spam":
        await inquiry.markSpam(actorId, meta);
        break;
      case "unmark_spam":
        await inquiry.unmarkSpam(actorId, meta);
        break;
      case "delete":
        await inquiry.softDelete(actorId, meta);
        break;
      case "restore":
        await inquiry.restore(actorId, meta);
        break;
      case "assign_order":
        if (!orderId) {
          return res.status(400).json({ message: "orderId required" });
        }
        await inquiry.assignOrder(orderId, actorId);
        break;
      default:
        return res.status(400).json({ message: `Unknown action: ${action}` });
    }

    return res.json({
      success: true,
      inquiry: await InquiryModel.findById(id).lean(),
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Bulk actions
 * POST /inquiry/bulk/action
 */
export const bulkAction = async (req, res, next) => {
  let session;

  try {
    const { ids, action, meta = {}, orderId } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids required" });
    }
    if (!action) {
      return res.status(400).json({ message: "action required" });
    }

    const actorId = req.user?.userId || req.user?._id;
    const sellerObjectId = await resolveSellerObjectId(req);

    // Start transaction for consistency
    session = await mongoose.startSession();
    session.startTransaction();

    // Security check: verify all inquiries belong to this seller
    if (req.user?.role !== "admin") {
      const mismatches = await InquiryModel.countDocuments({
        _id: { $in: ids },
        sellerId: { $ne: sellerObjectId },
      }).session(session);

      if (mismatches > 0) {
        throw { status: 403, message: "Some inquiries not owned by you" };
      }
    }

    // Use the static bulkAction method from the model
    const result = await InquiryModel.bulkAction(
      ids,
      { type: action, actorId, meta, orderId },
      { session }
    );

    await session.commitTransaction();

    return res.json({
      success: true,
      result: {
        action: result.action,
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
    });
  } catch (err) {
    if (session) {
      await session.abortTransaction();
    }
    return next(err);
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

/**
 * List inquiries with filters and pagination
 * GET /inquiry
 */
export const listInquiries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 25,
      q = "",
      tab = "All",
      statusTab = "All",
      sortBy = "Latest",
      showOnlyUnread = "false",
    } = req.query;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit) || 25, 1), 100);

    const sellerObjectId = await resolveSellerObjectId(req);

    // Use model static method to build filter
    const match = InquiryModel.buildFilterQuery({
      sellerId: sellerObjectId,
      tab,
      statusTab,
      showOnlyUnread: String(showOnlyUnread) === "true",
      searchQuery: q,
    });

    // Use model static method to get sort config
    const sort = InquiryModel.getSortConfig(sortBy);

    // Aggregation pipeline for items
    const itemsPipeline = [
      { $match: match },
      { $sort: sort },
      { $skip: (pageNum - 1) * pageSize },
      { $limit: pageSize },

      // Join buyer
      {
        $lookup: {
          from: User.collection.name,
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            { $project: { _id: 1, name: 1, email: 1, profileImage: 1 } },
          ],
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      // Join seller
      {
        $lookup: {
          from: Seller.collection.name,
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
          pipeline: [{ $project: { _id: 1, sellername: 1 } }],
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },

      // Join product
      {
        $lookup: {
          from: Product.collection.name,
          localField: "productId",
          foreignField: "_id",
          as: "product",
          pipeline: [{ $project: { _id: 1, productName: 1, sku: 1 } }],
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },

      // Project final shape
      {
        $project: {
          _id: 1,
          productId: "$product",
          quantity: 1,
          message: 1,
          status: 1,
          isFlagged: 1,
          isSpam: 1,
          isDeleted: 1,
          isNew: 1,
          readInfo: 1,
          orderId: 1,
          country: 1,
          countryCode: 1,
          platform: 1,
          updatedAt: 1,
          createdAt: 1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            profileImage: "$user.profileImage",
          },
          seller: {
            _id: "$seller._id",
            name: "$seller.sellername",
          },
        },
      },
    ];

    // Counts pipeline
    const countsPipeline = [
      { $match: { sellerId: sellerObjectId } },
      {
        $group: {
          _id: null,
          totalAll: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$isDeleted", true] },
                    { $ne: ["$isSpam", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalFlagged: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$isFlagged", true] },
                    { $ne: ["$isDeleted", true] },
                    { $ne: ["$isSpam", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalSpam: { $sum: { $cond: ["$isSpam", 1, 0] } },
          totalDeleted: { $sum: { $cond: ["$isDeleted", 1, 0] } },
          totalNew: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$isNew", true] },
                    { $ne: ["$isDeleted", true] },
                    { $ne: ["$isSpam", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalPending: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "Pending"] },
                    { $ne: ["$isDeleted", true] },
                    { $ne: ["$isSpam", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalUnread: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $or: [
                        { $eq: ["$readInfo.isRead", false] },
                        { $not: ["$readInfo.isRead"] },
                      ],
                    },
                    { $ne: ["$isDeleted", true] },
                    { $ne: ["$isSpam", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $project: { _id: 0 } },
    ];

    const totalPipeline = [{ $match: match }, { $count: "total" }];

    // Execute aggregation
    const [result] = await InquiryModel.aggregate([
      {
        $facet: {
          items: itemsPipeline,
          totalFiltered: totalPipeline,
          counts: countsPipeline,
        },
      },
      {
        $project: {
          items: 1,
          total: {
            $ifNull: [{ $arrayElemAt: ["$totalFiltered.total", 0] }, 0],
          },
          counts: { $ifNull: [{ $arrayElemAt: ["$counts", 0] }, {}] },
        },
      },
    ]);

    const payload = result || { items: [], total: 0, counts: {} };

    return res.json({
      items: payload.items,
      total: payload.total,
      page: pageNum,
      limit: pageSize,
      counts: payload.counts,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Export inquiries to Excel
 * POST /inquiry/export
 */
export const exportInquiries = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No inquiry IDs provided" });
    }

    const sellerObjectId = await resolveSellerObjectId(req);

    const objectIds = ids
      .filter((id) => mongoose.isValidObjectId(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    if (objectIds.length === 0) {
      return res.status(400).json({ message: "Invalid inquiry IDs" });
    }

    const inquiries = await InquiryModel.find({
      _id: { $in: objectIds },
      sellerId: sellerObjectId,
    })
      .populate("userId", "name email")
      .populate("productId", "productName sku")
      .sort({ createdAt: -1 })
      .lean();

    if (inquiries.length === 0) {
      return res.status(404).json({ message: "No matching inquiries found" });
    }

    // Create workbook
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Inquiries");

    worksheet.columns = [
      { header: "Inquiry ID", key: "_id", width: 26 },
      { header: "Date", key: "createdAt", width: 20 },
      { header: "Buyer", key: "buyerName", width: 25 },
      { header: "Buyer Email", key: "buyerEmail", width: 30 },
      { header: "Product", key: "productName", width: 30 },
      { header: "Product SKU", key: "productSku", width: 20 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Message", key: "message", width: 50 },
      { header: "Status", key: "status", width: 15 },
      { header: "Country", key: "country", width: 15 },
    ];

    inquiries.forEach((inq) => {
      worksheet.addRow({
        _id: String(inq._id),
        createdAt: inq.createdAt,
        buyerName: inq.userId?.name || "N/A",
        buyerEmail: inq.userId?.email || "N/A",
        productName: inq.productId?.productName || "N/A",
        productSku: inq.productId?.sku || "N/A",
        quantity: inq.quantity ?? "",
        message: inq.message ?? "",
        status: inq.status ?? "",
        country: inq.country ?? "",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=inquiries_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    return next(err);
  }
};

//**
// Production details with  productId */
export const getInquiryDetialById = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user?.userId;

  if (!sellerId)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({ success: false, message: "Invalid id" });
  }

  // Must use `new` with Mongoose ObjectId (Mongoose 7+)
  const inquiryObjectId = new Types.ObjectId(id);
  const sellerObjectId = new Types.ObjectId(sellerId);

  try {
    const pipeline = [
      {
        $match: {
          _id: inquiryObjectId,
          sellerId: sellerObjectId,
          isDeleted: false,
        },
      },
      // lookup product
      {
        $lookup: {
          from: "products",
          let: { pid: "$productId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$pid"] } } },
            {
              $project: {
                _id: 1,
                productName: 1,
                productImages: 1,
                category: 1,
                subCategory: 1,
                origin: 1,
                pricePerUnit: 1,
                priceUnit: 1,
                color: 1,
                grade: 1,
                weight: 1,
                weightMeasurement: 1,
                size: 1,
              },
            },
          ],
          as: "product",
        },
      },
      // lookup buyer (user)
      {
        $lookup: {
          from: "users",
          let: { uid: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$uid"] } } },
            { $project: { _id: 1, name: 1, email: 1, profileImage: 1 } },
          ],
          as: "buyer",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$buyer", preserveNullAndEmptyArrays: true } },

      // compute safe last-6 chars of buyer._id
      {
        $addFields: {
          "buyer._idStr": { $toString: "$buyer._id" },
        },
      },
      {
        $addFields: {
          // compute start = max(strLen - 6, 0)
          "buyer.idShortStart": {
            $max: [{ $subtract: [{ $strLenBytes: "$buyer._idStr" }, 6] }, 0],
          },
        },
      },
      {
        $addFields: {
          "buyer.idShort": {
            $substrBytes: ["$buyer._idStr", "$buyer.idShortStart", 6],
          },
        },
      },

      // final projection to a compact UI-friendly shape
      {
        $project: {
          _id: 1,
          quantity: 1,
          message: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          country: 1,
          countryCode: 1,
          readInfo: 1,
          data: {
            buyer: {
              name: { $ifNull: ["$buyer.name", "Unknown"] },
              id: { $ifNull: ["$buyer.idShort", "Unknown"] },
              email: { $ifNull: ["$buyer.email", "N/A"] },
              profileImage: { $ifNull: ["$buyer.profileImage", "N/A"] },
            },
            inquiry: {
              id: "$_id",
              quantity: { $ifNull: ["$quantity", 0] },
              message: { $ifNull: ["$message", ""] },
              status: { $ifNull: ["$status", "Unknown"] },
              readInfo: "$readInfo",
              country: "$country",
              countryCode: "$countryCode",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
            product: {
              id: { $toString: "$product._id" },
              productName: { $ifNull: ["$product.productName", "—"] },
              category: {
                $cond: [
                  {
                    $and: [
                      { $isArray: "$product.category" },
                      { $gt: [{ $size: "$product.category" }, 0] },
                    ],
                  },
                  { $arrayElemAt: ["$product.category", 0] },
                  { $ifNull: ["$product.category", "—"] },
                ],
              },
              subCategory: {
                $cond: [
                  {
                    $and: [
                      { $isArray: "$product.subCategory" },
                      { $gt: [{ $size: "$product.subCategory" }, 0] },
                    ],
                  },
                  { $arrayElemAt: ["$product.subCategory", 0] },
                  { $ifNull: ["$product.subCategory", "—"] },
                ],
              },
              origin: { $ifNull: ["$product.origin", "—"] },
              pricePerUnit: "$product.pricePerUnit",
              priceUnit: "$product.priceUnit",
              color: { $ifNull: ["$product.color", "—"] },
              grade: { $ifNull: ["$product.grade", "—"] },
              weight: { $ifNull: ["$product.weight", "—"] },
              weightMeasurement: {
                $ifNull: ["$product.weightMeasurement", "—"],
              },
              size: { $ifNull: ["$product.size", "—"] },
              images: { $ifNull: ["$product.productImages", []] },
            },
          },
        },
      },
      { $replaceRoot: { newRoot: { success: true, data: "$data" } } },
    ];

    const [result] = await InquiryModel.aggregate(pipeline).allowDiskUse(false);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching quotation detail (agg):", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
