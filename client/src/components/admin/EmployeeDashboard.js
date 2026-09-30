"use client";

import Link from "next/link";
import { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import PageHeader from "@/components/dashboard/PageHeader";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/useApi";
import { ORDER_STATUS } from "@/lib/format";

// Home page of the panel for employees: only the orders assigned to them
export default function EmployeeDashboard() {
  const { user } = useAuth();
  const stats = useApi("/admin/stats");
  const working = useApi("/admin/orders?status=in_progress&limit=20");
  const upNext = useApi("/admin/orders?status=pending&limit=20");

  const counts = stats.data?.orders;

  return (
    <>
      <PageHeader title={`Hi, ${user?.name?.split(" ")[0] || "there"}`} description="The orders assigned to you." />

      {stats.error && <Alert type="error" className="mb-6">{stats.error.message}</Alert>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Object.entries(ORDER_STATUS).map(([status, meta]) => (
          <Link
            key={status}
            href={`/admin/orders?status=${status}`}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">{meta.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-slate-900">{counts?.[status] ?? <span className="text-slate-300">–</span>}</p>
          </Link>
        ))}
      </div>

      <Card className="mt-8" title="Working on" description="Orders you've started. Upload the report and mark them completed.">
        <OrdersBlock query={working} empty="Nothing in progress." />
      </Card>

      <Card className="mt-6" title="Up next" description="Assigned to you but not started yet. Rush orders first.">
        <OrdersBlock query={upNext} empty="No new orders assigned to you." rushFirst />
      </Card>
    </>
  );
}

function OrdersBlock({ query, empty, rushFirst }) {
  if (query.loading && !query.data) {
    return <div className="flex justify-center py-8 text-brand-600"><Spinner className="h-6 w-6" /></div>;
  }
  if (query.error) return <Alert type="error">{query.error.message}</Alert>;
  let orders = query.data?.orders || [];
  if (rushFirst) orders = [...orders].sort((a, b) => (b.turnaround === "rush") - (a.turnaround === "rush"));
  if (orders.length === 0) return <EmptyState title={empty} />;
  return <AdminOrdersTable orders={orders} customerLinks={false} showAssigned={false} />;
}
