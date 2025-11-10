// import InquiryModel from "../models/Inquiry.model.js";
// import Product from "../models/product.model.js";
// import Seller from "../models/sellerSingnup.model.js";
// import mongoose from "mongoose";

// //create Inquriy for buyer side
// export const createInquiry = async (req, res, next) => {
//   try {
//     const { quantity, message, country, countryCode, platform } = req.body;

//     // use authenticated user in production; fallback to hardcoded for now
//     const userId = req.user?._id || "690ae30913ffba8b7869fd75";
//     const { productId } = req.params;

//     if (!productId)
//       return res
//         .status(400)
//         .json({ success: false, message: "productId param missing" });

//     const product = await Product.findById(productId).select("sellerId").lean();
//     if (!product)
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });

//     // Create the inquiry (use create() — no `new`)
//     const inquiry = await InquiryModel.create({
//       userId,
//       sellerId: product.sellerId,
//       productId,
//       quantity,
//       message,
//       country,
//       countryCode,
//       platform,
//       audit: [{ actor: userId, action: "create", meta: {} }],
//     });

//     return res.status(201).json({ success: true, inquiry });
//   } catch (err) {
//     // log for debugging, forward to error middleware
//     console.error("createInquiry error:", err);
//     return next(err);
//   }
// };

// /**
//  * Helper: ensure user has permission (placeholder)
//  * Replace with your real auth/role check middleware.
//  */
// const checkSellerAccess = (req, inquries) => {
//   // Example: req.user.id is current user, req.user.role === 'seller'
//   // Allow if sellerId === req.user.id or user is admin
//   if (!req.user) throw { status: 401, message: "Not authenticated" };
//   if (req.user.role === "admin") return true;
//   if (String(req.user.userId) !== String(inquries.sellerId))
//     throw { status: 403, message: "Forbidden" };
//   return true;
// };

// /* Single item actions */
// export const patchAction = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { action, meta, orderId } = req.body;
//     if (!action) return res.status(400).json({ message: "action required" });

//     const q = await InquiryModel.findById(id);
//     if (!q) return res.status(404).json({ message: "Inquiry not found" });

//     checkSellerAccess(req, q);

//     // Map action to method
//     switch (action) {
//       case "mark_read":
//         await q.markRead(req.user.userId);
//         break;
//       case "mark_unread":
//         await q.markUnread(req.user.userId);
//         break;
//       case "flag":
//         await q.toggleFlag(req.user.userId);
//         break;
//       case "unflag":
//         // toggleFlag toggles; if you want explicit unflag:
//         q.isFlagged = false;
//         q.audit.push({ actor: req.user.userId, action: "unflag", meta });
//         await q.save();
//         break;
//       case "mark_spam":
//         await q.markSpam(req.user.userId, meta);
//         break;
//       case "unmark_spam":
//         await q.unmarkSpam(req.user.userId, meta);
//         break;
//       case "delete":
//         await q.softDelete(req.user.userId, meta);
//         break;
//       case "restore":
//         await q.restore(req.user.userId, meta);
//         break;
//       case "assign_order":
//         if (!orderId)
//           return res.status(400).json({ message: "orderId required" });
//         await q.assignOrder(orderId, req.user.userId);
//         break;
//       default:
//         return res.status(400).json({ message: "unknown action" });
//     }

//     return res.json({
//       success: true,
//       inquiry: await InquiryModel.findById(id),
//     });
//   } catch (err) {
//     return next(err);
//   }
// };

// /* Bulk actions endpoint */
// export const bulkAction = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   try {
//     const { ids, action, meta, orderId } = req.body;
//     if (!Array.isArray(ids) || ids.length === 0)
//       return res.status(400).json({ message: "ids required" });
//     if (!action) return res.status(400).json({ message: "action required" });

