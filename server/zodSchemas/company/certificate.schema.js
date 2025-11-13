import { z } from "zod";

export const certificateSchema = z.object({
  companyId: z.string().length(24, "Invalid company ID"),
  type: z.string().min(1, "Type is required"),
  certificationName: z.string().min(1, "Certification name is required"),
  legalOwner: z.string().min(1, "Legal owner name is required"),
  issueDate: z.preprocess((val) => (val ? new Date(val) : val), z.date()),
  expiryDate: z
    .preprocess((val) => (val ? new Date(val) : val), z.date())
    .optional(),
  Description: z.string().min(1, "Description is required"),
});
