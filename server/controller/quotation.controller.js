import { Quotation } from "../models/quotation.model.js";
import Product from "../models/product.model.js";
import Inquiry from "../models/Inquiry.model.js";

// user will create quotation
export const createQuotation = async (req, res) => {
  try {
    const { userId, quantity, message } = req.body;
    // const userId = req.user?.userId;
    const { productId } = req.params;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID, quantity, and authentication are required.",
      });
    }

    const product = await Product.findById(productId).select("sellerId");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const quotation = await Quotation.create({
      userId,
      sellerId: product.sellerId,
      productId,
      quantity,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Quotation request sent successfully to the seller.",
      quotation,
    });
  } catch (error) {
    console.error("Error creating quotation:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while sending quotation.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//seller will see the quotation
export const getQuotationsBySeller = async (req, res) => {
  try {
    const sellerId = req.user?.userId;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required or unauthorized.",
      });
    }

    const quotations = await Quotation.find({ sellerId })
      // .populate("userId").  BuyerId
      .populate("productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      quotations,
    });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quotations.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Inquiry
// export const getSellerQuotationById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const sellerId = req.user.userId;

//     console.log( id, sellerId)

//     const inquiry = await Inquiry.findOne({ _id: id, sellerId }).populate(
//       "productId",
//       "productName category subCategory productImages origin pricePerUnit priceUnit color grade weight weightMeasurement size"
//     );
//     // .populate("userId");

//     if (!inquiry) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Inquiry not found" });
//     }

//     res.status(200).json({ success: true, inquiry });
//   } catch (error) {
//     console.error("Error fetching quotation detail:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

import mongoose from "mongoose";
// import Inquiry from "@/models/Inquiry"; // path adjust
// no need to import Product/User models for aggregation lookups
const { Types } = mongoose;

/**
 * GET /inquiries/:id/quotation
 * Aggregation-based, projection-limited, single-query fetch.
 */
// export const getSellerQuotationById = async (req, res) => {
//   const { id } = req.params;
//   const sellerId = "6870e6e558e2ba32d6b1eb33";

//   if (!sellerId)
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(sellerId)) {
//     return res.status(400).json({ success: false, message: "Invalid id" });
//   }

//   const inquiryObjectId = new Types.ObjectId(id);
//   const sellerObjectId = new Types.ObjectId(sellerId);

//   try {
//     const pipeline = [
//       {
//         $match: {
//           _id: inquiryObjectId,
//           sellerId: sellerObjectId,
//           isDeleted: false,
//         },
//       },
//       // lookup product with limited fields
//       {
//         $lookup: {
//           from: "products", // collection name - adjust if different
//           let: { pid: "$productId" },
//           pipeline: [
//             { $match: { $expr: { $eq: ["$_id", "$$pid"] } } },
//             {
//               $project: {
//                 _id: 1,
//                 productName: 1,
//                 productImages: 1,
//                 category: 1,
//                 subCategory: 1,
//                 origin: 1,
//                 pricePerUnit: 1,
//                 priceUnit: 1,
//                 color: 1,
//                 grade: 1,
//                 weight: 1,
//                 weightMeasurement: 1,
//                 size: 1,
//               },
//             },
//           ],
//           as: "product",
//         },
//       },
//       // lookup user (buyer) with limited fields
//       {
//         $lookup: {
//           from: "users",
//           let: { uid: "$userId" },
//           pipeline: [
//             { $match: { $expr: { $eq: ["$_id", "$$uid"] } } },
//             { $project: { _id: 1, name: 1, email: 1 } },
//           ],
//           as: "buyer",
//         },
//       },
//       // unwind arrays to objects (if exist)
//       { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
//       { $unwind: { path: "$buyer", preserveNullAndEmptyArrays: true } },

//       // Project the final shape directly on DB side (small transfer)
//       {
//         $project: {
//           _id: 1,
//           quantity: 1,
//           message: 1,
//           status: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           country: 1,
//           countryCode: 1,
//           readInfo: 1,
//           "buyer._id": 1,
//           "buyer.name": 1,
//           "buyer.email": 1,
//           "product._id": 1,
//           "product.productName": 1,
//           "product.productImages": 1,
//           "product.category": 1,
//           "product.subCategory": 1,
//           "product.origin": 1,
//           "product.pricePerUnit": 1,
//           "product.priceUnit": 1,
//           "product.color": 1,
//           "product.grade": 1,
//           "product.weight": 1,
//           "product.weightMeasurement": 1,
//           "product.size": 1,
//         },
//       },
//       // transform into UI-friendly shape
//       {
//         $addFields: {
//           "buyer.idShort": { $substr: [{ $toString: "$buyer._id" }, 6] },
//         },
//       },
//       {
//         $project: {
//           data: {
//             buyer: {
//               name: { $ifNull: ["$buyer.name", "Unknown"] },
//               id: { $ifNull: ["$buyer.idShort", "Unknown"] },
//               email: { $ifNull: ["$buyer.email", "N/A"] },
//             },
//             inquiry: {
//               id: "$_id",
//               quantity: { $ifNull: ["$quantity", 0] },
//               message: { $ifNull: ["$message", ""] },
//               status: { $ifNull: ["$status", "Unknown"] },
//               readInfo: "$readInfo",
//               country: "$country",
//               countryCode: "$countryCode",
//               createdAt: "$createdAt",
//               updatedAt: "$updatedAt",
//             },
//             product: {
//               productName: { $ifNull: ["$product.productName", "—"] },
//               category: {
//                 $cond: [
//                   {
//                     $and: [
//                       { $isArray: "$product.category" },
//                       { $gt: [{ $size: "$product.category" }, 0] },
//                     ],
//                   },
//                   { $arrayElemAt: ["$product.category", 0] },
//                   { $ifNull: ["$product.category", "—"] },
//                 ],
//               },
//               subCategory: {
//                 $cond: [
//                   {
//                     $and: [
//                       { $isArray: "$product.subCategory" },
//                       { $gt: [{ $size: "$product.subCategory" }, 0] },
//                     ],
//                   },
//                   { $arrayElemAt: ["$product.subCategory", 0] },
//                   { $ifNull: ["$product.subCategory", "—"] },
//                 ],
//               },
//               origin: { $ifNull: ["$product.origin", "—"] },
//               pricePerUnit: "$product.pricePerUnit",
//               priceUnit: "$product.priceUnit",
//               color: { $ifNull: ["$product.color", "—"] },
//               grade: { $ifNull: ["$product.grade", "—"] },
//               weight: { $ifNull: ["$product.weight", "—"] },
//               weightMeasurement: {
//                 $ifNull: ["$product.weightMeasurement", "—"],
//               },
//               size: { $ifNull: ["$product.size", "—"] },
//               images: { $ifNull: ["$product.productImages", []] },
//             },
//           },
//         },
//       },
//       { $replaceRoot: { newRoot: { success: true, data: "$data" } } },
//     ];

//     const [result] = await Inquiry.aggregate(pipeline).allowDiskUse(false);

//     if (!result) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Inquiry not found" });
//     }

//     // Optionally format price on server or leave to front-end. Here we return raw pricePerUnit and priceUnit.
//     return res.status(200).json(result);
//   } catch (err) {
//     console.error("Error fetching quotation detail (agg):", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };