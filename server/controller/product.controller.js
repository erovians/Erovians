// import Product from "../models/product.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

// export const addProduct = async (req, res) => {
//   try {
//     const {
//       companyId,
//       productName,
//       category,
//       subCategory,
//       grade,
//       color,
//       origin,
//       size, // JSON string
//       weight,
//       weightMeasurement,
//       pricePerUnit,
//       priceUnit,
//       description,
//     } = req.body;

//     const parsedSize = JSON.parse(size);

//     // Upload images to Cloudinary
//     const imageUrls = [];
//     for (const file of req.files) {
//       const uploaded = await uploadOnCloudinary(file.path, file.mimetype);
//       if (uploaded) imageUrls.push(uploaded.secure_url);
//     }

//     if (imageUrls.length < 3) {
//       return res.status(400).json({
//         success: false,
//         message: "At least 3 product images are required",
//       });
//     }

//     const product = new Product({
//       companyId,
//       productName,
//       productImages: imageUrls,
//       category,
//       subCategory,
//       grade,
//       color,
//       origin,
//       size: parsedSize,
//       weight,
//       weightMeasurement,
//       pricePerUnit,
//       priceUnit,
//       description,
//     });

//     const savedProduct = await product.save();

//     res.status(201).json({
//       success: true,
//       message: "Product added successfully",
//       data: savedProduct,
//     });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong while adding the product",
//     });
//   }
// };

// export const listAllProducts = async (req, res) => {
//   try {
//     const { companyId, category, subCategory, search, status } = req.query;

//     const filter = { companyId };

//     if (category) filter.category = category;
//     if (subCategory) filter.subCategory = subCategory;
//     if (status) filter.status = status;
//     if (search) filter.productName = { $regex: search, $options: "i" };

//     const products = await Product.find(filter).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: products,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching products",
//     });
//   }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching product:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching product",
//     });
//   }
// };

// export const updateProductStatus = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { status } = req.body;

//     if (!["active", "inactive"].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status. Must be 'active' or 'inactive'.",
//       });
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       productId,
//       { $set: { status } },
//       { new: true, runValidators: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Status updated successfully",
//       data: updatedProduct,
//     });
//   } catch (error) {
//     console.error("❌ Error updating status:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while updating status",
//     });
//   }
// };

// export const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId);

//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     await product.deleteOne();

//     res
//       .status(200)
//       .json({ success: true, message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const updateProductData = async (req, res) => {
//   try {
//     const productId = req.params.productId;
//     const updatedData = req.body;

//     const product = await Product.findByIdAndUpdate(productId, updatedData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     res.status(200).json({
//       success: true,
//       data: product,
//       message: "Product updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// export const bulkActivateProducts = async (req, res) => {
//   try {
//     const { productIds } = req.body;
//     await Product.updateMany(
//       { _id: { $in: productIds } },
//       { $set: { status: "active" } }
//     );
//     res.json({ success: true, message: "Products activated successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Activation failed" });
//   }
// };

// export const bulkDeactivateProducts = async (req, res) => {
//   try {
//     const { productIds } = req.body;
//     await Product.updateMany(
//       { _id: { $in: productIds } },
//       { $set: { status: "inactive" } }
//     );
//     res.json({ success: true, message: "Products deactivated successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Deactivation failed" });
//   }
// };

// export const bulkDeleteProducts = async (req, res) => {
//   try {
//     const { productIds } = req.body;
//     await Product.deleteMany({ _id: { $in: productIds } });
//     res.json({ success: true, message: "Products deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Deletion failed" });
//   }
// };
import {
  addProductService,
  listAllProductsService,
  getProductByIdService,
  updateProductStatusService,
  deleteProductService,
  updateProductDataService,
  bulkActivateProductsService,
  bulkDeactivateProductsService,
  bulkDeleteProductsService,
} from "../services/product.service.js";

// ✅ Add Product
export const addProduct = async (req, res) => {
  try {
    const savedProduct = await addProductService(req.body, req.files);
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while adding the product",
    });
  }
};

// ✅ List All Products
export const listAllProducts = async (req, res) => {
  try {
    const products = await listAllProductsService(req.query);
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching products",
    });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while fetching product",
    });
  }
};

// ✅ Update Product Status
export const updateProductStatus = async (req, res) => {
  try {
    const updatedProduct = await updateProductStatusService(
      req.params.productId,
      req.body.status
    );
    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while updating status",
    });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.productId);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ✅ Update Product Data
export const updateProductData = async (req, res) => {
  try {
    const product = await updateProductDataService(
      req.params.productId,
      req.body
    );
    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ✅ Bulk Actions
export const bulkActivateProducts = async (req, res) => {
  try {
    await bulkActivateProductsService(req.body.productIds);
    res.json({ success: true, message: "Products activated successfully" });
  } catch (error) {
    console.error("Error activating products:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Activation failed" });
  }
};

export const bulkDeactivateProducts = async (req, res) => {
  try {
    await bulkDeactivateProductsService(req.body.productIds);
    res.json({ success: true, message: "Products deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating products:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Deactivation failed",
    });
  }
};

export const bulkDeleteProducts = async (req, res) => {
  try {
    await bulkDeleteProductsService(req.body.productIds);
    res.json({ success: true, message: "Products deleted successfully" });
  } catch (error) {
    console.error("Error deleting products:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Deletion failed" });
  }
};
