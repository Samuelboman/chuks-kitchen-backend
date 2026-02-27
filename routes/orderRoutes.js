import express from "express";
import {
  placeOrder,
  getOrder,
  getOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/ordercontrollers.js";

const router = express.Router();

router.get("/", getOrders);
router.post("/", placeOrder);
router.get("/:id", getOrder);
router.patch("/:id/status", updateOrderStatus);
router.post("/:id/cancel", cancelOrder);

export default router;