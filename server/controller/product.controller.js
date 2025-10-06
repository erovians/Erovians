import Product from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

export const addProduct = async (req, res) => {
  try {
    const {
      companyId,
      productName,
      category,
      subCategory,
      grade,
      color,
      origin,
      size,
      weight,
      pricePerUnit,
      unit,
      description,
      // status,
    } = req.body;

    // ✅ Parse size JSON
    const parsedSize = JSON.parse(size);

    // ✅ Upload all files to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      const uploaded = await uploadOnCloudinary(file.path, file.mimetype);
      if (uploaded) imageUrls.push(uploaded.secure_url);
    }

    if (imageUrls.length < 3) {
      return res.status(400).json({
        success: false,
        message: "At least 3 product images are required",
      });
    }

    const product = new Product({
      companyId,
      productName,
      productImages: imageUrls,
      category,
      subCategory,
      grade,
      color,
      origin,
      size: parsedSize,
      weight,
      pricePerUnit,
      unit,
      description,
      // status,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding the product",
    });
  }
};

// export const listAllProducts = async (req, res) => {
//   try {
//     const companyId = req.query.companyId || "651234abcd5678ef90123456";
//     if (!companyId) {
//       return res.status(400).json({
//         success: false,
//         message: "Company ID is required",
//       });
//     }

//     console.log(req.query);

//     // Build dynamic filter
//     // const filter = { companyId };

//     const filter = { companyId };

//     if (req.query.category && req.query.category !== "") {
//       filter.category = req.query.category;
//     }

//     if (req.query.subCategory && req.query.subCategory !== "") {
//       filter.subCategory = {
//         $regex: `^${req.query.subCategory}$`,
//         $options: "i",
//       };
//     }

//     if (req.query.search && req.query.search.trim() !== "") {
//       filter.productName = { $regex: req.query.search, $options: "i" };
//     }

//     const products = await Product.find(filter).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: products.length,
//       data: products,
//     });
//   } catch (error) {
//     console.error("❌ Error listing products:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching products",
//     });
//   }
// };
// controllers/productController.js
export const listAllProducts = async (req, res) => {
  try {
    const { companyId, category, subCategory, search, status } = req.query;

    const filter = { companyId };

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (status) filter.status = status;
    if (search) filter.productName = { $regex: search, $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
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
    console.error("❌ Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching product",
    });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'active' or 'inactive'.",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating status",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await product.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProductData = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedData = req.body;

    const product = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
