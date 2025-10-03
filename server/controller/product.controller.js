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
//     const { companyId } = req.query;
//     const filter = companyId ? { companyId } : {};

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

export const listAllProducts = async (req, res) => {
  try {
    // First try query param, then fallback to default static one
    const companyId = req.query.companyId || "651234abcd5678ef90123456";

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const filter = { companyId };

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("❌ Error listing products:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products",
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

export const updateProductFields = async (req, res) => {
  try {
    const { productId } = req.params;
    let updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    const allowedFields = [
      "productName",
      "productImages",
      "category",
      "subCategory",
      "grade",
      "color",
      "origin",
      "size.length",
      "size.width",
      "size.thickness",
      "weight",
      "pricePerUnit",
      "unit",
      "description",
    ];

    let updateObj = {};

    for (const [field, value] of Object.entries(updates)) {
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
    console.error("❌ Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating product",
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
