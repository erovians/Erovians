import { z } from "zod";

const MAX_LOGO_SIZE = 300 * 1024; // 300KB
const MAX_PHOTO_SIZE = 200 * 1024; // 200KB
const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5MB

// Step 1: Basic Company Details
export const stepOneSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters"),

  // ✅ NEW: Company Registration Number (CRITICAL)
  company_registration_number: z
    .string()
    .min(1, "Company registration number is required")
    .min(5, "Registration number must be at least 5 characters")
    .max(50, "Registration number cannot exceed 50 characters"),

  legalowner: z
    .string()
    .min(1, "Legal owner name is required")
    .min(2, "Legal owner must be at least 2 characters"),

  locationOfRegistration: z
    .string()
    .min(1, "Location is required")
    .min(2, "Location must be at least 2 characters"),

  companyRegistrationYear: z
    .string()
    .min(1, "Company registration year is required"),

  address: z.object({
    street: z
      .string()
      .min(1, "Street is required")
      .min(2, "Street must be at least 2 characters"),
    city: z
      .string()
      .min(1, "City is required")
      .min(2, "City must be at least 2 characters"),
    stateOrProvince: z
      .string()
      .min(1, "State/Province is required")
      .min(2, "State/Province must be at least 2 characters"),
    countryOrRegion: z
      .string()
      .min(1, "Country is required")
      .min(2, "Country must be at least 2 characters"),
    postalCode: z
      .string()
      .min(1, "Postal code is required")
      .min(4, "Postal code must be at least 4 characters"),
  }),

  mainCategory: z
    .array(z.string().trim().min(1, "Category name cannot be empty"))
    .min(1, "At least one main category is required"),

  mainProduct: z
    .array(z.string().trim().min(1, "Product name cannot be empty"))
    .min(1, "At least one product is required"),

  acceptedCurrency: z.array(z.string()).min(1, "Select at least one currency"),
  acceptedPaymentType: z
    .array(z.string())
    .min(1, "Select at least one payment type"),
  languageSpoken: z.array(z.string()).min(1, "Select at least one language"),

  totalEmployees: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      val === "" || val === undefined ? undefined : Number(val)
    ),

  businessType: z
    .enum([
      "manufacturer",
      "trading company",
      "distributor",
      "exporter",
      "importer",
      "service provider",
    ])
    .optional(),

  factorySize: z.string().optional(),
  factoryCountryOrRegion: z.string().optional(),
  contractManufacturing: z.boolean().optional(),

  numberOfProductionLines: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      val === "" || val === undefined ? undefined : Number(val)
    ),

  annualOutputValue: z.string().optional(),

  rdTeamSize: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      val === "" || val === undefined ? undefined : Number(val)
    ),

  tradeCapabilities: z.array(z.string()).optional(),
});

// Step 2: Company Introduction
export const stepTwoSchema = z.object({
  companyDescription: z
    .string()
    .min(1, "Company description is required")
    .min(50, "Company description must be at least 50 characters")
    .max(4000, "Company description cannot exceed 4000 characters"),

  logo: z
    .instanceof(File, { message: "Company logo is required" })
    .refine((file) => file.size <= MAX_LOGO_SIZE, {
      message: "Logo size should not exceed 300 KB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "Logo must be JPEG or PNG format",
      }
    ),

  companyPhotos: z
    .array(z.instanceof(File))
    .default([])
    .refine((files) => files.length > 0, {
      message: "At least one company photo is required",
    })
    .refine(
      (files) =>
        files.every((file) =>
          ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
        ),
      {
        message: "Each photo must be JPEG or PNG format",
      }
    )
    .refine((files) => files.every((file) => file.size <= MAX_PHOTO_SIZE), {
      message: "Each photo must not exceed 200 KB",
    }),

  companyVideos: z.array(z.instanceof(File)).optional(),

  // ✅ NEW: Registration Documents
  registration_documents: z
    .array(z.instanceof(File))
    .default([])
    .refine((files) => files.length > 0, {
      message: "At least one registration document is required",
    })
    .refine(
      (files) =>
        files.every((file) =>
          ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(
            file.type
          )
        ),
      {
        message: "Documents must be PDF, JPEG, or PNG format",
      }
    )
    .refine((files) => files.every((file) => file.size <= MAX_DOC_SIZE), {
      message: "Each document must not exceed 5 MB",
    }),
});
