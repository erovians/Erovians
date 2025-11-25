import { z } from "zod";

export const stockSchema = z.object({
  lot: z.string().min(1, "Lot is required"),
  material: z.string().min(1, "Material is required"),
  thickness: z.string().min(1, "Thickness is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  location: z.string().min(1, "Location is required"),
  quality: z.string().min(1, "Quality is required"),
  qty: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, {
    message: "Quantity must be greater than 0",
  }),
});
