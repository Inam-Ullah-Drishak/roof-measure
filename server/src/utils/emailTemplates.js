// Shared building blocks for all emails, so they look the same

// Prevent names/addresses like "<script>" from breaking the email HTML
export const escapeHtml = (text = "") =>
  String(text).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );

export const formatMoney = (amount, currency = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);

export const formatAddress = (p = {}) =>
  [p.street, p.city, `${p.state || ""} ${p.zipCode || ""}`.trim()]
    .filter(Boolean)
    .join(", ");

export const button = (url, label) =>
  `<p style="margin:24px 0"><a href="${url}" style="display:inline-block;padding:12px 20px;background:#1d4ed8;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold">${escapeHtml(label)}</a></p>`;

// Simple table of label/value rows (values are escaped)
export const detailsTable = (rows) =>
  `<table style="border-collapse:collapse;width:100%;margin:16px 0">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;color:#6b7280;width:40%">${escapeHtml(label)}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`
    )
    .join("")}</table>`;

// Wraps the body in a simple, email-client friendly layout
export const layout = (title, bodyHtml) => `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px">
      <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;padding:28px">
          <tr><td>
            <h2 style="margin:0 0 16px;font-size:20px">${escapeHtml(title)}</h2>
            ${bodyHtml}
            <p style="margin-top:28px;color:#9ca3af;font-size:12px">${escapeHtml(process.env.APP_NAME || "Roof Measure")}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
