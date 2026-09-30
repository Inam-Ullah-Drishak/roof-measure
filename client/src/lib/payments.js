import { api } from "@/lib/api";

// Sends the browser to Stripe's secure checkout page for an order
export async function goToCheckout(orderId) {
  const { url } = await api(`/payments/checkout/${orderId}`, { method: "POST" });
  window.location.assign(url);
}
