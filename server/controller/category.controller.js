// category.controller.js

import Category from "../models/category.model.js";
import asyncHandler from "../middleware/buyer/asyncHandler.js";
import AppError from "../utils/buyer/AppError.js";
import logger from "../config/winston.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1 });

  logger.info(`Fetched ${categories.length} categories`);

  res.status(200).json({
    success: true,
    data: categories,
  });
});

// @desc    Seed categories from JSON
// @route   POST /api/categories/seed
// @access  Private/Admin
export const seedCategories = asyncHandler(async (req, res, next) => {
  const jsonPath = path.join(__dirname, "../data/categories.json");

  if (!fs.existsSync(jsonPath)) {
    return next(new AppError("Categories JSON file not found", 404));
  }

  const categoriesData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  await Category.deleteMany({});

  const categories = categoriesData.map((cat, index) => ({
    ...cat,
    order: index + 1,
    isActive: true,
  }));

  await Category.insertMany(categories);

  logger.info(`Seeded ${categories.length} categories successfully`);

  res.status(200).json({
    success: true,
    message: `${categories.length} categories seeded successfully`,
  });
});
