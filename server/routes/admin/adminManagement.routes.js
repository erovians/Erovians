import express from "express";
import {
  createAdmin,
  getAllAdmins,
  updateAdminPermissions,
  suspendAdmin,
  getMyPermissions,
} from "../../controller/admin/adminManagement.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../../middleware/buyer/auth.middleware.js";

const router = express.Router();

// Saare routes ke liye authentication zaroori hai
router.use(isAuthenticated);

// Super Admin only routes
router.post("/create", authorizeRoles("super_admin"), createAdmin);

router.get("/all", authorizeRoles("super_admin"), getAllAdmins);

router.patch(
  "/:adminId/permissions",
  authorizeRoles("super_admin"),
  updateAdminPermissions
);

router.patch("/:adminId/suspend", authorizeRoles("super_admin"), suspendAdmin);

// Admin + Super Admin - apni permissions dekh sake
router.get(
  "/my-permissions",
  authorizeRoles("admin", "sub_admin", "super_admin"),
  getMyPermissions
);

export default router;
