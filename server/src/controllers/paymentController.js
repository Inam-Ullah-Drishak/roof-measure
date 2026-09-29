import Order from "../models/Order.js";
import stripe from "../config/stripe.js";
import asyncHandler from "../utils/asyncHandler.js";

const toCents = (amount) => Math.round(amount * 100);

// Shared by the webhook and the verify route.
// Marks an order as paid only if Stripe confirms the correct amount.
export const markOrderPaid = async (session) => {
  const orderId = session.metadata?.orderId;
  if (!orderId || session.payment_status !== "paid") return null;

  const order = await Order.findById(orderId);
  if (!order) return null;

  if (session.amount_total !== toCents(order.price)) {
    console.error(
      `Amount mismatch for ${order.orderNumber}: paid ${session.amount_total}, expected ${toCents(order.price)}`
    );
    return null;
  }

  // Atomic update: only changes it if not already paid,
  // so the webhook and verify route can't both process it
  return Order.findOneAndUpdate(
    { _id: orderId, "payment.status": { $ne: "paid" } },
    {
      "payment.status": "paid",
      "payment.sessionId": session.id,
      "payment.paymentIntentId":
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
      "payment.paidAt": new Date(),
    },
    { new: true }
  );
};

// @route   POST /api/payments/checkout/:orderId
// @access  Customer (own orders)
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    customer: req.user._id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "cancelled") {
    return res.status(400).json({ message: "This order has been cancelled" });
  }

  if (order.payment.status === "paid") {
    return res.status(400).json({ message: "This order is already paid" });
  }

  // Reuse an existing open checkout page instead of creating duplicates
  if (order.payment.sessionId) {
    try {
      const existing = await stripe.checkout.sessions.retrieve(
        order.payment.sessionId
      );
      if (
        existing.status === "open" &&
        existing.amount_total === toCents(order.price)
      ) {
        return res.json({ url: existing.url, sessionId: existing.id });
      }
    } catch {
      // Session not found or expired, create a new one below
    }
  }

  const { street, city, state, zipCode } = order.property;
  const orderPage = `${process.env.CLIENT_URL}/dashboard/orders/${order._id}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: order._id.toString(),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: order.currency,
          unit_amount: toCents(order.price),
          product_data: {
            name: `Roof Measurement Report - ${order.orderNumber}`,
            description: `${street}, ${city}, ${state} ${zipCode}`,
          },
        },
      },
    ],
    metadata: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
    },
    payment_intent_data: {
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      },
    },
    success_url: `${orderPage}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${orderPage}?payment=cancelled`,
  });

  order.payment.sessionId = session.id;
  await order.save();

  res.json({ url: session.url, sessionId: session.id });
});

// @route   GET /api/payments/verify/:sessionId
// @access  Customer (own orders)
// Called by the success page, in case the webhook hasn't arrived yet
export const verifyPayment = asyncHandler(async (req, res) => {
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
  } catch {
    return res.status(404).json({ message: "Payment session not found" });
  }

  const order = await Order.findOne({
    _id: session.metadata?.orderId,
    customer: req.user._id,
  });

  if (!order) {
    return res.status(404).json({ message: "Payment session not found" });
  }

  if (session.payment_status === "paid") {
    await markOrderPaid(session);
  }

  const fresh = await Order.findById(order._id);

  res.json({
    orderNumber: fresh.orderNumber,
    paymentStatus: fresh.payment.status,
    paidAt: fresh.payment.paidAt,
  });
});