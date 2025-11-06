// models/Quotation.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Action audit entry for traceability.
 * actor: the userId who performed the action (could be seller, admin).
 * action: e.g. "mark_read", "flag", "mark_spam", "soft_delete", "restore", "assign_order"
 * meta: optional free-form details (reason, ip, userAgent).
 * createdAt: when the action happened.
 */
const auditEntrySchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User", required: false },
    action: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

/**
 * Read status tracking
 * We keep a last readAt and optionally a small array of readers if multi-reader semantics are needed.
 */
const readInfoSchema = new Schema(
  {
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    readBy: { type: Schema.Types.ObjectId, ref: "User" }, // who marked it read
  },
  { _id: false }
);

const inquirySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },

    // Core message
    quantity: { type: Number, required: true, min: 1 },
    message: { type: String, trim: true, maxlength: 2000 }, // increased to allow longer messages

    // Statuses and flags (frontend expects these)
    status: {
      type: String,
      enum: ["New", "Pending", "Ongoing", "Completed", "Cancelled"],
      default: "New",
      index: true,
    },
    isFlagged: { type: Boolean, default: false, index: true },
    isSpam: { type: Boolean, default: false, index: true },

    // Soft delete (recommended vs hard delete for audit)
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },

    // Read tracking & unread semantics
    readInfo: { type: readInfoSchema, default: () => ({}) },

    // Mark new / unread / unreadCount semantics
    isNew: { type: Boolean, default: true, index: true },

    // Link to an order (if created)
    orderId: { type: Schema.Types.ObjectId, ref: "Order", index: true },

    // Geolocation / platform metadata optionally used by front-end
    country: { type: String, maxlength: 100 },
    countryCode: { type: String, maxlength: 8 },
    platform: { type: String, maxlength: 50 }, // e.g. "1688", "L", "App"

    // Additional metadata for extensibility
    meta: { type: Schema.Types.Mixed, default: {} },

    // Audit trail of actions
    audit: { type: [auditEntrySchema], default: [] },

    // Optionally, attach small attachments metadata (not binary)
    attachments: [
      {
        filename: String,
        url: String,
        mimeType: String,
        size: Number,
      },
    ],
  },
  { timestamps: true, minimize: false }
);

/* ---------- INDEXES ---------- */
// compound indexes for common queries
inquirySchema.index({ sellerId: 1, status: 1, updatedAt: -1 });
inquirySchema.index({ sellerId: 1, isDeleted: 1, updatedAt: -1 });

/* ---------- MIDDLEWARE ---------- */
// sanitize message and limit audit growth
inquirySchema.pre("save", function (next) {
  if (this.message) {
    // collapse multiple newlines and trim
    this.message = String(this.message).replace(/\r\n|\r/g, "\n").replace(/\n{2,}/g, "\n\n").trim();
  }
  // cap audit length to last 200 entries to avoid unbounded growth (tune as needed)
  if (this.audit && this.audit.length > 200) {
    this.audit = this.audit.slice(-200);
  }
  next();
});

/* ---------- INSTANCE METHODS ---------- */

/**
 * Mark as read by actor
 * - sets readInfo, sets isNew false
 */
inquirySchema.methods.markRead = async function (actorId = null) {
  this.readInfo = { isRead: true, readAt: new Date(), readBy: actorId || undefined };
  this.isNew = false;
  this.audit.push({ actor: actorId, action: "mark_read" });
  return this.save();
};

inquirySchema.methods.markUnread = async function (actorId = null) {
  this.readInfo = { isRead: false, readAt: undefined, readBy: undefined };
  this.isNew = true;
  this.audit.push({ actor: actorId, action: "mark_unread" });
  return this.save();
};

inquirySchema.methods.toggleFlag = async function (actorId = null) {
  this.isFlagged = !this.isFlagged;
  this.audit.push({ actor: actorId, action: this.isFlagged ? "flag" : "unflag" });
  return this.save();
};

inquirySchema.methods.markSpam = async function (actorId = null, meta = {}) {
  this.isSpam = true;
  this.audit.push({ actor: actorId, action: "mark_spam", meta });
  return this.save();
};

