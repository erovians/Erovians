import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Audit entry schema - tracks all actions
 */
const auditEntrySchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true, index: true },
    meta: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

/**
 * Read info schema - tracks read status
 */
const readInfoSchema = new Schema(
  {
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    readBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const inquirySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    // Core inquiry data
    quantity: { type: Number, required: true, min: 1 },
    message: { type: String, trim: true, maxlength: 2000 },

    // Status tracking - SIMPLIFIED (removed redundant "New" status)
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },

    // Boolean flags for quick filtering
    isNew: { type: Boolean, default: true, index: true },
    isFlagged: { type: Boolean, default: false, index: true },
    isSpam: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },

    // Soft delete tracking
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },

    // Read tracking
    readInfo: { type: readInfoSchema, default: () => ({}) },

    // Order linkage
    orderId: { type: Schema.Types.ObjectId, ref: "Order", sparse: true },

    // Metadata
    country: { type: String, maxlength: 100 },
    countryCode: { type: String, maxlength: 8 },
    platform: { type: String, maxlength: 50 },

    // Extensibility
    meta: { type: Schema.Types.Mixed, default: {} },

    // Audit trail (capped at 200 entries)
    audit: {
      type: [auditEntrySchema],
      default: [],
      validate: {
        validator: (v) => v.length <= 200,
        message: "Audit trail cannot exceed 200 entries",
      },
    },

    // Attachments metadata (optional)
    attachments: [
      {
        filename: String,
        url: String,
        mimeType: String,
        size: Number,
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
    // Add version key for optimistic locking
    versionKey: "__v",
  }
);

/* ========== INDEXES ========== */
// Compound indexes for common query patterns
inquirySchema.index({ sellerId: 1, status: 1, updatedAt: -1 });
inquirySchema.index({ sellerId: 1, isDeleted: 1, isSpam: 1, updatedAt: -1 });
inquirySchema.index({ sellerId: 1, isNew: 1, updatedAt: -1 });
inquirySchema.index({ sellerId: 1, isFlagged: 1, updatedAt: -1 });
inquirySchema.index({ sellerId: 1, "readInfo.isRead": 1, updatedAt: -1 });

