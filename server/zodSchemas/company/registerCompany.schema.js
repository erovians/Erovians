// src/schemas/company/createCompany.schema.js
import { z } from "zod";

export const registerCompanySchema = z.object({
  sellerId: z.string().length(24, "Invalid SellerId"), // ObjectId as string
  companyBasicInfo: z.object({
    companyName: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name cannot exceed 100 characters"),
    address: z.object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      stateOrProvince: z.string().min(1, "State/Province is required"),
      countryOrRegion: z.string().min(1, "Country/Region is required"),
      postalCode: z.string().min(1, "Postal code is required"),
    }),
    legalowner: z
      .string()
      .min(2, "Legal owner must be at least 2 characters")
      .max(100, "Legal owner cannot exceed 100 characters"),
    locationOfRegistration: z
      .string()
      .min(2, "Location of registration must be at least 2 characters")
      .max(100, "Location of registration cannot exceed 100 characters"),
    companyRegistrationYear: z
      .string()
      .min(1, "Company registration Year is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format, must be a valid date string",
      }),
    mainCategory: z
      .array(z.string().min(1, "Category name cannot be empty"))
      .min(1, "At least one main category is required"),

    subCategory: z
      .array(z.string().min(1, "Product name cannot be empty"))
      .min(1, "At least one subcategory is required"),

    acceptedCurrency: z.preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z.array(z.string()).min(1, "At least one currency is required")
    ),
    acceptedPaymentType: z.preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z.array(z.string()).min(1, "At least one payment method is required")
    ),
    languageSpoken: z.preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z.array(z.string()).min(1, "At least one language is required")
    ),
    // ================= NEW FIELDS (FIX) =================

    totalEmployees: z
      .number()
      .min(1, "Total employees must be at least 1")
      .optional(),

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
      .number()
      .min(0, "Production lines cannot be negative")
      .optional(),

    annualOutputValue: z.string().optional(),

    rdTeamSize: z
      .number()
      .min(0, "R&D team size cannot be negative")
      .optional(),

    tradeCapabilities: z.array(z.string()).optional(),
  }),
  companyIntro: z.object({
    logo: z.string().optional(),
    companyDescription: z
      .string()
      .min(50, "Company description must be at least 50 characters"),
    companyPhotos: z.preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z.array(z.string().url("Each photo must be a valid URL")).optional()
    ),
    companyVideos: z.preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z.array(z.string().url("Each video must be a valid URL")).optional()
    ),
  }),
});
