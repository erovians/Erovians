import Order from "../../models/Order.model.js";
import Product from "../../models/product.model.js";
import xl from "exceljs";
import { cache } from "../../services/cache.service.js";

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    const roles = req.user.role || [];

    if (!roles.includes("user")) {
      return res.status(403).json({
        success: false,
        message: "Only users can place orders",
      });
    }

    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Product ID and User ID are required.",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1.",
      });
    }

    const product = await Product.findById(productId).populate("sellerId");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const totalPrice = Number(product.pricePerUnit) * quantity;

    const newOrder = await Order.create({
      productId,
      userId,
      sellerId: product.sellerId,
      quantity,
      totalPrice,
      status: "pending",
    });
    await cache.del(`orders:user:${userId}`);
    await cache.clearPattern(`orders:seller:${product.sellerId}*`);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: {
        id: newOrder._id,
        productId: product._id,
        sellerId: product.sellerId._id,
        totalPrice,
        quantity,
        status: newOrder.status,
        createdAt: newOrder.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while placing the order.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("productId")
      .populate("userId")
      .populate("sellerId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const roles = req.user.role || [];

    if (!roles.includes("user")) {
      return res.status(403).json({
        success: false,
        message: "Only users can view their orders",
      });
    }

    const cacheKey = `orders:user:${userId}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      console.log("🔥 Redis HIT getUserOrders:", cacheKey);
      return res.status(200).json({
        success: true,
        count: cached.length,
        orders: cached,
        fromCache: true,
      });
    }

    const orders = await Order.find({ userId })
      .populate("productId", "name pricePerUnit")
      .sort({ createdAt: -1 });

    await cache.set(cacheKey, orders, 600);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
      fromCache: false,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    console.log("userID from getUserOrder", sellerId);
    const roles = req.user.role || [];

    if (!roles.includes("seller")) {
      return res.status(403).json({
        success: false,
        message: "Only sellers can view seller orders",
      });
    }

    // const cacheKey = `orders:seller:${sellerId}`;

    // const cached = await cache.get(cacheKey);
    // if (cached) {
    //   console.log("🔥 Redis HIT getSellerOrders:", cacheKey);
    //   return res.status(200).json({
    //     success: true,
    //     count: cached.length,
    //     orders: cached,
    //     fromCache: true,
    //   });
    // }
    const orders = await Order.find({ sellerId: sellerId })
      .populate("productId")
      .populate("userId")
      .sort({ createdAt: -1 });

    // res.status(200).json({ success: true, count: orders.length, orders });
    // await cache.set(cacheKey, orders, 600);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
      fromCache: false,
    });
  } catch (error) {
    console.error("Error fetching seller orders:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const sellerId = req.user.userId;

    const roles = req.user.role || [];

    if (!roles.includes("seller") && !roles.includes("admin")) {
      return res.status(403).json({
        success: false,
        message: "Only sellers or admins can update order status",
      });
    }

    const validStatuses = [
      "pending",
      "accepted",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value." });
    }

    const order = await Order.findById(id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });

    if (String(order.sellerId) !== String(sellerId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this order.",
      });
    }

    order.status = status;
    await order.save();

    await cache.del(`orders:user:${order.userId}`);
    await cache.clearPattern(`orders:seller:${order.sellerId}*`);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error while updating order." });
  }
};

// export const getCompletedOrders = async (req, res) => {
//   try {
//     const sellerId = req.user.userId;

//     const orders = await Order.find({
//       sellerId: sellerId,
//       status: "delivered",
//     })
//       .populate("productId")
//       .populate("userId")
//       .sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     console.error("Error fetching completed orders:", error);
//     res.status(500).json({ success: false, message: "Server error." });
//   }
// };

// export const getPendingOrders = async (req, res) => {
//   try {
//     const sellerId = req.user.userId;

//     const orders = await Order.find({
//       sellerId: sellerId,
//       status: "pending",
//     })
//       .populate("productId")
//       .populate("userId")
//       .sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders,
//     });
//   } catch (error) {
//     console.error("Error fetching completed orders:", error);
//     res.status(500).json({ success: false, message: "Server error." });
//   }
// };

export const getCompletedOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const roles = req.user.role || [];

    if (!roles.includes("seller") && !roles.includes("admin")) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // const cacheKey = `orders:seller:${sellerId}:completed`;

    // const cached = await cache.get(cacheKey);
    // if (cached) {
    //   console.log("🔥 Redis HIT getCompletedOrders:", cacheKey);
    //   return res.status(200).json({
    //     success: true,
    //     count: cached.length,
    //     orders: cached,
    //     fromCache: true,
    //   });
    // }

    const orders = await Order.find({
      sellerId,
      status: "delivered",
    })
      .populate("productId")
      .populate("userId")
      .sort({ createdAt: -1 });

    // await cache.set(cacheKey, orders, 600);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
      fromCache: false,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const sellerId = req?.user?.userId;
    const roles = req.user.role || [];

    if (!roles.includes("seller") && !roles.includes("admin")) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // const cacheKey = `orders:seller:${sellerId}:pending`;

    // const cached = await cache.get(cacheKey);
    // if (cached) {
    //   console.log("🔥 Redis HIT getPendingOrders:", cacheKey);
    //   return res.status(200).json({
    //     success: true,
    //     count: cached.length,
    //     orders: cached,
    //     fromCache: true,
    //   });
    // }

    const orders = await Order.find({
      sellerId,
      status: "pending",
    })
      .populate("productId")
      .populate("userId")
      .populate("sellerId")
      .sort({ createdAt: -1 });

    // await cache.set(cacheKey, orders, 600);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
      fromCache: false,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const exportOrders = async (req, res) => {
  try {
    const roles = req.user.role || [];

    if (!roles.includes("seller") && !roles.includes("admin")) {
      return res.status(403).json({
        success: false,
        message: "Only admin can export orders",
      });
    }

    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("productId", "productName");

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Orders");

    ws.columns = [
      { header: "Order ID", key: "orderId", width: 22 },
      { header: "Client", key: "client", width: 25 },
      { header: "Product", key: "product", width: 25 },
      { header: "Status", key: "status", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];

    orders.forEach((o) => {
      ws.addRow({
        orderId: o.orderId || o._id,
        client: o?.userId?.name || "",
        product: o?.productId?.productName || "",
        status: o.status,
        amount: o.totalPrice,
        date: new Date(o.createdAt).toLocaleDateString(),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Export failed" });
  }
};
