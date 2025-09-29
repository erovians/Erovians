import express from "express";
import {
  addProduct,
  listAllProducts,
  updateProductFields,
  getProductById,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/add", addProduct);
router.get("/list", listAllProducts);
router.get("/:productId", getProductById);

router.patch("/update/:productId", updateProductFields);

export default router;
