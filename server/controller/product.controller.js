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
import CompanyDetails from "../models/company.model.js";
import { addProductSchema } from "../zodSchemas/Product/addProduct.schema.js";
import Product from "../models/product.model.js";

// ✅ Add Product
export const addProduct = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    if (!sellerId) {
      return res
        .status(400)
        .json({ success: false, message: "sellerId is required" });
    }

    // 1️⃣ Validate text fields
    if (req.body.size && typeof req.body.size === "string") {
      //validate the size field
      try {
        req.body.size = JSON.parse(req.body.size);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in size field",
        });
      }
    }

    const parsedBody = addProductSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const formatErrors = (issues, parent = "") => {
        const messages = [];
        for (const key in issues) {
          if (key === "_errors") {
            if (issues[key].length > 0 && parent)
              messages.push(`${parent}: ${issues[key].join(", ")}`);
            continue;
          }
          messages.push(
            ...formatErrors(issues[key], parent ? `${parent}.${key}` : key)
          );
        }
        return messages;
      };

      const zodErrors = parsedBody.error.format();
      const messages = formatErrors(zodErrors);

      return res.status(400).json({
        success: false,
        message: messages.join("; "),
      });
    }

    const company = await CompanyDetails.findOne({ sellerId }).select("_id");

    const companyId = company?._id;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company not found for this seller. Please register a company first.",
      });
    }
    const savedProduct = await addProductService(
      parsedBody.data, //passing the validated data from zod schema
      req.files,
      sellerId,
      companyId
    );
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
    console.log(req.user);
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

// ✅ Get Product by ID  (old approch and problem that everyone can see and edit that product)
// export const getProductById = async (req, res) => {
//   try {
//     const product = await getProductByIdService(req.params.productId);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }
//     res.status(200).json({ success: true, data: product });
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong while fetching product",
//     });
//   }
// };
// export const getProductById = async (req, res) => {
//   try {
//     const productId = req.params.productId;

//     // ✅ Increase view count every time product is viewed
//     const product = await Product.findByIdAndUpdate(
//       productId,
//       { $inc: { views: 1 } },
//       { new: true }
//     );

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong while fetching product",
//     });
//   }
// };

//best approch because handling everything in this role base access and just to add View Count Logic (Conditional and Debounced)
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userRole = req.user.role; // Access the role set by your middleware
    const userId = req.user.UserId;

    let findFilter = { _id: productId };
    let updateViews = false;
    
    // --- Authorization Logic ---
    if (userRole === 'seller') {
      // Seller can only view their own product
      findFilter.sellerId = userId; 
    } else if (userRole === 'buyer' || userRole === 'public') {
      // Public/Buyer view: only show published products and increment views
      findFilter.status = 'active'; 
      updateViews = true;
    } else if (userRole === 'admin') {
      // Admin can view any product, published or not. No extra filter needed.
    }

    // 1. Fetch the product using the role-specific filter
    const product = await Product.findOne(findFilter);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized access",
      });
    }

    // 2. View Count Logic (Conditional and Debounced)
    if (updateViews) {
      // IMPORTANT: Call a separate, debounced service here to increment views
      // This keeps the primary request fast and prevents inflation.
      // Example: productViewService.logView(productId, req.ip || req.sessionID);
    }

    res.status(200).json({
      success: true,
      data: product,
    });
    
  } catch (error) {
    console.error(`Fetch Error:`, error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
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
