import express from "express";
import {
  exportStocks,
  createStock,
  getStocks,
  importStocks,
} from "../../controller/seller/stocks.controller.js";
import { upload } from "../../middleware/multer.middleware.js";
import { isAuthenticated } from "../../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getStocks);
router.post("/create", isAuthenticated, createStock);
router.post("/import", isAuthenticated, upload.single("file"), importStocks);
router.get("/export", isAuthenticated, exportStocks);

export default router;
