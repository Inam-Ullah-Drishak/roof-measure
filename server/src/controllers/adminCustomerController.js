import mongoose from "mongoose";
import User from "../models/User.js";
import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";

// Escape special characters so search text can't break the regex
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @route   GET /api/admin/customers
// @access  Admin
// Query: ?search=inam&status=active&page=1&limit=20
export const getCustomers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

  const filter = { role: "customer" };

  if (req.query.status === "active") filter.isActive = true;
  if (req.query.status === "inactive") filter.isActive = false;

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search.trim()), "i");
    filter.$or = [
      { name: regex },
      { email: regex },
      { companyName: regex },
      { phone: regex },
    ];
  }

  const [customers, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  // Add order count and total spent for each customer on this page
  const ids = customers.map((c) => c._id);
  const stats = await Order.aggregate([
    { $match: { customer: { $in: ids } } },
    {
      $group: {
        _id: "$customer",
        orderCount: { $sum: 1 },
        totalSpent: {
          $sum: { $cond: [{ $eq: ["$payment.status", "paid"] }, "$price", 0] },
        },
      },
    },
  ]);

  const statsMap = Object.fromEntries(stats.map((s) => [s._id.toString(), s]));

  const result = customers.map((c) => ({
    ...c,
    orderCount: statsMap[c._id.toString()]?.orderCount || 0,
    totalSpent: statsMap[c._id.toString()]?.totalSpent || 0,
  }));

  res.json({
    customers: result,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @route   GET /api/admin/customers/:id
// @access  Admin
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await User.findOne({
    _id: req.params.id,
    role: "customer",
  }).lean();

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const [recentOrders, statsResult] = await Promise.all([
    Order.find({ customer: customer._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("orderNumber status payment.status price createdAt property")
      .lean(),
    Order.aggregate([
      { $match: { customer: new mongoose.Types.ObjectId(customer._id) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          pendingOrders: {
            $sum: {
              $cond: [{ $in: ["$status", ["pending", "in_progress"]] }, 1, 0],
            },
          },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ["$payment.status", "paid"] }, "$price", 0],
            },
          },
        },
      },
    ]),
  ]);

  const stats = statsResult[0] || {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
  };
  delete stats._id;

  res.json({ customer, stats, recentOrders });
});

// @route   PATCH /api/admin/customers/:id
// @access  Admin
export const updateCustomer = asyncHandler(async (req, res) => {
  const { name, phone, companyName } = req.body || {};

  const customer = await User.findOne({ _id: req.params.id, role: "customer" });

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  if (name !== undefined) customer.name = name;
  if (phone !== undefined) customer.phone = phone;
  if (companyName !== undefined) customer.companyName = companyName;

  await customer.save();

  res.json({ message: "Customer updated", customer });
});

// @route   PATCH /api/admin/customers/:id/status
// @access  Admin
// Body: { "isActive": false }
export const setCustomerStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body || {};

  if (typeof isActive !== "boolean") {
    return res
      .status(400)
      .json({ message: "isActive must be true or false" });
  }

  const customer = await User.findOneAndUpdate(
    { _id: req.params.id, role: "customer" },
    { isActive },
    { new: true }
  );

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  res.json({
    message: isActive ? "Customer activated" : "Customer deactivated",
    customer,
  });
});