import { z } from "zod";

export const productFormSchema = z.object({
  productName: z
    .string()
    .min(3, "Product name is required and must be at least 3 characters."),
  productImages: z
    .array(z.instanceof(File))
    .default([]) // 👈 ensures we always get an array, never undefined
    .refine((files) => files.length > 3, {
      message: "At least 3 images are required",
    })
    .refine(
      (files) =>
        files.every(
          (file) => file.type === "image/jpeg" || file.type === "image/png"
        ),
      {
        message: "Each photo must be JPEG or PNG format",
      }
    )
    .refine((files) => files.every((file) => file.size <= 200 * 1024), {
      message: "Each photo must not exceed 200 KB",
    }),

  category: z.string().min(1, "Category is required."),
  subCategory: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Subcategory is required",
      });
    } else if (!/^[A-Za-z\s]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Subcategory must contain only letters",
      });
    }
  }),
  grade: z.string().min(1, "Grade is required."),
  color: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Color is required",
      });
    } else if (!/^[A-Za-z\s]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Color must contain only letters",
      });
    }
  }),

  origin: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Origin is required",
      });
    } else if (!/^[A-Za-z\s]+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "origin must contain only letters",
      });
    }
  }),
  size: z.object({
    length: z
      .union([z.string(), z.number()])
      .refine((val) => !!val, "Length is required."),
    lengthMeasurement: z.string().min(1, "Length unit required."),
    width: z
      .union([z.string(), z.number()])
      .refine((val) => !!val, "Width is required."),
    widthMeasurement: z.string().min(1, "Width unit required."),
    thickness: z
      .union([z.string(), z.number()])
      .refine((val) => !!val, "Thickness is required."),
    thicknessMeasurement: z.string().min(1, "Thickness unit required."),
  }),
  weight: z
    .union([z.string(), z.number()])
    .refine((val) => !!val, "Weight is required."),
  weightMeasurement: z.string().min(1, "Weight unit is required."),
  pricePerUnit: z
    .union([z.string(), z.number()])
    .refine((val) => !!val, "Price per unit is required."),
  priceUnit: z.string().min(1, "Price unit is required."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
});
