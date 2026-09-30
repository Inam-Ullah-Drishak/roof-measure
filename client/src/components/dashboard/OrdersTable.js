import Link from "next/link";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { formatAddress, formatDate, formatMoney, reportTypeName, needsPayment } from "@/lib/format";

// Table on desktop, stacked cards on mobile
export default function OrdersTable({ orders }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="py-3 pr-4 font-semibold">Order</th>
              <th className="py-3 pr-4 font-semibold">Property</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Payment</th>
              <th className="py-3 pr-4 text-right font-semibold">Total</th>
              <th className="py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-slate-50">
                <td className="py-4 pr-4 align-top">
                  <Link href={`/dashboard/orders/${o._id}`} className="font-semibold text-brand-700 hover:text-brand-800">
                    {o.orderNumber}
                  </Link>
                  <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                </td>
                <td className="max-w-xs py-4 pr-4 align-top">
                  <p className="truncate text-slate-900">{formatAddress(o.property)}</p>
                  <p className="text-xs text-slate-500">{reportTypeName(o.reportType)} report</p>
                </td>
                <td className="py-4 pr-4 align-top"><OrderStatusBadge status={o.status} /></td>
                <td className="py-4 pr-4 align-top"><PaymentStatusBadge status={o.payment?.status} /></td>
                <td className="py-4 pr-4 text-right align-top font-medium text-slate-900">
                  {formatMoney(o.price, o.currency)}
                </td>
                <td className="py-4 text-right align-top">
                  <Link
                    href={`/dashboard/orders/${o._id}`}
                    className={`text-sm font-semibold ${needsPayment(o) ? "text-accent-600 hover:text-accent-500" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    {needsPayment(o) ? "Pay now" : o.status === "completed" ? "Download" : "View"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {orders.map((o) => (
          <li key={o._id}>
            <Link href={`/dashboard/orders/${o._id}`} className="block py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-brand-700">{o.orderNumber}</span>
                <span className="font-medium text-slate-900">{formatMoney(o.price, o.currency)}</span>
              </div>
              <p className="mt-1 truncate text-sm text-slate-700">{formatAddress(o.property)}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <OrderStatusBadge status={o.status} />
                <PaymentStatusBadge status={o.payment?.status} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
