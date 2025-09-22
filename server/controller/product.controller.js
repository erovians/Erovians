import Product from "../models/product.model.js";
import mongoose from "mongoose";

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
      seller,
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

export const listAllProducts = async (req, res) => {
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

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateProductFields = async (req, res) => {
  try {
    const { productId } = req.params;
    let updates = req.body;

    if (!Array.isArray(updates)) {
      updates = [updates];
    }

    const allowedFields = [
      "productName",
      "productType",
      "grade",
      "color",
      "origin",
      "size.length",
      "size.width",
      "size.thickness",
      "finish",
      "weight",
      "pricePerUnit",
      "currency",
      "unit",
      "minOrderQuantity",
      "warrenty",
      "stockAvailability",
      "productImages",
      "description",
      "tags",
      "discountPrice",
    ];

    let updateObj = {};

    for (let u of updates) {
      const { field, value } = u;

      if (!allowedFields.includes(field)) {
        return res.status(400).json({
          success: false,
          message: `Invalid field '${field}'. Allowed fields: ${allowedFields.join(
            ", "
          )}`,
        });
      }

      if (field.startsWith("size.")) {
        const subField = field.split(".")[1];
        updateObj[`size.${subField}`] = value;
      } else {
        updateObj[field] = value;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateObj },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
