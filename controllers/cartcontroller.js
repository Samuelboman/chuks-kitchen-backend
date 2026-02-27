import Cart from "../models/cart.js";
import Food from "../models/food.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, foodId, quantity = 1 } = req.body;

    if (!userId || !foodId) return res.status(400).json({ message: "userId and foodId are required." });

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food item not found." });
    if (!food.available) return res.status(400).json({ message: `'${food.name}' is unavailable.` });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existing = cart.items.find((item) => item.food.toString() === foodId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ food: foodId, quantity });
    }

    await cart.save();
    await cart.populate("items.food", "name price available");

    res.status(200).json({ message: `'${food.name}' added to cart.`, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate("items.food", "name price available");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Cart is empty.", items: [], total: 0 });
    }

    const total = cart.items.reduce((sum, item) => sum + (item.food?.price || 0) * item.quantity, 0);

    res.status(200).json({ cart, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { userId, foodId } = req.params;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    const before = cart.items.length;
    cart.items = cart.items.filter((item) => item.food.toString() !== foodId);

    if (cart.items.length === before) return res.status(404).json({ message: "Item not in cart." });

    await cart.save();
    res.status(200).json({ message: "Item removed.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};