//     // Start transaction for consistency
//     session.startTransaction();
//     // Optionally: check that all quotations belong to the seller (one query)
//     const first = await InquiryModel.findOne({ _id: { $in: ids } }).session(
//       session
//     );
//     if (
//       first &&
//       req.user.role !== "admin" &&
//       String(first.sellerId) !== String(req.user.userId)
//     ) {
//       // For safety we query count of mismatched sellerIds
//       const mismatches = await InquiryModel.countDocuments({
//         _id: { $in: ids },
//         sellerId: { $ne: req.user.userId },
//       }).session(session);
//       if (mismatches > 0)
//         throw { status: 403, message: "Some inquiry not owned by you" };
//     }

//     const result = await InquiryModel.bulkAction(
//       ids,
//       { type: action, actorId: req.user.userId, meta, orderId },
//       { session }
//     );
//     await session.commitTransaction();
//     session.endSession();
//     return res.json({ success: true, result });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     return next(err);
//   }
// };

// /* Query with pagination (for frontend) */
// // export const listInquires = async (req, res, next) => {
// //   try {
// //     const { page = 1, limit = 25, q = "", status, isFlagged, isSpam, isDeleted } = req.query;
// //     const skip = (page - 1) * limit;
// //     const filter = { sellerId: req.user.userId };
// //     console.log(filter)

// //     if (typeof isDeleted !== "undefined") filter.isDeleted = isDeleted === "true";
// //     if (typeof isFlagged !== "undefined") filter.isFlagged = isFlagged === "true";
// //     if (typeof isSpam !== "undefined") filter.isSpam = isSpam === "true";
// //     if (status) filter.status = status;

// //     if (q) {
// //       // simple text search — you may add a text index on message/username fields
// //       const regex = new RegExp(escapeRegExp(q), "i");
// //       filter.$or = [{ message: regex }, { _id: q }, { "meta.username": regex }];
// //     }

// //     const [items, total] = await Promise.all([
// //       InquiryModel.find(filter)
// //         .sort({ updatedAt: -1 })
// //         .skip(parseInt(skip))
// //         .limit(parseInt(limit))
// //         .lean()
// //         .exec(),
// //       InquiryModel.countDocuments(filter),
// //     ]);

// //     res.json({ items, total, page: Number(page), limit: Number(limit) });
// //   } catch (err) {
// //     return next(err);
// //   }
// // };

// // small helper

// export const listInquires = async (req, res, next) => {
//   try {
//     const {
//       page = 1,
//       limit = 25,
//       q = "",
//       tab = "All",
//       statusTab = "All",
//       sortBy = "Latest",
//     } = req.query;

//     const pageNum = Math.max(parseInt(page) || 1, 1);
//     const pageSize = Math.min(Math.max(parseInt(limit) || 25, 1), 100);

//     // 1) Resolve seller ObjectId that matches Inquiry.sellerId (ref: "Seller")
//     const rawAuthId =
//       req.user?.sellerId || req.user?.userId || req.user?._id || req.user?.id;

//     if (!rawAuthId)
//       return res.status(401).json({ message: "Not authenticated" });

//     let sellerObjectId = null;

//     // If token already carries a Seller _id, use it
//     if (
//       mongoose.isValidObjectId(rawAuthId) &&
//       (await Seller.exists({ _id: rawAuthId }))
//     ) {
//       sellerObjectId = new mongoose.Types.ObjectId(rawAuthId);
//     } else {
//       // Otherwise map User -> Seller via Seller.userId
//       const sellerDoc = await Seller.findOne({ userId: rawAuthId })
//         .select("_id")
//         .lean();
//       if (!sellerDoc)
//         return res.status(403).json({ message: "No seller matched this user" });
//       sellerObjectId = sellerDoc._id;
//     }

//     // 2) Build match with the resolved ObjectId
//     const match = { sellerId: sellerObjectId };

//     switch (tab) {
//       case "Flagged":
//         match.isFlagged = true;
//         break;
//       case "Spam":
//         match.isSpam = true;
//         break;
//       case "Deleted":
//         match.isDeleted = true;
//         break;
//       case "All":
//       default:
//         // If you want "All" to hide deleted, uncomment:
//         // match.isDeleted = { $ne: true };
//         break;
//     }

