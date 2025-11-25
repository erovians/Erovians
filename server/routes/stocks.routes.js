import express from "express";
import {
  exportStocks,
  createStock,
  getStocks,
  importStocks,
} from "../controller/stocks.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyUser, getStocks);
router.post("/create", verifyUser, createStock);
router.post("/import", verifyUser, upload.single("file"), importStocks);
router.get("/export", exportStocks);

export default router;
