import Product from "../models/product.model.js";
import Company from "../models/company.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.utils.js";
import mongoose from "mongoose";
import { cache } from "../services/cache.service.js";

// ✅ Add Product
export const addProductService = async (data, files, sellerId, companyId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const uploadedPublicIds = [];

  try {
    // Step 1️⃣: Extract & validate fields
    const {
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

    // Validate that seller owns the company
    const company = await Company.findOne({ _id: companyId, sellerId });
    if (!company) throw new Error("Invalid companyId for this seller");

    // ✅ Validate images (must be at least 3)
    if (!files?.length || files.length < 3) {
      throw new Error("At least 3 product images are required");
    }

    // Check each file size — 200 KB = 200 * 1024 bytes
    const maxSize = 200 * 1024; // 200 KB

    const oversized = files.filter((file) => file.size > maxSize);

    if (oversized.length > 0) {
      const names = oversized.map((f) => f.originalname).join(", ");
      throw new Error(`These images exceed 200KB: ${names}`);
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
          sellerId,
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
export const listAllProductsService = async (query, user) => {
  const { category, subCategory, search, status } = query;
  const filter = {};

  if (user.role === "seller") {
    // Seller dashboard → ignore any sellerId/companyId from frontend
    const company = await Company.findOne({ sellerId: user.userId });
    if (!company) throw new Error("Seller company not found");

    filter.sellerId = user.userId;
    filter.companyId = company._id;
  } else if (
    user.role === "buyer" ||
    user.role === "admin" ||
    user.role === "public"
  ) {
    // Buyer/Admin → frontend must pass sellerId or companyId
    const { sellerId, companyId } = query;
    if (sellerId) filter.sellerId = sellerId;
    if (companyId) filter.companyId = companyId;

    if (!sellerId && !companyId) {
      throw new Error("sellerId or companyId required for buyers/admin/public");
    }
  }

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

  // return await Product.findByIdAndUpdate(
  //   productId,
  //   { $set: { status } },
  //   { new: true, runValidators: true }
  // );
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: { status } },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) throw new Error("Product not found");

  await cache.del(`product:view:${productId}`);
  await cache.del(`product:view:${productId}:active`);
  await cache.del(`products:seller:${updatedProduct.sellerId}`);
  await cache.clearPattern("products:list:*");

  await cache.del(`company:${updatedProduct.companyId}`);

  return updatedProduct;
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
