import { z } from "zod";

export const certificateSchema = z.object({
  certificationName: z.string().min(1, "Certification name is required"),
  legalOwner: z.string().min(1, "Legal owner is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional(),
  Description: z.string().min(1, "Description is required"),
  sameAsRegistered: z.boolean().optional(),
  comments: z.string().optional(),
  file: z
    .any()
    .refine((file) => file instanceof File, "File is required")
    .optional(),
});
