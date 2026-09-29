import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is missing in .env, payments will not work");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  maxNetworkRetries: 2, // retry automatically on temporary network errors
});

export default stripe;