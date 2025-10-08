import Product from "../models/product.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.utils.js";
import mongoose from "mongoose";

// ✅ Add Product
export const addProductService = async (data, files) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const uploadedPublicIds = [];

  try {
    // Step 1️⃣: Extract & validate fields
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
      weightMeasurement,
      pricePerUnit,
      priceUnit,
      description,
    } = data;

    if (!companyId) throw new Error("Company ID is required");
    if (!productName) throw new Error("Product name is required");

    // ✅ Validate images (must be at least 3)
    if (!files?.length || files.length < 3) {
      throw new Error("At least 3 product images are required");
    }

    // Step 2️⃣: Parse size JSON if needed
    const parsedSize = typeof size === "string" ? JSON.parse(size) : size;

    // Step 3️⃣: Upload images to Cloudinary first
    const uploadPromises = files.map(async (file) => {
      const result = await uploadOnCloudinary(file.path, file.mimetype);
      if (!result?.secure_url) throw new Error("Image upload failed");
      uploadedPublicIds.push(result.public_id);
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Step 4️⃣: Create product with uploaded image URLs
    const [product] = await Product.create(
      [
        {
          companyId,
          productName,
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
          productImages: uploadedImages.map((i) => i.url),
        },
      ],
      { session }
    );

    // Step 5️⃣: Commit transaction
    await session.commitTransaction();
    session.endSession();

    return product;
  } catch (error) {
    // ❌ Rollback DB
    await session.abortTransaction();
    session.endSession();

    // ❌ Rollback Cloudinary uploads if any succeeded
    await Promise.all(
      uploadedPublicIds.map((id) => deleteFromCloudinary(id).catch(() => {}))
    );

    console.error("❌ addProductService failed:", error.message);
    throw new Error(error.message || "Failed to add product");
  }
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
