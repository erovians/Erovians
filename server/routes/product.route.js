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
import { verifyUser, allowRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/add",
  verifyUser,
  allowRoles("seller"),
  upload.array("productImages", 10),
  addProduct
);
router.get("/list", verifyUser, listAllProducts);
router.get(
  "/:productId",
  verifyUser,
  allowRoles("seller", "admin", "buyer", "public"),
  getProductById
);
router.delete("/:productId", verifyUser, allowRoles("seller"), deleteProduct);
router.put("/:productId", verifyUser, allowRoles("seller"), updateProductData);
router.post(
  "/bulk-activate",
  verifyUser,
  allowRoles("seller"),
  bulkActivateProducts
);
router.post(
  "/bulk-deactivate",
  verifyUser,
  allowRoles("seller"),
  bulkDeactivateProducts
);
router.post(
  "/bulk-delete",
  verifyUser,
  allowRoles("seller"),
  bulkDeleteProducts
);

// router.patch("/update/:productId", updateProductFields);
router.patch(
  "/:productId/status",
  verifyUser,
  allowRoles("seller"),
  updateProductStatus
);

export default router;
