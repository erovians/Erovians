import WorkOrder from "../models/workorder.model.js";
import {
  createWorkOrderSchema,
  updateStatusSchema,
} from "../zodSchemas/seller/workOrder.schema.js";

export const createWorkOrder = async (req, res) => {
  try {
    const sellerId = req.user?.userId;
    const role = req.user?.role;

    if (!sellerId || role !== "seller") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Seller access only" });
    }

    // Validate body
    const parsed = createWorkOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const payload = {
      ...parsed.data,
      sellerId,
    };

    const newWO = await WorkOrder.create(payload);

    res.status(201).json({
      message: "Work order created successfully",
      workOrder: newWO,
    });
  } catch (err) {
    console.error("CREATE_WORK_ORDER_ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWorkOrders = async (req, res) => {
  try {
    const sellerId = req.user?.userId;
    const role = req.user?.role;

    if (!sellerId || role !== "seller") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Seller access only" });
    }

    const list = await WorkOrder.find({ sellerId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      count: list.length,
      workOrders: list,
    });
  } catch (err) {
    console.error("GET_WORK_ORDERS_ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateWorkOrderStatus = async (req, res) => {
  try {
    const sellerId = req.user?.userId;
    const role = req.user?.role;
    const { id } = req.params;

    if (!sellerId || role !== "seller") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Seller access only" });
    }

    // Validate
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const existing = await WorkOrder.findOne({ _id: id, sellerId });
    if (!existing) {
      return res
        .status(404)
        .json({ error: "Work order not found or access denied" });
    }

    const updated = await WorkOrder.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true }
    );

    res.json({
      message: "Status updated successfully",
      workOrder: updated,
    });
  } catch (err) {
    console.error("UPDATE_WORK_ORDER_ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