/* ========== MIDDLEWARE ========== */
// Auto-sanitize message before save
inquirySchema.pre("save", function (next) {
  if (this.isModified("message") && this.message) {
    this.message = this.message
      .replace(/\r\n|\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  // Cap audit length to prevent unbounded growth
  if (this.audit && this.audit.length > 200) {
    this.audit = this.audit.slice(-200);
  }

  next();
});

/* ========== INSTANCE METHODS ========== */

/**
 * Mark inquiry as viewed - clears isNew flag
 * This is the PRIMARY method to use when viewing an inquiry
 */
inquirySchema.methods.markAsViewed = async function (actorId = null) {
  // Only update if actually new (avoid unnecessary writes)
  if (!this.isNew) return this;

  this.isNew = false;
  this.readInfo.isRead = true;
  this.readInfo.readAt = new Date();
  this.readInfo.readBy = actorId;

  this.audit.push({
    actor: actorId,
    action: "mark_viewed",
    meta: { timestamp: new Date() },
  });

  return this.save();
};

/**
 * Mark as read (separate from viewed)
 */
inquirySchema.methods.markRead = async function (actorId = null) {
  this.readInfo.isRead = true;
  this.readInfo.readAt = new Date();
  this.readInfo.readBy = actorId;
  this.isNew = false; // Also clear new flag
  this.audit.push({ actor: actorId, action: "mark_read" });
  return this.save();
};

/**
 * Mark as unread
 */
inquirySchema.methods.markUnread = async function (actorId = null) {
  this.readInfo.isRead = false;
  this.readInfo.readAt = undefined;
  this.readInfo.readBy = undefined;
  this.audit.push({ actor: actorId, action: "mark_unread" });
  return this.save();
};

/**
 * Toggle flag
 */
inquirySchema.methods.toggleFlag = async function (actorId = null) {
  this.isFlagged = !this.isFlagged;
  this.audit.push({
    actor: actorId,
    action: this.isFlagged ? "flag" : "unflag",
  });
  return this.save();
};

/**
 * Mark as spam
 */
inquirySchema.methods.markSpam = async function (actorId = null, meta = {}) {
  this.isSpam = true;
  this.audit.push({ actor: actorId, action: "mark_spam", meta });
  return this.save();
};

/**
 * Unmark spam
 */
inquirySchema.methods.unmarkSpam = async function (actorId = null, meta = {}) {
  this.isSpam = false;
  this.audit.push({ actor: actorId, action: "unmark_spam", meta });
  return this.save();
};

/**
 * Soft delete
 */
inquirySchema.methods.softDelete = async function (actorId = null, meta = {}) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = actorId;
  this.audit.push({ actor: actorId, action: "soft_delete", meta });
  return this.save();
};

/**
 * Restore from soft delete
 */
inquirySchema.methods.restore = async function (actorId = null, meta = {}) {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  this.audit.push({ actor: actorId, action: "restore", meta });
  return this.save();
};

/**
 * Assign to order
 */
inquirySchema.methods.assignOrder = async function (orderId, actorId = null) {
  this.orderId = orderId;
  this.status = "Ongoing"; // Auto-update status
  this.audit.push({
    actor: actorId,
    action: "assign_order",
    meta: { orderId },
  });
  return this.save();
};

/* ========== STATIC METHODS ========== */

/**
 * Bulk action handler - SINGLE SOURCE OF TRUTH
 * All bulk operations go through this method
 */
inquirySchema.statics.bulkAction = async function (
  ids = [],
  action = {},
  opts = {}
) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { modifiedCount: 0, matchedCount: 0 };
  }

  const { type, actorId = null, meta = {}, orderId = null } = action;
  const session = opts.session || null;
  const now = new Date();

  const auditEntry = {
    actor: actorId,
    action: type,
    meta,
    createdAt: now,
  };

  let updateQuery;

  switch (type) {
    case "mark_viewed":
      // Mark as viewed - clears isNew and marks as read
      updateQuery = {
        $set: {
          isNew: false,
          "readInfo.isRead": true,
          "readInfo.readAt": now,
          "readInfo.readBy": actorId,
        },
        $push: { audit: auditEntry },
      };
      break;

    case "mark_read":
      updateQuery = {
        $set: {
          "readInfo.isRead": true,
          "readInfo.readAt": now,
          "readInfo.readBy": actorId,
          isNew: false,
        },
        $push: { audit: auditEntry },
      };
      break;

    case "mark_unread":
      updateQuery = {
        $set: { "readInfo.isRead": false },
        $unset: { "readInfo.readAt": "", "readInfo.readBy": "" },
        $push: { audit: auditEntry },
      };
      break;

    case "flag":
      updateQuery = {
        $set: { isFlagged: true },
        $push: { audit: auditEntry },
      };
      break;

    case "unflag":
      updateQuery = {
        $set: { isFlagged: false },
        $push: { audit: auditEntry },
      };
      break;

    case "mark_spam":
      updateQuery = {
        $set: { isSpam: true },
        $push: { audit: auditEntry },
      };
      break;

    case "unmark_spam":
      updateQuery = {
        $set: { isSpam: false },
        $push: { audit: auditEntry },
      };
      break;

    case "delete":
      updateQuery = {
        $set: {
          isDeleted: true,
          deletedAt: now,
          deletedBy: actorId,
        },
        $push: { audit: auditEntry },
      };
      break;

    case "restore":
      updateQuery = {
        $set: { isDeleted: false },
        $unset: { deletedAt: "", deletedBy: "" },
        $push: { audit: auditEntry },
      };
      break;

    case "assign_order":
      if (!orderId) throw new Error("orderId required for assign_order");
      updateQuery = {
        $set: {
          orderId,
          status: "Ongoing",
        },
        $push: {
          audit: {
            ...auditEntry,
            meta: { ...meta, orderId },
          },
        },
      };
      break;

    default:
      throw new Error(`Unknown bulk action type: ${type}`);
  }

  const result = await this.updateMany({ _id: { $in: ids } }, updateQuery, {
    session,
  });

  return {
    action: type,
    modifiedCount: result.modifiedCount,
    matchedCount: result.matchedCount,
  };
};

/**
 * Build filter query for list operations
 * Centralizes filter logic to avoid duplication
 */
inquirySchema.statics.buildFilterQuery = function (filters = {}) {
  const {
    sellerId,
    tab = "All",
    statusTab = "All",
    showOnlyUnread = false,
    searchQuery = "",
  } = filters;

  const match = { sellerId };

  // Main tab filtering
  switch (tab) {
    case "Flagged":
      match.isFlagged = true;
      match.isDeleted = { $ne: true };
      match.isSpam = { $ne: true };
      break;
    case "Spam":
      match.isSpam = true;
      match.isDeleted = { $ne: true };
      break;
    case "Deleted":
      match.isDeleted = true;
      break;
    case "All":
    default:
      match.isDeleted = { $ne: true };
      match.isSpam = { $ne: true };
      break;
  }

  // Status tab filtering (additional filters)
  if (statusTab === "Pending for reply") {
    match.status = "Pending";
  } else if (statusTab === "New inquiry") {
    match.isNew = true;
  }

  // Unread filter
  if (showOnlyUnread) {
    match["readInfo.isRead"] = { $ne: true };
  }

  // Search query
  if (searchQuery) {
    const regex = new RegExp(
      searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    const or = [{ message: regex }, { country: regex }];
    if (mongoose.isValidObjectId(searchQuery)) {
      or.push({ _id: new mongoose.Types.ObjectId(searchQuery) });
    }
    match.$or = or;
  }

  return match;
};

/**
 * Get sort configuration
 */
inquirySchema.statics.getSortConfig = function (sortBy = "Latest") {
  switch (sortBy) {
    case "Oldest":
      return { updatedAt: 1 };
    case "Unread":
      return { "readInfo.isRead": 1, isNew: -1, updatedAt: -1 };
    default:
      return { updatedAt: -1 };
  }
};

/* ========== EXPORT ========== */
const Inquiry =
  mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
