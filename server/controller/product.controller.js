import Product from "../models/product.model.js";

// export const addProduct = async (req, res) => {
//   try {
//     const {
//       companyId,
//       productName,
//       productImages,
//       category,
//       subCategory,
//       grade,
//       color,
//       origin,
//       size,
//       weight,
//       pricePerUnit,
//       unit,
//       description,
//     } = req.body;

//     if (
//       !companyId ||
//       !productName ||
//       !productImages ||
//       !category ||
//       !subCategory ||
//       !grade ||
//       !color ||
//       !origin ||
//       !size ||
//       !weight ||
//       !pricePerUnit ||
//       !unit ||
//       !description
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be provided",
//       });
//     }

//     if (!Array.isArray(productImages) || productImages.length < 3) {
//       return res.status(400).json({
//         success: false,
//         message: "At least 3 product images are required",
//       });
//     }

//     if (!size.length || !size.width || !size.thickness) {
//       return res.status(400).json({
//         success: false,
//         message: "Size (length, width, thickness) must be provided",
//       });
//     }

//     const product = new Product({
//       companyId,
//       productName,
//       productImages,
//       category,
//       subCategory,
//       grade,
//       color,
//       origin,
//       size,
//       weight,
//       pricePerUnit,
//       unit,
//       description,
//     });

//     const savedProduct = await product.save();

//     return res.status(201).json({
//       success: true,
//       message: "Product added successfully",
//       data: savedProduct,
//     });
//   } catch (error) {
//     console.error("❌ Error adding product:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while adding the product",
//     });
//   }
// };

export const addProduct = async (req, res) => {
  try {
    const {
      companyId,
      productName,
      productImages,
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
    } = req.body;

    // Manual validation
    if (
      !companyId ||
      !productName ||
      !productImages ||
      !category ||
      !subCategory ||
      !grade ||
      !color ||
      !origin ||
      !size ||
      !weight ||
      !pricePerUnit ||
      !unit ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!Array.isArray(productImages) || productImages.length < 3) {
      return res.status(400).json({
        success: false,
        message: "At least 3 product images are required",
      });
    }

    if (!size.length || !size.width || !size.thickness) {
      return res.status(400).json({
        success: false,
        message: "Size (length, width, thickness) must be provided",
      });
    }

    const product = new Product({
      companyId,
      productName,
      productImages,
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

export const listAllProducts = async (req, res) => {
  try {
    const { companyId } = req.query;
    const filter = companyId ? { companyId } : {};

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
