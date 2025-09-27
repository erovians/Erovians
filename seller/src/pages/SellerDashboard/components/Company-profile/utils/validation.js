import { z } from "zod";

// Step 1: Basic Company Details
export const stepOneSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required") // empty
    .min(2, "Company name must be at least 2 characters"), // too short

  locationOfRegistration: z
    .string()
    .min(1, "Location is required") // empty
    .min(2, "Location must be at least 2 characters"), // too short

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

  mainCategory: z.string().nonempty("Main category is required"),
  subCategory: z.string().nonempty("Sub category is required"),

  acceptedCurrency: z
    .array(z.string())
    .min(1, "Select at least one currency"),
  acceptedPaymentType: z
    .array(z.string())
    .min(1, "Select at least one payment type"),
  languageSpoken: z
    .array(z.string())
    .min(1, "Select at least one language"),
});

// Step 2: Company Introduction
export const stepTwoSchema = z.object({
  companyDescription: z
    .string()
    .min(1, "Company description is required")
    .min(50, "Company description must be at least 50 characters"),

  logo: z
    .any()
    .refine((file) => !!file, "Logo is required"),

  companyPhotos: z
    .array(z.any())
    .min(1, "At least one company photo is required"),

  companyVideos: z
    .array(z.any())
    .optional(),
});

// Step 3: Certificates
export const stepThreeSchema = z.object({
  certificates: z
    .array(z.any())
    .min(1, "Upload at least one certificate"),
});
