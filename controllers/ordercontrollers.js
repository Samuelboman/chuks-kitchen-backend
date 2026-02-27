import Order from "../models/order.js";
import Food from "../models/food.js";
import Cart from "../models/cart.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId, deliveryAddress } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!deliveryAddress) return res.status(400).json({ message: "Delivery address is required" });

    const cart = await Cart.findOne({ user: userId }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const unavailable = cart.items.filter((item) => !item.food || !item.food.available);
    if (unavailable.length > 0) {
      const names = unavailable.map((i) => i.food?.name || "Unknown");
      return res.status(400).json({ message: `Items no longer available: ${names.join(", ")}` });
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.food.price * item.quantity, 0
    );

    const order = await Order.create({
      user: userId,
      items: cart.items.map((item) => ({ food: item.food._id, quantity: item.quantity })),
      totalPrice,
      deliveryAddress,
      status: "Pending",
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "email phone")
      .populate("items.food", "name price");

    if (!order) return res.status(404).json({ message: "Order not found." });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { user: userId } : {};

    const orders = await Order.find(filter)
      .populate("user", "email phone")
      .populate("items.food", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders, total: orders.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Completed", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Valid: ${validStatuses.join(", ")}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (["Completed", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot update a ${order.status} order.` });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: `Status updated to '${status}'.`, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (!["Pending", "Confirmed"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel a '${order.status}' order.` });
    }

    order.status = "Cancelled";
    order.cancelReason = req.body.reason || "No reason provided.";
    await order.save();

    res.status(200).json({ message: "Order cancelled.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};