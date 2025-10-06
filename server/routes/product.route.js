import express from "express";
import {
  addProduct,
  listAllProducts,
  // updateProductFields,
  getProductById,
  updateProductStatus,
  deleteProduct,
  updateProductData,
  bulkActivateProducts,
  bulkDeactivateProducts,
  bulkDeleteProducts,
} from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/add", upload.array("productImages", 10), addProduct);
router.get("/list", listAllProducts);
router.get("/:productId", getProductById);
router.delete("/:productId", deleteProduct);
router.put("/:productId", updateProductData);
router.post("/bulk-activate", bulkActivateProducts);
router.post("/bulk-deactivate", bulkDeactivateProducts);
router.post("/bulk-delete", bulkDeleteProducts);

// router.patch("/update/:productId", updateProductFields);
router.patch("/:productId/status", updateProductStatus);

export default router;