inquirySchema.methods.unmarkSpam = async function (actorId = null, meta = {}) {
  this.isSpam = false;
  this.audit.push({ actor: actorId, action: "unmark_spam", meta });
  return this.save();
};

inquirySchema.methods.softDelete = async function (actorId = null, meta = {}) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = actorId;
  this.audit.push({ actor: actorId, action: "soft_delete", meta });
  return this.save();
};

inquirySchema.methods.restore = async function (actorId = null, meta = {}) {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  this.audit.push({ actor: actorId, action: "restore", meta });
  return this.save();
};

inquirySchema.methods.assignOrder = async function (orderId, actorId = null) {
  this.orderId = orderId;
  this.audit.push({ actor: actorId, action: "assign_order", meta: { orderId } });
  return this.save();
};

/* ---------- STATIC / BULK OPERATIONS ---------- */

/**
 * Bulk operations should run in a transaction in production.
 * This method performs bulk action for many ids.
 *
 * actions: {
 *   type: 'mark_read'|'mark_unread'|'flag'|'unflag'|'mark_spam'|'unmark_spam'|'delete'|'restore'|'assign_order',
 *   actorId, meta, orderId(optional)
 * }
 */
inquirySchema.statics.bulkAction = async function (ids = [], action = {}, opts = {}) {
  if (!Array.isArray(ids) || ids.length === 0) return { modifiedCount: 0 };

  const { type, actorId = null, meta = {}, orderId = null } = action;
  const session = opts.session || null;
  const Model = this;

  // Map action types to update docs
  const updates = [];
  const now = new Date();

  switch (type) {
    case "mark_read":
      return Model.updateMany({ _id: { $in: ids } }, {
        $set: { "readInfo.isRead": true, "readInfo.readAt": now, "isNew": false },
        $push: { audit: { actor: actorId, action: "mark_read", meta, createdAt: now } },
      }, { session });

    case "mark_unread":
      return Model.updateMany({ _id: { $in: ids } }, {
        $set: { "readInfo.isRead": false, "readInfo.readAt": null, "isNew": true },
        $push: { audit: { actor: actorId, action: "mark_unread", meta, createdAt: now } },
      }, { session });

    case "flag":
      return Model.updateMany({ _id: { $in: ids } }, {
        $set: { isFlagged: true },
        $push: { audit: { actor: actorId, action: "flag", meta, createdAt: now } },
      }, { session });

    case "unflag":
      return Model.updateMany({ _id: { $in: ids } }, {
        $set: { isFlagged: false },
        $push: { audit: { actor: actorId, action: "unflag", meta, createdAt: now } },
      }, { session });

    case "mark_spam":
      return Model.updateMany({ _id: { $in: ids } }, {
        $set: { isSpam: true },
        $push: { audit: { actor: actorId, action: "mark_spam", meta, createdAt: now } },
      }, { session });

    case "unmark_spam":
      return Model.updateMany({ _id: { $in: ids } }, {
        $set: { isSpam: false },
        $push: { audit: { actor: actorId, action: "unmark_spam", meta, createdAt: now } },
      }, { session });

    case "delete":
      return Model.updateMany({ _id: { $in: ids } }, {
        $set: { isDeleted: true, deletedAt: now, deletedBy: actorId },
        $push: { audit: { actor: actorId, action: "soft_delete", meta, createdAt: now } },
      }, { session });

    case "restore":
      return Model.updateMany({ _id: { $in: ids } }, {
        $set: { isDeleted: false, deletedAt: null, deletedBy: null },
        $push: { audit: { actor: actorId, action: "restore", meta, createdAt: now } },
      }, { session });

    case "assign_order":
      if (!orderId) throw new Error("assign_order requires orderId");
      return Model.updateMany({ _id: { $in: ids } }, {
        $set: { orderId },
        $push: { audit: { actor: actorId, action: "assign_order", meta: { orderId }, createdAt: now } },
      }, { session });

    default:
      throw new Error(`Unknown bulk action type: ${type}`);
  }
};

/* ---------- EXPORT ---------- */

export const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
