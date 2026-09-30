import { pricing } from "@/config/site";

export const formatMoney = (amount = 0, currency = "usd") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount);

export const formatDate = (value, { time = false } = {}) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        ...(time && { hour: "numeric", minute: "2-digit" }),
      }).format(new Date(value))
    : "—";

export const formatAddress = (p = {}) =>
  [p.street, p.city, [p.state, p.zipCode].filter(Boolean).join(" ")].filter(Boolean).join(", ");

export const formatBytes = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const reportTypeName = (id) =>
  pricing.reportTypes.find((r) => r.id === id)?.name || id;

// Labels and badge colors for order and payment statuses
export const ORDER_STATUS = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  in_progress: { label: "In progress", className: "bg-brand-50 text-brand-800 ring-brand-200" },
  completed: { label: "Completed", className: "bg-green-50 text-green-800 ring-green-200" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600 ring-slate-200" },
};

export const PAYMENT_STATUS = {
  unpaid: { label: "Awaiting payment", className: "bg-orange-50 text-orange-800 ring-orange-200" },
  paid: { label: "Paid", className: "bg-green-50 text-green-800 ring-green-200" },
  failed: { label: "Payment failed", className: "bg-red-50 text-red-800 ring-red-200" },
  refunded: { label: "Refunded", className: "bg-slate-100 text-slate-600 ring-slate-200" },
};

// An order can be paid unless it's already paid, refunded or cancelled
export const needsPayment = (order) =>
  order.status !== "cancelled" && ["unpaid", "failed"].includes(order.payment?.status);
