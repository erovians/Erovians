import Order from "../models/Order.model.js";
import Product from "../models/product.model.js";

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;
    // const userId = "690ae30913ffba8sb7869fd75";

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
    const orders = await Order.find({ userId })
      .populate("productId", "name pricePerUnit")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const orders = await Order.find({ sellerId: sellerId })
      .populate("productId")
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
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

export const getCompletedOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    const orders = await Order.find({
      sellerId: sellerId,
      status: "delivered",
    })
      .populate("productId")
      .populate("userId")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    const orders = await Order.find({
      sellerId: sellerId,
      status: "pending",
    })
      .populate("productId")
      .populate("userId")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
