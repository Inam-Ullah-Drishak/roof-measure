import Order, { ORDER_STATUSES } from "../models/Order.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { expireCheckoutSession } from "./paymentController.js";
import { notifyReportReady } from "../utils/notifications.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Which status changes are allowed
const ALLOWED_TRANSITIONS = {
  pending: ["in_progress", "cancelled"],
  in_progress: ["completed", "pending", "cancelled"],
  completed: ["in_progress"], // reopen if the report needs a correction
  cancelled: ["pending"], // restore a cancelled order
};

// @route   GET /api/admin/orders
// @access  Admin
// Query: ?status=pending&paymentStatus=paid&search=RM-10001
//        &customer=<id>&assignedTo=<id>&from=2026-09-01&to=2026-09-30
//        &page=1&limit=20
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.paymentStatus) filter["payment.status"] = req.query.paymentStatus;
  if (req.query.customer) filter.customer = req.query.customer;
  if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) {
      const to = new Date(req.query.to);
      to.setHours(23, 59, 59, 999); // include the whole "to" day
      filter.createdAt.$lte = to;
    }
  }

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(String(req.query.search).trim()), "i");

    // Also match customers by name, email or company
    const matchingCustomers = await User.find({
      role: "customer",
      $or: [{ name: regex }, { email: regex }, { companyName: regex }],
    }).select("_id");

    filter.$or = [
      { orderNumber: regex },
      { "property.street": regex },
      { "property.city": regex },
      { "property.zipCode": regex },
      { claimNumber: regex },
      { referenceNumber: regex },
      { customer: { $in: matchingCustomers.map((c) => c._id) } },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("customer", "name email companyName phone")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.json({
    orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @route   GET /api/admin/orders/:id
// @access  Admin
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .select("+adminNotes")
    .populate("customer", "name email companyName phone isActive")
    .populate("assignedTo", "name email")
    .populate("statusHistory.changedBy", "name role");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({ order });
});

// @route   PATCH /api/admin/orders/:id/status
// @access  Admin
// Body: { "status": "in_progress", "note": "Started measuring" }
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body || {};

  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${ORDER_STATUSES.join(", ")}`,
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === status) {
    return res.status(400).json({ message: `Order is already ${status}` });
  }

  const allowed = ALLOWED_TRANSITIONS[order.status] || [];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      message: `Cannot change status from ${order.status} to ${status}`,
    });
  }

  // A completed order must have at least one report file for the customer
  if (status === "completed" && order.reportFiles.length === 0) {
    return res.status(400).json({
      message: "Upload at least one report file before completing the order",
    });
  }

  order.status = status;

  if (status === "completed") order.completedAt = new Date();
  if (status === "cancelled") order.cancelledAt = new Date();
  if (status === "in_progress" || status === "pending") {
    order.completedAt = undefined;
    order.cancelledAt = undefined;
  }

  // Auto-assign to the admin who starts working on it
  if (status === "in_progress" && !order.assignedTo) {
    order.assignedTo = req.user._id;
  }

  order.statusHistory.push({
    status,
    note: note?.trim() || undefined,
    changedBy: req.user._id,
  });

  await order.save();
  if (status === "cancelled") await expireCheckoutSession(order);
  if (status === "completed") notifyReportReady(order);

  res.json({ message: `Order marked as ${status}`, order });
});

// @route   PATCH /api/admin/orders/:id/assign
// @access  Admin
// Body: { "assignedTo": "<adminUserId>" }  or  { "assignedTo": null } to unassign
export const assignOrder = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body || {};

  if (assignedTo) {
    const admin = await User.findOne({
      _id: assignedTo,
      role: "admin",
      isActive: true,
    });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Orders can only be assigned to an active admin" });
    }
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { assignedTo: assignedTo || null },
    { new: true }
  ).populate("assignedTo", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({
    message: assignedTo ? "Order assigned" : "Order unassigned",
    order,
  });
});

// @route   PATCH /api/admin/orders/:id/notes
// @access  Admin
// Body: { "adminNotes": "Customer called, wants it by Friday" }
export const updateAdminNotes = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body || {};

  if (typeof adminNotes !== "string") {
    return res.status(400).json({ message: "adminNotes must be text" });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { adminNotes: adminNotes.trim() },
    { new: true }
  ).select("+adminNotes");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({ message: "Notes updated", order });
});

// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(
    startOfToday.getFullYear(),
    startOfToday.getMonth(),
    1
  );

  const [statusCounts, revenue, todayOrders, totalCustomers] =
    await Promise.all([
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { "payment.status": "paid" } },
        {
          $group: {
            _id: null,
            allTime: { $sum: "$price" },
            thisMonth: {
              $sum: {
                $cond: [{ $gte: ["$payment.paidAt", startOfMonth] }, "$price", 0],
              },
            },
          },
        },
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ role: "customer" }),
    ]);

  const orders = { pending: 0, in_progress: 0, completed: 0, cancelled: 0 };
  statusCounts.forEach((s) => (orders[s._id] = s.count));

  res.json({
    orders,
    todayOrders,
    totalCustomers,
    revenue: {
      allTime: revenue[0]?.allTime || 0,
      thisMonth: revenue[0]?.thisMonth || 0,
    },
  });
});