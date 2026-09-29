import express from "express";
import {
  getQuote,
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
} from "../controllers/orderController.js";
import { downloadReportFile } from "../controllers/fileController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/quote", getQuote);

// Customer only
router.post("/", protect, authorize("customer"), createOrder);
router.get("/my", protect, authorize("customer"), getMyOrders);
router.get("/my/:id", protect, authorize("customer"), getMyOrderById);
router.patch("/my/:id/cancel", protect, authorize("customer"), cancelMyOrder);

// Customer (own orders) or admin
router.get("/:orderId/files/:fileId/download", protect, downloadReportFile);

export default router;