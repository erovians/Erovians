import Product from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

// ✅ Add Product
export const addProductService = async (data, files) => {
  const {
    companyId,
    productName,
    category,
    subCategory,
    grade,
    color,
    origin,
    size, // JSON string
    weight,
    weightMeasurement,
    pricePerUnit,
    priceUnit,
    description,
  } = data;

  console.log("whole data", data);

  const parsedSize = JSON.parse(size || "{}");

  // Upload images to Cloudinary
  const imageUrls = [];
  for (const file of files) {
    const uploaded = await uploadOnCloudinary(file.path, file.mimetype);
    if (uploaded) imageUrls.push(uploaded.secure_url);
  }

  if (imageUrls.length < 3) {
    throw new Error("At least 3 product images are required");
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
    weightMeasurement,
    pricePerUnit,
    priceUnit,
    description,
  });

  const savedProduct = await product.save();
  return savedProduct;
};

// ✅ List All Products
export const listAllProductsService = async (query) => {
  const { companyId, category, subCategory, search, status } = query;
  const filter = { companyId };

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (status) filter.status = status;
  if (search) filter.productName = { $regex: search, $options: "i" };

  return await Product.find(filter).sort({ createdAt: -1 });
};

// ✅ Get Product by ID
export const getProductByIdService = async (productId) => {
  return await Product.findById(productId);
};

// ✅ Update Product Status
export const updateProductStatusService = async (productId, status) => {
  if (!["active", "inactive"].includes(status)) {
    throw new Error("Invalid status. Must be 'active' or 'inactive'.");
  }

  return await Product.findByIdAndUpdate(
    productId,
    { $set: { status } },
    { new: true, runValidators: true }
  );
};

// ✅ Delete Product
export const deleteProductService = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");
  await product.deleteOne();
};

// ✅ Update Product Data
export const updateProductDataService = async (productId, updatedData) => {
  const product = await Product.findByIdAndUpdate(productId, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new Error("Product not found");
  return product;
};

// ✅ Bulk Actions
export const bulkActivateProductsService = async (productIds) => {
  await Product.updateMany(
    { _id: { $in: productIds } },
    { $set: { status: "active" } }
  );
};

export const bulkDeactivateProductsService = async (productIds) => {
  await Product.updateMany(
    { _id: { $in: productIds } },
    { $set: { status: "inactive" } }
  );
};

export const bulkDeleteProductsService = async (productIds) => {
  await Product.deleteMany({ _id: { $in: productIds } });
};
