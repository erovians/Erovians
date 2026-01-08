import WorkOrder from "../models/workorder.model.js";
import {
  createWorkOrderSchema,
  updateStatusSchema,
} from "../zodSchemas/seller/workOrder.schema.js";
import { cache } from "../services/cache.service.js";

// export const createWorkOrder = async (req, res) => {
//   try {
//     const sellerId = req.user?.userId || "68e75d397041d2bbc45e40cd";
//     const role = req.user?.role || "seller";

//     if (!sellerId || role !== "seller") {
//       return res
//         .status(403)
//         .json({ error: "Unauthorized: Seller access only" });
//     }

//     const parsed = createWorkOrderSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(400).json({
//         error: "Validation failed",
//         details: parsed.error.flatten().fieldErrors,
//       });
//     }

//     const payload = {
//       ...parsed.data,
//       sellerId,
//     };

//     const newWO = await WorkOrder.create(payload);

//     res.status(201).json({
//       message: "Work order created successfully",
//       workOrder: newWO,
//     });
//   } catch (err) {
//     console.error("CREATE_WORK_ORDER_ERROR:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const createWorkOrder = async (req, res) => {
  try {
    const sellerId = req?.user?.userId;

    if (!sellerId || !req.user.role?.includes("seller")) {
      return res.status(403).json({
        error: "Unauthorized: Seller access only",
      });
    }

    const parsed = createWorkOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const year = new Date().getFullYear();
    const counterKey = `workorder:counter:${year}`;

    const nextNumber = await cache.incr(counterKey);
    const formattedNumber = String(nextNumber).padStart(4, "0");

    const payload = {
      ...parsed.data,
      sellerId,
      wo_number: `WO-${year}-${formattedNumber}`,
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

    if (!sellerId || !req.user.role?.includes("seller")) {
      return res.status(403).json({
        error: "Unauthorized: Seller access only",
      });
    }

    const list = await WorkOrder.find({ sellerId })
      .sort({ createdAt: 1 })
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

    const { id } = req.params;

    if (!sellerId || !req.user.role?.includes("seller")) {
      return res.status(403).json({
        error: "Unauthorized: Seller access only",
      });
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

export const deleteWorkOrder = async (req, res) => {
  try {
    const sellerId = req.user?.userId;
    const { id } = req.params;

    if (!sellerId || !req.user.role?.includes("seller")) {
      return res.status(403).json({
        error: "Unauthorized: Seller access only",
      });
    }

    const existing = await WorkOrder.findOne({ _id: id, sellerId });
    if (!existing) {
      return res.status(404).json({
        error: "Work order not found or access denied",
      });
    }
    await WorkOrder.findByIdAndDelete(id);

    res.json({
      message: "Work order deleted successfully",
      deletedWorkOrderId: id,
    });
  } catch (err) {
    console.error("DELETE_WORK_ORDER_ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