//     if (statusTab === "Pending for reply") match.status = "Pending";
//     else if (statusTab === "New inquiry") match.isNew = true;

//     if (q) {
//       const regex = new RegExp(escapeRegExp(q), "i");
//       const or = [{ message: regex }, { "meta.username": regex }];
//       if (mongoose.isValidObjectId(q))
//         or.push({ _id: new mongoose.Types.ObjectId(q) });
//       match.$or = or;
//     }

//     let sort = { updatedAt: -1 };
//     if (sortBy === "Oldest") sort = { updatedAt: 1 };
//     if (sortBy === "Unread") sort = { "readInfo.isRead": 1, updatedAt: -1 };

//     // 3) Aggregation
//     const itemsPipe = [
//       { $match: match },
//       { $sort: sort },
//       { $skip: (pageNum - 1) * pageSize },
//       { $limit: pageSize },
//       {
//         $project: {
//           _id: 1,
//           userId: 1,
//           productId: 1,
//           quantity: 1,
//           message: 1,
//           status: 1,
//           isFlagged: 1,
//           isSpam: 1,
//           isDeleted: 1,
//           isNew: 1,
//           readInfo: 1,
//           orderId: 1,
//           country: 1,
//           platform: 1,
//           updatedAt: 1,
//           createdAt: 1,
//         },
//       },
//     ];

//     const countsPipe = [
//       { $match: { sellerId: sellerObjectId } }, // IMPORTANT: ObjectId, not string
//       {
//         $group: {
//           _id: null,
//           totalAll: { $sum: 1 },
//           totalFlagged: { $sum: { $cond: ["$isFlagged", 1, 0] } },
//           totalSpam: { $sum: { $cond: ["$isSpam", 1, 0] } },
//           totalDeleted: { $sum: { $cond: ["$isDeleted", 1, 0] } },
//           totalNew: { $sum: { $cond: ["$isNew", 1, 0] } },
//           totalPending: {
//             $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
//           },
//           totalOrderCreated: {
//             $sum: { $cond: [{ $ifNull: ["$orderId", false] }, 1, 0] },
//           },
//           totalUnread: {
//             $sum: {
//               $cond: [
//                 {
//                   $or: [
//                     { $eq: ["$readInfo.isRead", false] },
//                     { $not: ["$readInfo.isRead"] },
//                   ],
//                 },
//                 1,
//                 0,
//               ],
//             },
//           },
//         },
//       },
//       { $project: { _id: 0 } },
//     ];

//     const totalPipe = [{ $match: match }, { $count: "total" }];

//     const agg = await InquiryModel.aggregate([
//       {
//         $facet: {
//           items: itemsPipe,
//           totalFiltered: totalPipe,
//           counts: countsPipe,
//         },
//       },
//       {
//         $project: {
//           items: 1,
//           total: {
//             $ifNull: [{ $arrayElemAt: ["$totalFiltered.total", 0] }, 0],
//           },
//           counts: { $ifNull: [{ $arrayElemAt: ["$counts", 0] }, {}] },
//         },
//       },
//     ]);

//     const payload = agg[0] || { items: [], total: 0, counts: {} };

//     // Quick sanity logs (remove after verifying)
//     // console.log({ usingSellerId: sellerObjectId, match, sample: await InquiryModel.findOne({ sellerId: sellerObjectId }).lean() });

//     return res.json({
//       items: payload.items,
//       total: payload.total,
//       page: pageNum,
//       limit: pageSize,
//       counts: payload.counts,
//     });
//   } catch (err) {
//     return next(err);
//   }
// };
// function escapeRegExp(string) {
//   return String(string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// }

import InquiryModel from "../models/Inquiry.model.js";
import Product from "../models/product.model.js";
import Seller from "../models/sellerSingnup.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import exceljs from "exceljs"; // Import exceljs
import stream from "stream"; // Node.js built-in

