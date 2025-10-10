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
    const savedProduct = await addProductService(req.body, req.files, req.user.userId);
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
    const products = await listAllProductsService(req.query, req.user);
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
