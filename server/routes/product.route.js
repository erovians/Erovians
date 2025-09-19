import express from "express";
import { addProduct, listProducts } from "../controller/product.controller.js";

const router = express.Router();

router.post("/add", addProduct);

router.get("/list", listProducts);

export default router;
