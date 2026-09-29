import Order from "../models/Order.js";
import stripe from "../config/stripe.js";
import { markOrderPaid } from "./paymentController.js";

// @route   POST /api/payments/webhook
// @access  Stripe only (verified by signature)
export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    // req.body must be the RAW body here, not parsed JSON
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      // Card payments: fires as soon as checkout is complete
      case "checkout.session.completed":
      // Delayed methods (e.g. bank transfer): fires when money actually arrives
      case "checkout.session.async_payment_succeeded": {
        const order = await markOrderPaid(event.data.object);
        if (order) console.log(`Payment received for ${order.orderNumber}`);
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        await Order.findOneAndUpdate(
          { _id: session.metadata?.orderId, "payment.status": { $ne: "paid" } },
          { "payment.status": "failed" }
        );
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        // Only mark as refunded when the full amount was returned
        if (charge.refunded) {
          await Order.findOneAndUpdate(
            { "payment.paymentIntentId": charge.payment_intent },
            { "payment.status": "refunded" }
          );
        }
        break;
      }

      default:
        // Ignore events we don't use
        break;
    }

    res.json({ received: true });
  } catch (err) {
    // Returning 500 tells Stripe to retry this event later
    console.error(`Webhook processing error: ${err.message}`);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};