import { Quotation } from "../models/quotation.model.js";
import Product from "../models/product.model.js";

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

export const getSellerQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.userId;

    const quotation = await Quotation.findOne({ _id: id, sellerId }).populate(
      "productId",
      "productName category subCategory productImages origin pricePerUnit priceUnit color grade weight weightMeasurement size"
    );
    // .populate("userId");

    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Inquiry not found" });
    }

    res.status(200).json({ success: true, quotation });
  } catch (error) {
    console.error("Error fetching quotation detail:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
