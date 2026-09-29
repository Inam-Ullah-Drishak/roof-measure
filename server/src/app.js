import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { handleStripeWebhook } from "./controllers/webhookController.js";
import { apiLimiter } from "./middleware/rateLimiters.js";

const app = express();

// Behind a proxy/load balancer (Render, Railway, Nginx, Heroku...) set TRUST_PROXY=1
// so rate limiting sees each visitor's real IP instead of the proxy's
if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);
}

// Security headers and logging
app.use(helmet());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Stripe webhook: MUST come before express.json() to receive the raw body
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Middleware for all other routes
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", apiLimiter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  // body-parser and res.download use err.status (e.g. 413, 404)
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Server error";

  // Mongoose validation error (e.g. missing required field)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Invalid MongoDB ID (e.g. /api/orders/my/abc123)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  // Duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  // Invalid JSON in request body
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  // Stripe errors (e.g. invalid API key)
  if (err.type?.startsWith?.("Stripe")) {
    // Always 502: passing Stripe's 401 through would look like the user's session expired
    statusCode = 502;
    message = `Payment provider error: ${err.message}`;
  }

  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({
    message:
      statusCode === 500 && process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : message,
  });
});

export default app;