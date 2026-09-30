import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/format";

export function Badge({ className = "", children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}

export function OrderStatusBadge({ status }) {
  const s = ORDER_STATUS[status] || { label: status, className: "bg-slate-100 text-slate-600 ring-slate-200" };
  return <Badge className={s.className}>{s.label}</Badge>;
}

export function PaymentStatusBadge({ status }) {
  const s = PAYMENT_STATUS[status] || { label: status, className: "bg-slate-100 text-slate-600 ring-slate-200" };
  return <Badge className={s.className}>{s.label}</Badge>;
}
