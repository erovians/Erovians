import express from "express";
import {
  getAllCategories,
  getProductsByCategory,
  getProductsBySubCategory,
} from "../../controller/buyer/category.controller.js";

const router = express.Router();

router.get("/all", getAllCategories);

router.get("/:categorySlug/products", getProductsByCategory);

router.get(
  "/:categorySlug/:subCategorySlug/products",
  getProductsBySubCategory
);

export default router;
