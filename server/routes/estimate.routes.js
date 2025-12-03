import express from "express";
import {
  estimateDistanceAndPrice,
  getPartners,
} from "../controller/estimate.controller.js";
import { sendQuote } from "../controller/sendQuote.controller.js";

const router = express.Router();

router.get("/partners", getPartners);
router.post("/estimate-distance", estimateDistanceAndPrice);
router.post("/send-quote", sendQuote);

export default router;
