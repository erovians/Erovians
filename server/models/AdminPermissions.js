// models/AdminPermissions.js
import mongoose from "mongoose";

const AdminPermissionsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Admin type
    adminType: {
      type: String,
      enum: ["super-admin", "admin", "sub-admin"],
      required: true,
    },

    // Department/Responsibility
    department: {
      type: String,
      enum: [
        "seller-management",
        "buyer-management",
        "product-verification",
        "dispute-resolution",
        "kyc-kyb-verification",
        "contract-management",
        "finance-payments",
        "platform-settings",
        "all", // for super-admin
      ],
    },

    // Granular Permissions
    permissions: {
      // Seller Management
      canViewSellers: { type: Boolean, default: false },
      canApproveSellers: { type: Boolean, default: false },
      canSuspendSellers: { type: Boolean, default: false },
      canDeleteSellers: { type: Boolean, default: false },

      // Buyer Management
      canViewBuyers: { type: Boolean, default: false },
      canSuspendBuyers: { type: Boolean, default: false },

      // Product Management
      canViewProducts: { type: Boolean, default: false },
      canApproveProducts: { type: Boolean, default: false },
      canRejectProducts: { type: Boolean, default: false },
      canDeleteProducts: { type: Boolean, default: false },

      // KYC/KYB Verification
      canViewKYC: { type: Boolean, default: false },
      canApproveKYC: { type: Boolean, default: false },
      canRejectKYC: { type: Boolean, default: false },

      // Smart Contract Management
      canViewContracts: { type: Boolean, default: false },
      canEditContracts: { type: Boolean, default: false },
      canCancelContracts: { type: Boolean, default: false },

      // Dispute Resolution
      canViewDisputes: { type: Boolean, default: false },
      canMediateDisputes: { type: Boolean, default: false },
      canArbitrateDisputes: { type: Boolean, default: false },

      // Payment & Escrow
      canViewPayments: { type: Boolean, default: false },
      canReleaseEscrow: { type: Boolean, default: false },
      canRefundPayments: { type: Boolean, default: false },

      // Platform Settings
      canEditSettings: { type: Boolean, default: false },
      canManageAdmins: { type: Boolean, default: false },
      canViewAnalytics: { type: Boolean, default: false },
      canExportData: { type: Boolean, default: false },
    },

    // Access Restrictions
    restrictions: {
      maxSellerApprovals: { type: Number, default: null }, // null = unlimited
      maxDisputeResolutions: { type: Number, default: null },
      allowedRegions: [String], // Regional restrictions
      workingHours: {
        start: String, // "09:00"
        end: String, // "18:00"
      },
    },

    // Audit Trail
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
AdminPermissionsSchema.index({ userId: 1 }, { unique: true });
AdminPermissionsSchema.index({ adminType: 1, isActive: 1 });

const AdminPermissions = mongoose.model(
  "AdminPermissions",
  AdminPermissionsSchema
);
export default AdminPermissions;
