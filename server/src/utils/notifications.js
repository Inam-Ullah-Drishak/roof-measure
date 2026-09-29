import User from "../models/User.js";
import sendEmail from "./sendEmail.js";
import {
  escapeHtml,
  formatMoney,
  formatAddress,
  button,
  detailsTable,
  layout,
} from "./emailTemplates.js";

// Emails are sent in the background: a failed email must never
// break an order, a payment or a status change.
const sendInBackground = (email) => {
  sendEmail(email).catch((err) =>
    console.error(`Email "${email.subject}" to ${email.to} failed: ${err.message}`)
  );
};

const orderPageUrl = (order) =>
  `${process.env.CLIENT_URL}/dashboard/orders/${order._id}`;

const adminOrderPageUrl = (order) =>
  `${process.env.CLIENT_URL}/admin/orders/${order._id}`;

// ADMIN_NOTIFY_EMAIL (comma separated) if set, otherwise all active admins
const getAdminEmails = async () => {
  if (process.env.ADMIN_NOTIFY_EMAIL) {
    return process.env.ADMIN_NOTIFY_EMAIL.split(",").map((e) => e.trim()).filter(Boolean);
  }
  const admins = await User.find({ role: "admin", isActive: true }).select("email").lean();
  return admins.map((a) => a.email);
};

// Accepts a populated customer or just an id
const getCustomer = async (order) =>
  order.customer?.email
    ? order.customer
    : User.findById(order.customer).select("name email companyName phone").lean();

const orderRows = (order) => [
  ["Order number", order.orderNumber],
  ["Property", formatAddress(order.property)],
  ["Report type", order.reportType],
  ["Delivery formats", (order.deliveryFormats || []).join(", ").toUpperCase()],
  ["Turnaround", order.turnaround],
  ["Total", formatMoney(order.price, order.currency)],
];

// Customer: order placed, with a link to pay
export const notifyOrderReceived = (order, customer) => {
  const url = orderPageUrl(order);

  sendInBackground({
    to: customer.email,
    subject: `Order ${order.orderNumber} received`,
    text:
      `Hi ${customer.name},\n\n` +
      `Thanks for your order ${order.orderNumber} for ${formatAddress(order.property)}.\n` +
      `Total: ${formatMoney(order.price, order.currency)}\n\n` +
      `Complete your payment to start the measurement:\n${url}`,
    html: layout(
      "We received your order",
      `<p>Hi ${escapeHtml(customer.name)},</p>` +
        `<p>Thanks for your order. Complete your payment and we'll start the measurement.</p>` +
        detailsTable(orderRows(order)) +
        button(url, "Pay now")
    ),
  });
};

// Customer receipt + admin alert. Called once per order (markOrderPaid is atomic).
export const notifyPaymentReceived = async (order) => {
  try {
    const customer = await getCustomer(order);
    const paidAt = (order.payment.paidAt || new Date()).toLocaleString("en-US");

    if (customer) {
      sendInBackground({
        to: customer.email,
        subject: `Payment received for ${order.orderNumber}`,
        text:
          `Hi ${customer.name},\n\n` +
          `We received your payment of ${formatMoney(order.price, order.currency)} for order ${order.orderNumber}.\n` +
          `Our team is now working on your roof measurement report. We'll email you when it's ready.\n\n` +
          `Track your order: ${orderPageUrl(order)}`,
        html: layout(
          "Payment received",
          `<p>Hi ${escapeHtml(customer.name)},</p>` +
            `<p>Thank you, your payment was successful. Our team is now working on your report and we'll email you when it's ready.</p>` +
            detailsTable([...orderRows(order), ["Paid on", paidAt]]) +
            button(orderPageUrl(order), "Track your order")
        ),
      });
    }

    const adminEmails = await getAdminEmails();
    if (adminEmails.length > 0) {
      const customerRows = customer
        ? [
            ["Customer", customer.name],
            ["Email", customer.email],
            ["Company", customer.companyName || "-"],
            ["Phone", customer.phone || "-"],
          ]
        : [];

      sendInBackground({
        to: adminEmails.join(","),
        subject: `New paid order ${order.orderNumber}${order.turnaround === "rush" ? " (RUSH)" : ""}`,
        text:
          `New paid order ${order.orderNumber}\n` +
          `Customer: ${customer?.name || "unknown"} (${customer?.email || "-"})\n` +
          `Property: ${formatAddress(order.property)}\n` +
          `Total: ${formatMoney(order.price, order.currency)}\n\n` +
          `Open in admin: ${adminOrderPageUrl(order)}`,
        html: layout(
          `New paid order ${order.orderNumber}`,
          detailsTable([...orderRows(order), ...customerRows]) +
            (order.specialInstructions
              ? `<p><strong>Special instructions:</strong><br>${escapeHtml(order.specialInstructions)}</p>`
              : "") +
            button(adminOrderPageUrl(order), "Open in admin panel")
        ),
      });
    }
  } catch (err) {
    console.error(`Payment notifications failed for ${order.orderNumber}: ${err.message}`);
  }
};

// Customer: report files are ready
export const notifyReportReady = async (order) => {
  try {
    const customer = await getCustomer(order);
    if (!customer) return;

    const isPaid = order.payment.status === "paid";
    const url = orderPageUrl(order);

    sendInBackground({
      to: customer.email,
      subject: `Your roof report for ${order.orderNumber} is ready`,
      text:
        `Hi ${customer.name},\n\n` +
        `Your roof measurement report for ${formatAddress(order.property)} is ready.\n` +
        (isPaid
          ? `Download it here: ${url}`
          : `Complete your payment to download it: ${url}`),
      html: layout(
        "Your report is ready",
        `<p>Hi ${escapeHtml(customer.name)},</p>` +
          `<p>Your roof measurement report for <strong>${escapeHtml(formatAddress(order.property))}</strong> is ready.</p>` +
          (isPaid ? "" : `<p>Please complete your payment to download it.</p>`) +
          button(url, isPaid ? "Download report" : "Pay and download")
      ),
    });
  } catch (err) {
    console.error(`Report-ready notification failed for ${order.orderNumber}: ${err.message}`);
  }
};

// Admin: new contact form enquiry. Reply-To is the visitor, so "Reply" in the
// mail app answers them directly.
export const notifyNewEnquiry = async (enquiry) => {
  try {
    const adminEmails = await getAdminEmails();
    if (adminEmails.length === 0) return;

    const url = `${process.env.CLIENT_URL}/admin/enquiries`;
    const subjectLine = enquiry.subject || "New enquiry";

    sendInBackground({
      to: adminEmails.join(","),
      replyTo: enquiry.email,
      subject: `Contact form: ${subjectLine}`,
      text:
        `New enquiry from ${enquiry.name} (${enquiry.email}${enquiry.phone ? `, ${enquiry.phone}` : ""})\n\n` +
        `${enquiry.message}\n\n` +
        `Reply to this email to answer them, or open: ${url}`,
      html: layout(
        "New contact form enquiry",
        detailsTable([
          ["Name", enquiry.name],
          ["Email", enquiry.email],
          ["Phone", enquiry.phone || "-"],
          ["Subject", subjectLine],
        ]) +
          `<p style="white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:6px">${escapeHtml(enquiry.message)}</p>` +
          `<p style="color:#6b7280">Reply to this email to answer ${escapeHtml(enquiry.name)} directly.</p>` +
          button(url, "Open enquiries")
      ),
    });
  } catch (err) {
    console.error(`Enquiry notification failed: ${err.message}`);
  }
};
