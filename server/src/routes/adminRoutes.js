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
import {
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../controllers/enquiryController.js";
import {
  getTeam,
  addTeamMember,
  updateTeamMember,
  resendInvite,
} from "../controllers/adminTeamController.js";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
} from "../controllers/postController.js";
import {
  uploadReportFiles as uploadMiddleware,
  uploadBlogImage,
} from "../middleware/uploadMiddleware.js";
import {
  getSubscribers,
  exportSubscribers,
  deleteSubscriber,
} from "../controllers/subscriberController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route in this file requires a logged-in admin or employee.
// Employees only reach orders assigned to them (checked in the controllers).
router.use(protect, authorize("admin", "employee"));
const adminOnly = authorize("admin");

// Dashboard (employees get only their own order counts)
router.get("/stats", getDashboardStats);

// Orders
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/status", updateOrderStatus);
router.patch("/orders/:id/assign", adminOnly, assignOrder);
router.patch("/orders/:id/notes", updateAdminNotes);

// Report files
router.post("/orders/:id/files", uploadMiddleware, uploadReportFiles);
router.delete("/orders/:id/files/:fileId", deleteReportFile);

// Customers
router.get("/customers", adminOnly, getCustomers);
router.get("/customers/:id", adminOnly, getCustomerById);
router.patch("/customers/:id", adminOnly, updateCustomer);
router.patch("/customers/:id/status", adminOnly, setCustomerStatus);

// Team (admins and employees)
router.get("/team", adminOnly, getTeam);
router.post("/team", adminOnly, addTeamMember);
router.patch("/team/:id", adminOnly, updateTeamMember);
router.post("/team/:id/invite", adminOnly, resendInvite);

// Blog
router.get("/posts", adminOnly, getAllPosts);
router.post("/posts", adminOnly, createPost);
router.post("/posts/images", adminOnly, uploadBlogImage, uploadPostImage);
router.get("/posts/:id", adminOnly, getPostById);
router.patch("/posts/:id", adminOnly, updatePost);
router.delete("/posts/:id", adminOnly, deletePost);

// Newsletter subscribers
router.get("/subscribers", adminOnly, getSubscribers);
router.get("/subscribers/export", adminOnly, exportSubscribers);
router.delete("/subscribers/:id", adminOnly, deleteSubscriber);

// Contact form enquiries
router.get("/enquiries", adminOnly, getEnquiries);
router.patch("/enquiries/:id", adminOnly, updateEnquiryStatus);
router.delete("/enquiries/:id", adminOnly, deleteEnquiry);

export default router;
