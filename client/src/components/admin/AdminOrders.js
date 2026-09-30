"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import PageHeader from "@/components/dashboard/PageHeader";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import { FilterTabs, SearchBox, Pagination, useQueryHref } from "@/components/ui/ListControls";
import { useApi } from "@/lib/useApi";
import { PAYMENT_STATUS } from "@/lib/format";

const statusTabs = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Filters the API understands, all kept in the page URL
const FILTERS = ["status", "paymentStatus", "search", "customer", "from", "to", "page"];

export default function AdminOrders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hrefFor = useQueryHref();
  const get = (k) => searchParams.get(k) || "";

  const query = new URLSearchParams({ limit: "20" });
  for (const key of FILTERS) if (get(key)) query.set(key, get(key));
  const { data, error, loading } = useApi(`/admin/orders?${query}`);

  // Show the customer's name on the "filtered by customer" chip
  const customer = useApi(get("customer") ? `/admin/customers/${get("customer")}` : null).data?.customer;

  const orders = data?.orders || [];
  const hasFilters = FILTERS.some((k) => k !== "page" && get(k));
  const setFilter = (changes) => router.replace(hrefFor(changes));

  return (
    <>
      <PageHeader title="Orders" description="Every order from every customer." />

      <FilterTabs tabs={statusTabs} value={get("status")} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SearchBox
          key={get("search")}
          value={get("search")}
          placeholder="Order #, address, customer, claim #"
          className="sm:col-span-2 lg:col-span-1"
        />
        <select
          value={get("paymentStatus")}
          onChange={(e) => setFilter({ paymentStatus: e.target.value })}
          aria-label="Payment status"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <option value="">Any payment status</option>
          {Object.entries(PAYMENT_STATUS).map(([value, s]) => (
            <option key={value} value={value}>{s.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-2 lg:col-span-2">
          <DateInput label="From" value={get("from")} onChange={(v) => setFilter({ from: v })} />
          <span className="text-slate-400">–</span>
          <DateInput label="To" value={get("to")} onChange={(v) => setFilter({ to: v })} />
        </div>
      </div>

      {hasFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {get("customer") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-brand-800">
              Customer: {customer?.name || "…"}
              <Link href={hrefFor({ customer: "" })} className="ml-1 font-bold" aria-label="Remove customer filter">×</Link>
            </span>
          )}
          <Link href="/admin/orders" className="font-medium text-slate-500 hover:text-slate-800">Clear all filters</Link>
        </div>
      )}

      <Card className="mt-4">
        {loading && !data ? (
          <div className="flex justify-center py-10 text-brand-600"><Spinner className="h-6 w-6" /></div>
        ) : error ? (
          <Alert type="error">{error.message}</Alert>
        ) : orders.length === 0 ? (
          <EmptyState title={hasFilters ? "No orders match these filters" : "No orders yet"} />
        ) : (
          <div className={loading ? "opacity-60 transition-opacity" : ""}>
            <AdminOrdersTable orders={orders} />
          </div>
        )}
        <Pagination pagination={data?.pagination} noun="orders" />
      </Card>
    </>
  );
}

function DateInput({ label, value, onChange }) {
  return (
    <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
      <span className="text-slate-500">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent py-1 text-slate-800 focus:outline-none"
      />
    </label>
  );
}
