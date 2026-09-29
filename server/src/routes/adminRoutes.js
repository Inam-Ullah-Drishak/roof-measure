import express from "express";
import {
  getCustomers,
  getCustomerById,
  updateCustomer,
  setCustomerStatus,
} from "../controllers/adminCustomerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route in this file requires a logged-in admin
router.use(protect, authorize("admin"));

// Customers
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.patch("/customers/:id", updateCustomer);
router.patch("/customers/:id/status", setCustomerStatus);

export default router;