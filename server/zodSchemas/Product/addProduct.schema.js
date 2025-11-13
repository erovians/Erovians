import { z } from "zod";

// Strict backend validation schema
export const addProductSchema = z.object({
  productName: z
    .string()
    .min(3, "Product name must be at least 3 characters.")
    .max(100, "Product name cannot exceed 100 characters."),
  
//   productImages: z
//     .array(
//       z.object({
//         url: z.string().url("Each image must be a valid URL"),
//         publicId: z.string().min(1, "Each image must have a publicId"),
//       })
//     )
//     .min(3, "At least 3 images are required.")
//     .max(10, "No more than 10 images allowed."),

  category: z
    .string()
    .min(1, "Category is required")
     .refine(
    (val) => /^[A-Za-z&\-\s]+$/.test(val),
    "Category may only contain letters, spaces, '&', or '-'"
  ),
  
  subCategory: z
    .string()
    .min(1, "Subcategory is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), "Subcategory must contain only letters"),

  grade: z
    .string()
    .min(1, "Grade is required")
    .refine((val) => /^[A-Za-z0-9\s]+$/.test(val), "Grade must be alphanumeric"),

  color: z
    .string()
    .min(1, "Color is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), "Color must contain only letters"),

  origin: z
    .string()
    .min(1, "Origin is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), "Origin must contain only letters"),

  size: z.object({
    length: z.coerce.number().positive("Length must be a positive number"),
    lengthMeasurement: z.enum(["m", "ft"], "Invalid length unit"),
    width: z.coerce.number().positive("Width must be a positive number"),
    widthMeasurement: z.enum(["ft", "m"], "Invalid width unit"),
    thickness: z.coerce.number().positive("Thickness must be a positive number"),
    thicknessMeasurement: z.enum(["cm", "inch"], "Invalid thickness unit"),
  }),

  weight: z.coerce.number().positive("Weight must be a positive number"),
  weightMeasurement: z.enum(["kg", "ton"], "Invalid weight unit"),

  pricePerUnit: z.coerce.number().positive("Price per unit must be positive"),
  priceUnit: z.enum(["sq.m", "sq.ft", "piece"], "Invalid price unit"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
});
