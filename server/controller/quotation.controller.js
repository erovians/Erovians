import { Quotation } from "../models/quotation.model.js";
import Product from "../models/product.model.js";

export const createQuotation = async (req, res) => {
  try {
    const { userId, quantity, unitType, message } = req.body;
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
