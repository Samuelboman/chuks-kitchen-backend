import express from "express";
import {
  addToCart,
  getCart,
  clearCart,
  removeCartItem,
} from "../controllers/cartcontroller.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/:userId", getCart);
router.delete("/:userId", clearCart);
router.delete("/:userId/item/:foodId", removeCartItem);

export default router;