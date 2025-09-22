import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Seller ID is required"],
      index: true,
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    productImages: {
      type: [String],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length >= 3;
        },
        message: "At least 3 product images are required",
      },
      required: [true, "Product images are required "],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Granite", "Marble"],
        message: "{VALUE} is not a valid category",
      },
      index: true,
    },
    subCategory: {
      type: String,
      required: [true, "subCategory is required"],
      index: true,
    },
    grade: {
      type: String,
      required: [true, "Grade is required"],
      enum: {
        values: ["A", "B", "C"],
        message: "{VALUE} is not a valid grade",
      },
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },
    origin: {
      type: String,
      required: [true, "Origin is required"],
      trim: true,
    },
    size: {
      length: {
        type: Number,
        required: [true, "Product length is required"],
        min: [1, "Length must be greater than 0"],
      },
      width: {
        type: Number,
        required: [true, "Product width is required"],
        min: [1, "Width must be greater than 0"],
      },
      thickness: {
        type: Number,
        required: [true, "Product thickness is required"],
        min: [1, "Thickness must be greater than 0"],
      },
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [1, "Weight must be greater than 0"],
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: [1, "Price per unit must be greater than 0"],
      index: true,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: {
        values: ["sq.ft", "sq.m", "piece"],
        message: "{VALUE} is not a valid unit",
      },
      default: "sq.ft",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, pricePerUnit: 1 });
ProductSchema.index({ sellerId: 1, category: 1 });

const Product = mongoose.model("Product", ProductSchema);

export default Product;
