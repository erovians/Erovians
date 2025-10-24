import express from "express";
import { addReview, editReview, deleteReview } from "../controller/review.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyUser, addReview);             // Add a review
router.put("/:id",verifyUser, editReview);          // Edit a review 
router.delete("/:id",verifyUser, deleteReview);     // Delete a review 

export default router;
