import express from "express";
import {
  createCheckoutSession,
  verifyPayment,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer only
router.use(protect, authorize("customer"));

router.post("/checkout/:orderId", createCheckoutSession);
router.get("/verify/:sessionId", verifyPayment);

export default router;