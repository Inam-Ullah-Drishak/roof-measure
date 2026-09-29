import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Server error",
  });
});

export default app;