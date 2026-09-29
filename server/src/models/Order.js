import mongoose from "mongoose";
import Counter from "./Counter.js";

const ORDER_STATUSES = ["pending", "in_progress", "completed", "cancelled"];
const PAYMENT_STATUSES = ["unpaid", "paid", "failed", "refunded"];

const reportFileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String }, // storage id, needed to delete the file later
    format: { type: String, enum: ["pdf", "esx", "xml", "dxf", "image", "other"] },
    size: { type: Number }, // bytes
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    note: { type: String, trim: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Property details
    property: {
      street: { type: String, required: [true, "Street address is required"], trim: true },
      city: { type: String, required: [true, "City is required"], trim: true },
      state: { type: String, required: [true, "State is required"], trim: true },
      zipCode: { type: String, required: [true, "ZIP code is required"], trim: true },
      country: { type: String, default: "USA", trim: true },
      latitude: { type: Number },
      longitude: { type: Number },
    },

    propertyType: {
      type: String,
      enum: ["residential", "commercial"],
      default: "residential",
    },

    // What the customer is ordering
    reportType: {
      type: String,
      enum: ["standard", "premium", "commercial"],
      default: "standard",
    },

    deliveryFormats: {
      type: [String],
      enum: ["pdf", "esx", "xml", "dxf"],
      default: ["pdf"],
    },

    turnaround: {
      type: String,
      enum: ["standard", "rush"],
      default: "standard",
    },

    includeDetachedStructures: { type: Boolean, default: false },

    // Insurance / reference info (useful for adjusters and contractors)
    claimNumber: { type: String, trim: true },
    referenceNumber: { type: String, trim: true },

    specialInstructions: { type: String, trim: true, maxlength: 1000 },

    // Pricing
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "usd" },

    // Payment
    payment: {
      status: { type: String, enum: PAYMENT_STATUSES, default: "unpaid" },
      provider: { type: String, default: "stripe" },
      sessionId: { type: String },
      paymentIntentId: { type: String },
      paidAt: { type: Date },
    },

    // Workflow
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
      index: true,
    },
    statusHistory: [statusHistorySchema],

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    reportFiles: [reportFileSchema],

    // Only visible to admins
    adminNotes: { type: String, trim: true, select: false },

    completedAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

// Generate a readable order number like RM-10001
orderSchema.pre("validate", async function () {
  if (this.isNew && !this.orderNumber) {
    const seq = await Counter.getNext("order");
    this.orderNumber = `RM-${seq}`;
  }
});

// Record the first status in history
orderSchema.pre("save", function () {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({ status: this.status, note: "Order created" });
  }
});

// Useful for admin dashboard sorting and filtering
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "payment.status": 1 });

export { ORDER_STATUSES, PAYMENT_STATUSES };

const Order = mongoose.model("Order", orderSchema);

export default Order;