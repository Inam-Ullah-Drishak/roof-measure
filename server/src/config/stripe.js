import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is missing in .env, payments will not work");
}

// Stripe throws on an empty key, so use a placeholder to let the server start.
// Payment calls will then fail with a clear Stripe auth error.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_missing", {
  maxNetworkRetries: 2, // retry automatically on temporary network errors
});

export default stripe;