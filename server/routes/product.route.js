import express from "express";
import {
  addProduct,
  listProducts,
  updateProductFields,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/add", addProduct);

router.get("/list", listProducts);

router.patch("/update/:productId", updateProductFields);

export default router;
