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
router.get("/list", verifyUser, listAllProducts);  // here keeping the :sellerId? optional because if admin and buyer send api request then it will get sellerId From frontend and if seller hit api it self then it will get from token. 
router.get("/:productId", verifyUser, getProductById); //get the perticular product details by product id
router.delete("/:productId", verifyUser, allowRoles("seller"), deleteProduct); // delete the perticular product by product id
router.put("/:productId", verifyUser, allowRoles("seller"), updateProductData); //
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
