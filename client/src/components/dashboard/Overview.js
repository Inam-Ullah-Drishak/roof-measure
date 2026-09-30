"use client";

import Link from "next/link";
import Button, { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import PageHeader from "@/components/dashboard/PageHeader";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/useApi";
import { needsPayment } from "@/lib/format";

// Each count only needs the total, so ask for 1 row
const useCount = (status) => useApi(`/orders/my?status=${status}&limit=1`).data?.pagination?.total;

export default function Overview() {
  const { user } = useAuth();
  const recent = useApi("/orders/my?limit=5");
  const counts = {
    pending: useCount("pending"),
    in_progress: useCount("in_progress"),
    completed: useCount("completed"),
  };

  const orders = recent.data?.orders || [];
  const unpaid = orders.filter(needsPayment);

  const stats = [
    { label: "Pending", value: counts.pending, hint: "Waiting to start" },
    { label: "In progress", value: counts.in_progress, hint: "Being measured" },
    { label: "Completed", value: counts.completed, hint: "Ready to download" },
  ];

  return (
    <>
      <PageHeader
        title={`Hi, ${user.name.split(" ")[0]}`}
        description="Here's what's happening with your roof reports."
        actions={<Button href="/dashboard/orders/new">+ New order</Button>}
      />

      {unpaid.length > 0 && (
        <Alert type="info" className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span>
            {unpaid.length === 1
              ? `Order ${unpaid[0].orderNumber} is waiting for payment. We start measuring as soon as it's paid.`
              : `${unpaid.length} orders are waiting for payment. We start measuring as soon as they're paid.`}
          </span>
          <Link href={`/dashboard/orders/${unpaid[0]._id}`} className="font-semibold underline">
            Pay now
          </Link>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-slate-900">
              {s.value ?? <span className="text-slate-300">–</span>}
            </p>
            <p className="mt-1 text-xs text-slate-500">{s.hint}</p>
          </div>
        ))}
      </div>

      <Card
        className="mt-8"
        title="Recent orders"
        actions={
          orders.length > 0 && (
            <Link href="/dashboard/orders" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
              View all
            </Link>
          )
        }
      >
        {recent.loading && !recent.data ? (
          <div className="flex justify-center py-10 text-brand-600"><Spinner className="h-6 w-6" /></div>
        ) : recent.error ? (
          <Alert type="error">{recent.error.message}</Alert>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            text="Order your first roof measurement report. It only takes a couple of minutes."
            action={<Button href="/dashboard/orders/new">Order a report</Button>}
          />
        ) : (
          <OrdersTable orders={orders} />
        )}
      </Card>
    </>
  );
}
