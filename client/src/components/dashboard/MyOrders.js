"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button, { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import PageHeader from "@/components/dashboard/PageHeader";
import OrdersTable from "@/components/dashboard/OrdersTable";
import { useApi } from "@/lib/useApi";

const tabs = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MyOrders() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter and page live in the URL, so back/forward and sharing links work
  const status = tabs.some((t) => t.value === searchParams.get("status")) ? searchParams.get("status") : "";
  const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);

  const query = new URLSearchParams({ page: String(page), limit: "10" });
  if (status) query.set("status", status);
  const { data, error, loading } = useApi(`/orders/my?${query}`);

  const hrefFor = (next) => {
    const q = new URLSearchParams();
    const s = next.status ?? status;
    const p = next.page ?? 1;
    if (s) q.set("status", s);
    if (p > 1) q.set("page", String(p));
    return `/dashboard/orders${q.size ? `?${q}` : ""}`;
  };

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <>
      <PageHeader
        title="My orders"
        description="Track progress, pay and download your reports."
        actions={<Button href="/dashboard/orders/new">+ New order</Button>}
      />

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
        {tabs.map((t) => (
          <Link
            key={t.value}
            href={hrefFor({ status: t.value, page: 1 })}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${
              status === t.value ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
            aria-current={status === t.value ? "page" : undefined}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <Card>
        {loading && !data ? (
          <div className="flex justify-center py-10 text-brand-600"><Spinner className="h-6 w-6" /></div>
        ) : error ? (
          <Alert type="error">{error.message}</Alert>
        ) : orders.length === 0 ? (
          <EmptyState
            title={status ? "No orders with this status" : "No orders yet"}
            text={status ? "Try another filter." : "Order your first roof measurement report."}
            action={!status && <Button href="/dashboard/orders/new">Order a report</Button>}
          />
        ) : (
          <div className={loading ? "opacity-60 transition-opacity" : ""}>
            <OrdersTable orders={orders} />
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
            <p className="text-slate-500">
              Page {pagination.page} of {pagination.pages} · {pagination.total} orders
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => router.push(hrefFor({ page: page - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.pages}
                onClick={() => router.push(hrefFor({ page: page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
