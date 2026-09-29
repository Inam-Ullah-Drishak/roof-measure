import path from "path";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
import { saveFile, deleteFile, sendFile } from "../utils/storage.js";
import { FORMAT_BY_EXTENSION } from "../middleware/uploadMiddleware.js";

// Keep original names readable but safe
const cleanFileName = (name) =>
  path.basename(name).replace(/[^\w.\- ]/g, "_").slice(0, 150);

// @route   POST /api/admin/orders/:id/files
// @access  Admin
// Form-data: files (up to 5)
export const uploadReportFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Please select at least one file" });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "cancelled") {
    return res
      .status(400)
      .json({ message: "Cannot upload files to a cancelled order" });
  }

  const savedKeys = [];

  try {
    for (const file of req.files) {
      const { key } = await saveFile(file.buffer, file.originalname);
      savedKeys.push(key);

      const fileId = new mongoose.Types.ObjectId();
      const ext = path.extname(file.originalname).toLowerCase();

      order.reportFiles.push({
        _id: fileId,
        fileName: cleanFileName(file.originalname),
        url: `/api/orders/${order._id}/files/${fileId}/download`,
        publicId: key, // storage key, used to find/delete the file
        format: FORMAT_BY_EXTENSION[ext] || "other",
        size: file.size,
      });
    }

    await order.save();
  } catch (err) {
    // If anything failed, remove files already written so nothing is orphaned
    await Promise.all(savedKeys.map((key) => deleteFile(key)));
    throw err;
  }

  res.status(201).json({
    message: `${req.files.length} file(s) uploaded`,
    reportFiles: order.reportFiles,
  });
});

// @route   DELETE /api/admin/orders/:id/files/:fileId
// @access  Admin
export const deleteReportFile = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const file = order.reportFiles.id(req.params.fileId);

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  if (order.status === "completed" && order.reportFiles.length === 1) {
    return res.status(400).json({
      message:
        "This is the only file on a completed order. Reopen the order before removing it.",
    });
  }

  const key = file.publicId;
  file.deleteOne();
  await order.save();
  await deleteFile(key);

  res.json({ message: "File deleted", reportFiles: order.reportFiles });
});

// @route   GET /api/orders/:orderId/files/:fileId/download
// @access  Order owner (customer, after payment) or admin
export const downloadReportFile = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return res.status(404).json({ message: "File not found" });
  }

  const isAdmin = req.user.role === "admin";
  const isOwner = order.customer.equals(req.user._id);

  // Same message as "not found" so customers can't probe other orders
  if (!isAdmin && !isOwner) {
    return res.status(404).json({ message: "File not found" });
  }

  // Customers must pay before downloading
  if (!isAdmin && order.payment.status !== "paid") {
    return res.status(402).json({
      message: "Please complete payment to download this report",
    });
  }

  const file = order.reportFiles.id(req.params.fileId);

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  await sendFile(res, file.publicId, `${order.orderNumber}-${file.fileName}`);
});