import express from "express";
import {
  getCategories,
  seedCategories,
} from "../controller/category.controller.js";

const router = express.Router();

router.get("/fetch", getCategories);
router.post("/seed", seedCategories);

export default router;
