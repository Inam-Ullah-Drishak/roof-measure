import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculateOrderPrice } from "../config/pricing.js";
import { expireCheckoutSession } from "./paymentController.js";

// Only these fields are accepted from the customer.
// price, status, payment, reportFiles, adminNotes are NEVER taken from req.body.
const pickOrderInput = (body = {}) => ({
  property: body.property,
  propertyType: body.propertyType,
  reportType: body.reportType,
  // Accept a single format sent as text, e.g. "esx"
  deliveryFormats:
    typeof body.deliveryFormats === "string"
      ? [body.deliveryFormats]
      : body.deliveryFormats,
  turnaround: body.turnaround,
  // Strict boolean so the price and the saved value always agree ("false" is truthy)
  includeDetachedStructures:
    body.includeDetachedStructures === true ||
    body.includeDetachedStructures === "true",
  claimNumber: body.claimNumber,
  referenceNumber: body.referenceNumber,
  specialInstructions: body.specialInstructions,
});

// @route   POST /api/orders/quote
// @access  Public (lets visitors see a price before signing up)
export const getQuote = asyncHandler(async (req, res) => {
  const input = pickOrderInput(req.body);
  const { total, breakdown, formats } = calculateOrderPrice(input);

  res.json({ total, currency: "usd", breakdown, formats });
});

// @route   POST /api/orders
// @access  Private (customer)
export const createOrder = asyncHandler(async (req, res) => {
  const input = pickOrderInput(req.body);

  if (!input.property) {
    return res.status(400).json({ message: "Property address is required" });
  }

  const { total, formats } = calculateOrderPrice(input);

  const order = await Order.create({
    ...input,
    deliveryFormats: formats,
    price: total,
    customer: req.user._id,
  });

  res.status(201).json({
    message: "Order created successfully",
    order,
  });
});

// @route   GET /api/orders/my
// @access  Private (customer)
// Query: ?status=pending&page=1&limit=10
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  const filter = { customer: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  res.json({
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @route   GET /api/orders/my/:id
// @access  Private (customer, own orders only)
export const getMyOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.user._id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({ order });
});

// @route   PATCH /api/orders/my/:id/cancel
// @access  Private (customer, own orders only)
export const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.user._id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "pending" || order.payment.status === "paid") {
    return res.status(400).json({
      message:
        "This order can no longer be cancelled. Please contact support.",
    });
  }

  order.status = "cancelled";
  order.cancelledAt = new Date();
  order.statusHistory.push({
    status: "cancelled",
    note: "Cancelled by customer",
    changedBy: req.user._id,
  });

  await order.save();
  await expireCheckoutSession(order);

  res.json({ message: "Order cancelled", order });
});