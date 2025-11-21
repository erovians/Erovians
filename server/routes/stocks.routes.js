import express from "express";
import {
  exportStocks,
  createStock,
  getStocks,
  importStocks,
} from "../controller/stocks.contoller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.get("/", getStocks);
router.post("/create", createStock);
router.post("/import", upload.single("file"), importStocks);
router.get("/export", exportStocks);

export default router;
