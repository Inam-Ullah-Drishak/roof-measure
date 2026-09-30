import Link from "next/link";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { formatAddress, formatDate, formatMoney, reportTypeName } from "@/lib/format";

// Orders table for the panel: shows the customer and who it's assigned to.
// customerLinks: link names to the customer page (admins only)
export default function AdminOrdersTable({ orders, showCustomer = true, showAssigned = true, customerLinks = true }) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="py-3 pr-4 font-semibold">Order</th>
              {showCustomer && <th className="py-3 pr-4 font-semibold">Customer</th>}
              <th className="py-3 pr-4 font-semibold">Property</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Payment</th>
              {showAssigned && <th className="py-3 pr-4 font-semibold">Assigned</th>}
              <th className="py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-slate-50">
                <td className="py-3.5 pr-4 align-top">
                  <Link href={`/admin/orders/${o._id}`} className="font-semibold text-brand-700 hover:text-brand-800">
                    {o.orderNumber}
                  </Link>
                  <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                  {o.turnaround === "rush" && (
                    <span className="mt-1 inline-block rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-700">Rush</span>
                  )}
                </td>
                {showCustomer && (
                  <td className="max-w-48 py-3.5 pr-4 align-top">
                    {o.customer && customerLinks ? (
                      <Link href={`/admin/customers/${o.customer._id}`} className="block truncate font-medium text-slate-900 hover:text-brand-700">
                        {o.customer.name}
                      </Link>
                    ) : o.customer ? (
                      <p className="truncate font-medium text-slate-900">{o.customer.name}</p>
                    ) : (
                      <span className="text-slate-400">Deleted user</span>
                    )}
                    <p className="truncate text-xs text-slate-500">{o.customer?.companyName || o.customer?.email}</p>
                  </td>
                )}
                <td className="max-w-xs py-3.5 pr-4 align-top">
                  <p className="truncate text-slate-900">{formatAddress(o.property)}</p>
                  <p className="text-xs text-slate-500">{reportTypeName(o.reportType)}</p>
                </td>
                <td className="py-3.5 pr-4 align-top"><OrderStatusBadge status={o.status} /></td>
                <td className="py-3.5 pr-4 align-top"><PaymentStatusBadge status={o.payment?.status} /></td>
                {showAssigned && (
                  <td className="py-3.5 pr-4 align-top text-slate-600">{o.assignedTo?.name || <span className="text-slate-400">—</span>}</td>
                )}
                <td className="py-3.5 text-right align-top font-medium text-slate-900">{formatMoney(o.price, o.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 lg:hidden">
        {orders.map((o) => (
          <li key={o._id}>
            <Link href={`/admin/orders/${o._id}`} className="block py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-brand-700">
                  {o.orderNumber}
                  {o.turnaround === "rush" && <span className="ml-2 text-xs font-bold text-red-600">RUSH</span>}
                </span>
                <span className="font-medium text-slate-900">{formatMoney(o.price, o.currency)}</span>
              </div>
              {showCustomer && <p className="mt-1 text-sm font-medium text-slate-800">{o.customer?.name}</p>}
              <p className="truncate text-sm text-slate-600">{formatAddress(o.property)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <OrderStatusBadge status={o.status} />
                <PaymentStatusBadge status={o.payment?.status} />
                {showAssigned && o.assignedTo && <span className="text-xs text-slate-500">· {o.assignedTo.name}</span>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
