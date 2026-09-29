import express from "express";
import {
  getQuote,
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/quote", getQuote);

// Customer only
router.post("/", protect, authorize("customer"), createOrder);
router.get("/my", protect, authorize("customer"), getMyOrders);
router.get("/my/:id", protect, authorize("customer"), getMyOrderById);
router.patch("/my/:id/cancel", protect, authorize("customer"), cancelMyOrder);

export default router;