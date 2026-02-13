// routes/seed.routes.js
import express from "express";
import {
  seedDatabase,
  clearDatabase,
  forceSeedDatabase,
} from "../../controller/seller/seed.controller.js";

const router = express.Router();

router.post("/seed", seedDatabase);
router.post("/seed/force", forceSeedDatabase);
router.delete("/clear", clearDatabase);

export default router;
