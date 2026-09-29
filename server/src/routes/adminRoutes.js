import express from "express";
import {
  getCustomers,
  getCustomerById,
  updateCustomer,
  setCustomerStatus,
} from "../controllers/adminCustomerController.js";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  assignOrder,
  updateAdminNotes,
  getDashboardStats,
} from "../controllers/adminOrderController.js";
import {
  uploadReportFiles,
  deleteReportFile,
} from "../controllers/fileController.js";
import { uploadReportFiles as uploadMiddleware } from "../middleware/uploadMiddleware.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route in this file requires a logged-in admin
router.use(protect, authorize("admin"));

// Dashboard
router.get("/stats", getDashboardStats);

// Customers
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.patch("/customers/:id", updateCustomer);
router.patch("/customers/:id/status", setCustomerStatus);

// Orders
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/status", updateOrderStatus);
router.patch("/orders/:id/assign", assignOrder);
router.patch("/orders/:id/notes", updateAdminNotes);

// Report files
router.post("/orders/:id/files", uploadMiddleware, uploadReportFiles);
router.delete("/orders/:id/files/:fileId", deleteReportFile);

export default router;