//create Inquriy for buyer side
export const createInquiry = async (req, res, next) => {
  // ... (your existing code, no changes)
  try {
    const { quantity, message, country, countryCode, platform } = req.body;

    // use authenticated user in production; fallback to hardcoded for now
    const userId = req.user?._id || "690ae30913ffba8b7869fd76";
    const { productId } = req.params;

    if (!productId)
      return res
        .status(400)
        .json({ success: false, message: "productId param missing" });

    const product = await Product.findById(productId).select("sellerId").lean();
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Create the inquiry (use create() — no `new`)
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
    // log for debugging, forward to error middleware
    console.error("createInquiry error:", err);
    return next(err);
  }
};

/**
 * Helper: ensure user has permission (placeholder)
 * Replace with your real auth/role check middleware.
 */
const checkSellerAccess = (req, inquries) => {
  // ... (your existing code, no changes)
  // Example: req.user.id is current user, req.user.role === 'seller'
  // Allow if sellerId === req.user.id or user is admin
  if (!req.user) throw { status: 401, message: "Not authenticated" };
  if (req.user.role === "admin") return true;
  if (String(req.user.userId) !== String(inquries.sellerId))
    throw { status: 403, message: "Forbidden" };
  return true;
};

/* Single item actions */
export const patchAction = async (req, res, next) => {
  // ... (your existing code, no changes)
  try {
    const { id } = req.params;
    const { action, meta, orderId } = req.body;
    if (!action) return res.status(400).json({ message: "action required" });

    const q = await InquiryModel.findById(id);
    if (!q) return res.status(404).json({ message: "Inquiry not found" });

    checkSellerAccess(req, q);

    // Map action to method
    switch (action) {
      case "mark_read":
        await q.markRead(req.user.userId);
        break;
      case "mark_unread":
        await q.markUnread(req.user.userId);
        break;
      case "flag":
        await q.toggleFlag(req.user.userId);
        break;
      case "unflag":
        // toggleFlag toggles; if you want explicit unflag:
        q.isFlagged = false;
        q.audit.push({ actor: req.user.userId, action: "unflag", meta });
        await q.save();
        break;
      case "mark_spam":
        await q.markSpam(req.user.userId, meta);
        break;
      case "unmark_spam":
        await q.unmarkSpam(req.user.userId, meta);
        break;
      case "delete":
        await q.softDelete(req.user.userId, meta);
        break;
      case "restore":
        await q.restore(req.user.userId, meta);
        break;
      case "assign_order":
        if (!orderId)
          return res.status(400).json({ message: "orderId required" });
        await q.assignOrder(orderId, req.user.userId);
        break;
      default:
        return res.status(400).json({ message: "unknown action" });
    }

    return res.json({
      success: true,
      inquiry: await InquiryModel.findById(id),
    });
  } catch (err) {
    return next(err);
  }
};

/* Bulk actions endpoint */
export const bulkAction = async (req, res, next) => {
  // ... (your existing code, no changes)
  const session = await mongoose.startSession();
  try {
    const { ids, action, meta, orderId } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ message: "ids required" });
    if (!action) return res.status(400).json({ message: "action required" });

    // Start transaction for consistency
    session.startTransaction();
    // Optionally: check that all quotations belong to the seller (one query)
    const first = await InquiryModel.findOne({ _id: { $in: ids } }).session(
      session
    );
    if (
      first &&
      req.user.role !== "admin" &&
      String(first.sellerId) !== String(req.user.userId) // Make sure this matches your user auth object
    ) {
      // For safety we query count of mismatched sellerIds
      const mismatches = await InquiryModel.countDocuments({
        _id: { $in: ids },
        sellerId: { $ne: req.user.userId }, // Make sure this matches your user auth object
      }).session(session);
      if (mismatches > 0)
        throw { status: 403, message: "Some inquiry not owned by you" };
    }

    const result = await InquiryModel.bulkAction(
      ids,
      { type: action, actorId: req.user.userId, meta, orderId }, // Make sure this matches your user auth object
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return res.json({ success: true, result });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
};

