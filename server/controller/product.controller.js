import Product from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productType,
      grade,
      color,
      origin,
      size,
      finish,
      weight,
      pricePerUnit,
      currency,
      unit,
      minOrderQuantity,
      warrenty,
      stockAvailability,
      certifications,
      productImages,
      description,
      tags,
      discountPrice,
      seller, // pass seller id directly in body for testing
    } = req.body;

    const product = new Product({
      seller: seller || null,
      productName,
      productType,
      grade,
      color,
      origin,
      size,
      finish,
      weight,
      pricePerUnit,
      currency,
      unit,
      minOrderQuantity,
      warrenty,
      stockAvailability,
      certifications,
      productImages,
      description,
      tags,
      discountPrice,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const listProducts = async (req, res) => {
  try {
    const { sellerId } = req.query;

    let filter = {};
    if (sellerId) filter.seller = sellerId;

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error listing products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
