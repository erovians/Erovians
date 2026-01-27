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
  getMyProducts,
} from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyUser, allowRoles } from "../middleware/auth.middleware.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/buyer/auth.middleware.js";

const router = express.Router();

router.get("/mine", isAuthenticated, listAllProducts);

router.post(
  "/add",
  isAuthenticated,
  authorizeRoles("seller"),
  upload.array("productImages", 10),
  addProduct
);
router.get("/list", isAuthenticated, listAllProducts);
router.get(
  "/:productId",
  isAuthenticated,
  authorizeRoles("seller", "admin", "buyer", "public"),
  getProductById
);
router.delete(
  "/:productId",
  isAuthenticated,
  allowRoles("seller"),
  deleteProduct
);
router.put(
  "/:productId",
  isAuthenticated,
  allowRoles("seller"),
  updateProductData
);
router.post(
  "/bulk-activate",
  isAuthenticated,
  authorizeRoles("seller"),
  bulkActivateProducts
);
router.post(
  "/bulk-deactivate",
  isAuthenticated,
  authorizeRoles("seller"),
  bulkDeactivateProducts
);
router.post(
  "/bulk-delete",
  isAuthenticated,
  authorizeRoles("seller"),
  bulkDeleteProducts
);

// router.patch("/update/:productId", updateProductFields);
router.patch(
  "/:productId/status",
  isAuthenticated,
  authorizeRoles("seller"),
  updateProductStatus
);

export default router;
