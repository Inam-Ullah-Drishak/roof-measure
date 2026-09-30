"use client";

import Link from "next/link";
import { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import PageHeader from "@/components/dashboard/PageHeader";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import { useApi } from "@/lib/useApi";
import { formatMoney, ORDER_STATUS } from "@/lib/format";

export default function AdminDashboard() {
  const stats = useApi("/admin/stats");
  // Paid orders nobody has started yet: the work queue
  const queue = useApi("/admin/orders?status=pending&paymentStatus=paid&limit=10");
  const recent = useApi("/admin/orders?limit=8");

  const s = stats.data;

  const cards = [
    { label: "Revenue this month", value: s && formatMoney(s.revenue.thisMonth), sub: s && `${formatMoney(s.revenue.allTime)} all time` },
    { label: "Orders today", value: s?.todayOrders, sub: "New orders placed today" },
    { label: "Customers", value: s?.totalCustomers, sub: "Registered accounts", href: "/admin/customers" },
    { label: "New enquiries", value: s?.newEnquiries, sub: "Unread contact messages", href: "/admin/enquiries?status=new", highlight: s?.newEnquiries > 0 },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Your business at a glance." />

      {stats.error && <Alert type="error" className="mb-6">{stats.error.message}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const inner = (
            <>
              <p className="text-sm font-medium text-slate-500">{c.label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-900">
                {c.value ?? <span className="text-slate-300">–</span>}
              </p>
              <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
            </>
          );
          const cls = `block rounded-2xl bg-white p-5 shadow-sm ring-1 ${c.highlight ? "ring-accent-500" : "ring-slate-200"}`;
          return c.href ? (
            <Link key={c.label} href={c.href} className={`${cls} transition-shadow hover:shadow-md`}>{inner}</Link>
          ) : (
            <div key={c.label} className={cls}>{inner}</div>
          );
        })}
      </div>

      {/* Orders by status */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Object.entries(ORDER_STATUS).map(([status, meta]) => (
          <Link
            key={status}
            href={`/admin/orders?status=${status}`}
            className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
          >
            <span className="text-sm font-medium text-slate-600">{meta.label}</span>
            <span className="font-display text-xl font-bold text-slate-900">{s?.orders?.[status] ?? "–"}</span>
          </Link>
        ))}
      </div>

      <Card
        className="mt-8"
        title="Ready to start"
        description="Paid orders that haven't been started yet."
        actions={
          <Link href="/admin/orders?status=pending&paymentStatus=paid" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            View all
          </Link>
        }
      >
        <OrdersBlock query={queue} empty="Nothing waiting. All paid orders are in progress or done." />
      </Card>

      <Card
        className="mt-6"
        title="Latest orders"
        actions={<Link href="/admin/orders" className="text-sm font-semibold text-brand-700 hover:text-brand-800">All orders</Link>}
      >
        <OrdersBlock query={recent} empty="No orders yet." />
      </Card>
    </>
  );
}

function OrdersBlock({ query, empty }) {
  if (query.loading && !query.data) {
    return <div className="flex justify-center py-8 text-brand-600"><Spinner className="h-6 w-6" /></div>;
  }
  if (query.error) return <Alert type="error">{query.error.message}</Alert>;
  const orders = query.data?.orders || [];
  if (orders.length === 0) return <EmptyState title={empty} />;
  return <AdminOrdersTable orders={orders} />;
}
