import { z } from "zod";

const MAX_FILE_SIZE = 300 * 1024;

// Step 1: Basic Company Details
export const stepOneSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required") // empty
    .min(2, "Company name must be at least 2 characters"), // too short

  legalowner: z
    .string()
    .min(1, "legalowner Name is required") // empty
    .min(2, "legalowner must be at least 3 characters"), // too short

  locationOfRegistration: z
    .string()
    .min(1, "Location is required") // empty
    .min(2, "Location must be at least 2 characters"), // too short

  companyRegistrationYear: z
    .string()
    .min(1, "company registration Year is required"), // empty

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

  mainProduct: z
    .array(z.string().trim().min(1, "Product name cannot be empty"))
    .min(1, "At least one product is required"),

  acceptedCurrency: z.array(z.string()).min(1, "Select at least one currency"),
  acceptedPaymentType: z
    .array(z.string())
    .min(1, "Select at least one payment type"),
  languageSpoken: z.array(z.string()).min(1, "Select at least one language"),
});

// Step 2: Company Introduction
export const stepTwoSchema = z.object({
  companyDescription: z
    .string()
    .min(1, "Company description is required")
    .min(50, "Company description must be at least 50 characters"),

  logo: z
    .any()
    .refine((file) => !!file, "Logo is required")
    .refine((file) => file instanceof File, {
      message: "Please upload a valid file",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "The file size should not exceed 300kb",
    }),
  companyPhotos: z
    .array(z.any())
    .min(1, "At least one company photo is required")
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

  companyVideos: z.array(z.any()).optional(),
});
