import { z } from "zod";

export const productFormSchema = z.object({
  // ========== PRODUCT TYPE (NEW) ==========
  product_type: z.enum(
    ["ready-to-go", "made-to-order", "CNC", "stone-cutting"],
    {
      errorMap: () => ({ message: "Please select a product type" }),
    }
  ),

  // ========== BASIC INFO ==========
  productName: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters")
    .trim(),

  product_sku: z.string().trim().optional().or(z.literal("")),

  productImages: z
    .array(z.instanceof(File))
    .default([])
    .refine((files) => files.length >= 3, {
      message: "At least 3 images are required",
    })
    .refine(
      (files) =>
        files.every(
          (file) =>
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/webp"
        ),
      {
        message: "Each image must be JPEG, PNG or WebP format",
      }
    )
    .refine((files) => files.every((file) => file.size <= 200 * 1024), {
      message: "Each image must not exceed 200 KB",
    }),

  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(3500, "Description cannot exceed 3500 characters")
    .trim(),

  // ========== SIZE ==========
  size: z.object({
    length: z
      .union([z.string(), z.number()])
      .refine((val) => val && Number(val) > 0, "Length must be greater than 0"),
    lengthMeasurement: z.enum(["ft", "m", "mm"], {
      errorMap: () => ({ message: "Select length unit" }),
    }),
    width: z
      .union([z.string(), z.number()])
      .refine((val) => val && Number(val) > 0, "Width must be greater than 0"),
    widthMeasurement: z.enum(["ft", "m", "mm"], {
      errorMap: () => ({ message: "Select width unit" }),
    }),
    thickness: z
      .union([z.string(), z.number()])
      .refine(
        (val) => val && Number(val) > 0,
        "Thickness must be greater than 0"
      ),
    thicknessMeasurement: z.enum(["inch", "cm", "mm"], {
      errorMap: () => ({ message: "Select thickness unit" }),
    }),
  }),

  // ========== WEIGHT ==========
  weight: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val && Number(val) >= 0.01,
      "Weight must be at least 0.01"
    ),
  weightMeasurement: z.enum(["kg", "ton"], {
    errorMap: () => ({ message: "Select weight unit" }),
  }),

  // ========== MATERIAL & ORIGIN (NEW) ==========
  product_material: z.string().min(2, "Product material is required").trim(),

  origin: z
    .string()
    .min(2, "Origin/Country is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "Origin must contain only letters and spaces",
    })
    .trim(),

  // ========== COMPLIANCE STANDARDS (NEW - OPTIONAL) ==========
  compliance_standards: z
    .object({
      ce_marking: z.boolean().optional(),
      material_standard: z.string().trim().optional().or(z.literal("")),
      technical_sheets: z.array(z.string()).optional().default([]),
      certificates: z.array(z.string()).optional().default([]),
    })
    .optional(),

  // ========== STOCK & SHIPPING (NEW) ==========
  available_stock: z
    .union([z.string(), z.number()])
    .refine((val) => val === "" || Number(val) >= 0, "Stock cannot be negative")
    .transform((val) => (val === "" ? 0 : Number(val)))
    .default(0),

  expected_shipping_time: z
    .union([z.string(), z.number()])
    .refine((val) => val === "" || Number(val) >= 1, "Minimum 1 day required")
    .transform((val) => (val === "" ? 7 : Number(val)))
    .default(7),

  batch_number: z.string().trim().optional().or(z.literal("")),

  // ========== CATEGORY ==========
  category: z
    .string()
    .min(1, "Category is required")
    .refine(
      (val) =>
        [
          "natural stones",
          "ceramic & tiles",
          "alternatives & finishes",
        ].includes(val),
      {
        message: "Invalid category selected",
      }
    ),

  subCategory: z.string().min(1, "Sub-category is required").trim(),

  grade: z.enum(["A", "B", "C"], {
    errorMap: () => ({ message: "Please select a grade (A, B, or C)" }),
  }),

  color: z
    .string()
    .min(2, "Color is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "Color must contain only letters and spaces",
    })
    .trim(),

  // ========== PRICING ==========
  pricePerUnit: z
    .union([z.string(), z.number()])
    .refine((val) => val && Number(val) > 0, "Price must be greater than 0"),
  priceUnit: z.enum(["sq.ft", "sq.m", "piece"], {
    errorMap: () => ({ message: "Select price unit" }),
  }),
});

// ========== EXCEL/CSV UPLOAD SCHEMA ==========
export const bulkProductSchema = z.array(
  z.object({
    productName: z.string().min(2).max(100),
    product_type: z.enum([
      "ready-to-go",
      "made-to-order",
      "CNC",
      "stone-cutting",
    ]),
    product_sku: z.string().optional(),
    description: z.string().min(50).max(3500),
    product_material: z.string().min(2),
    origin: z.string().min(2),
    category: z.string(),
    subCategory: z.string(),
    grade: z.enum(["A", "B", "C"]),
    color: z.string().min(2),
    length: z.number().positive(),
    lengthMeasurement: z.enum(["ft", "m", "mm"]),
    width: z.number().positive(),
    widthMeasurement: z.enum(["ft", "m", "mm"]),
    thickness: z.number().positive(),
    thicknessMeasurement: z.enum(["inch", "cm", "mm"]),
    weight: z.number().min(0.01),
    weightMeasurement: z.enum(["kg", "ton"]),
    pricePerUnit: z.number().positive(),
    priceUnit: z.enum(["sq.ft", "sq.m", "piece"]),
    available_stock: z.number().min(0).default(0),
    expected_shipping_time: z.number().min(1).default(7),
    batch_number: z.string().optional(),
  })
);