/* Query with pagination (for frontend) */
export const listInquires = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 25,
      q = "",
      tab = "All",
      statusTab = "All",
      sortBy = "Latest",
      showOnlyUnread,
    } = req.query;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit) || 25, 1), 100);

    // ---- Resolve seller ObjectId like all other endpoints
    const authId = req.user?.userId || req.user?._id || req.user?.id;
    if (!authId) return res.status(401).json({ message: "Not authenticated" });

    let sellerObjectId;
    if (
      mongoose.isValidObjectId(authId) &&
      (await Seller.exists({ _id: authId }))
    ) {
      sellerObjectId = new mongoose.Types.ObjectId(authId);
    } else {
      const sellerDoc = await Seller.findOne({ userId: authId })
        .select("_id")
        .lean();
      if (!sellerDoc)
        return res.status(403).json({ message: "No seller matched this user" });
      sellerObjectId = sellerDoc._id;
    }

    // ---- Build match
    const match = { sellerId: sellerObjectId };

    switch (tab) {
      case "Flagged":
        match.isFlagged = true;
        break;
      case "Spam":
        match.isSpam = true;
        break;
      case "Deleted":
        match.isDeleted = true;
        break;
      case "All":
      default:
        // hide deleted in "All"
        match.isDeleted = { $ne: true };
        break;
    }

    if (statusTab === "Pending for reply") match.status = "Pending";
    else if (statusTab === "New inquiry") match.isNew = true;

    if (String(showOnlyUnread) === "true") {
      match["readInfo.isRead"] = { $ne: true };
    }

    if (q) {
      const regex = new RegExp(escapeRegExp(q), "i");
      const or = [{ message: regex }, { "meta.username": regex }];
      if (mongoose.isValidObjectId(q))
        or.push({ _id: new mongoose.Types.ObjectId(q) });
      match.$or = or;
    }

    let sort = { updatedAt: -1 };
    if (sortBy === "Oldest") sort = { updatedAt: 1 };
    if (sortBy === "Unread") sort = { "readInfo.isRead": 1, updatedAt: -1 };

    // ---- Aggregation
    const itemsPipe = [
      { $match: match },
      { $sort: sort },
      { $skip: (pageNum - 1) * pageSize },
      { $limit: pageSize },

      // join buyer (user)
      {
        $lookup: {
          from: User.collection.name, // uses actual collection name for the registered 'User' model
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            { $project: { _id: 1, name: 1, email: 1, profileImage: 1 } },
          ],
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      // join seller — only expose seller name
      {
        $lookup: {
          from: Seller.collection.name,
          localField: "sellerId",
          foreignField: "_id",
          as: "seller",
          pipeline: [
            // ⚠️ Pick the correct field your Seller schema actually uses for the display name.
            // If your schema uses 'sellername', replace '$name' with '$sellername' below.
            { $project: { _id: 1, sellername: 1 } },
          ],
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          productId: 1,
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

          // nested buyer object
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            profileImage: "$user.profileImage",
          },

          seller: {
            _id: "$seller._id",
            name: "$seller.sellername", // or "$seller.sellername"/"$seller.companyName" per your schema
          },
        },
      },
    ];

    const countsPipe = [
      { $match: { sellerId: sellerObjectId } },
      {
        $group: {
          _id: null,
          // 'All' excludes deleted to align with UI
          totalAll: { $sum: { $cond: [{ $ne: ["$isDeleted", true] }, 1, 0] } },
          totalFlagged: { $sum: { $cond: ["$isFlagged", 1, 0] } },
          totalSpam: { $sum: { $cond: ["$isSpam", 1, 0] } },
          totalDeleted: { $sum: { $cond: ["$isDeleted", 1, 0] } },
          totalNew: { $sum: { $cond: ["$isNew", 1, 0] } },
          totalPending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
          },
          totalOrderCreated: {
            $sum: { $cond: [{ $ifNull: ["$orderId", false] }, 1, 0] },
          },
          totalUnread: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$readInfo.isRead", false] },
                    { $not: ["$readInfo.isRead"] },
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

    const totalPipe = [{ $match: match }, { $count: "total" }];

    const agg = await InquiryModel.aggregate([
      {
        $facet: {
          items: itemsPipe,
          totalFiltered: totalPipe,
          counts: countsPipe,
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

    const payload = agg[0] || { items: [], total: 0, counts: {} };

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

// --- ADD THIS NEW CONTROLLER FUNCTION FOR EXPORT ---

// export const exportInquiries = async (req, res, next) => {
//   try {
//     const { ids } = req.body;
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ message: "No inquiry IDs provided" });
//     }

//     // 1. Get the seller ID from the authenticated user
//     // (This logic must match the one in listInquires)
//     const rawAuthId =
//       req.user?.sellerId || req.user?.userId || req.user?._id || req.user?.id;
//     const sellerDoc = await Seller.findOne({ userId: rawAuthId })
//       .select("_id")
//       .lean();
//     if (!sellerDoc) {
//       return res.status(403).json({ message: "No seller matched this user" });
//     }

//     console.log(sellerDoc)
//     const sellerObjectId = sellerDoc._id;

//     // 2. Fetch inquiries, ensuring they belong to this seller
//     const inquiries = await InquiryModel.find({
//       _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) }, // Ensure ObjectIds
//       sellerId: sellerObjectId, // Security check
//     })
//       .populate("userId", "username email") // Get buyer info
//       .populate("productId", "name sku") // Get product info
//       .sort({ createdAt: -1 })
//       .lean();

//     if (inquiries.length === 0) {
//       return res.status(404).json({ message: "No matching inquiries found" });
//     }

//     // 3. Create Excel workbook
//     const workbook = new exceljs.Workbook();
//     const worksheet = workbook.addWorksheet("Inquiries");

//     // Define columns
//     worksheet.columns = [
//       { header: "Inquiry ID", key: "_id", width: 26 },
//       { header: "Date", key: "createdAt", width: 20 },
//       { header: "Buyer", key: "buyerName", width: 25 },
//       { header: "Buyer Email", key: "buyerEmail", width: 30 },
//       { header: "Product", key: "productName", width: 30 },
//       { header: "Product SKU", key: "productSku", width: 20 },
//       { header: "Quantity", key: "quantity", width: 10 },
//       { header: "Message", key: "message", width: 50 },
//       { header: "Status", key: "status", width: 15 },
//       { header: "Country", key: "country", width: 15 },
//     ];

//     // Add rows
//     inquiries.forEach((inq) => {
//       worksheet.addRow({
//         _id: inq._id.toString(),
//         createdAt: inq.createdAt,
//         buyerName: inq.userId?.username || "N/A",
//         buyerEmail: inq.userId?.email || "N/A",
//         productName: inq.productId?.name || "N/A",
//         productSku: inq.productId?.sku || "N/A",
//         quantity: inq.quantity,
//         message: inq.message,
//         status: inq.status,
//         country: inq.country,
//       });
//     });

//     // 4. Set headers and send the file
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=" + "inquiries.xlsx"
//     );

//     // Write workbook to response
//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (err) {
//     return next(err);
//   }
// };

export const exportInquiries = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No inquiry IDs provided" });
    }

    // --- Resolve seller ObjectId exactly like listInquires ---
    const sellerId = req.user?.userId;
    if (!sellerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    let sellerObjectId = null;

    // If token already is a Seller _id, use it
    if (
      mongoose.isValidObjectId(sellerId) &&
      (await Seller.exists({ _id: sellerId }))
    ) {
      sellerObjectId = new mongoose.Types.ObjectId(sellerId);
    } else {
      // Otherwise map User -> Seller via Seller.userId
      const sellerDoc = await Seller.findOne({ userId: sellerId })
        .select("_id")
        .lean();
      if (!sellerDoc) {
        return res.status(403).json({ message: "No seller matched this user" });
      }
      sellerObjectId = sellerDoc._id;
    }

    // --- Fetch inquiries that belong to this seller ---
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

    // --- Build workbook ---
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

// --- END NEW FUNCTION ---

function escapeRegExp(string) {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
