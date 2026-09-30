"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import PageHeader from "@/components/dashboard/PageHeader";
import { FilterTabs, SearchBox, Pagination } from "@/components/ui/ListControls";
import { useApi } from "@/lib/useApi";
import { formatDate, formatMoney } from "@/lib/format";

const tabs = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Deactivated" },
];

export default function AdminCustomers() {
  const searchParams = useSearchParams();
  const get = (k) => searchParams.get(k) || "";

  const query = new URLSearchParams({ limit: "20" });
  for (const k of ["status", "search", "page"]) if (get(k)) query.set(k, get(k));
  const { data, error, loading } = useApi(`/admin/customers?${query}`);
  const customers = data?.customers || [];

  return (
    <>
      <PageHeader title="Customers" description="Everyone who has signed up." />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <FilterTabs tabs={tabs} value={get("status")} />
        <SearchBox key={get("search")} value={get("search")} placeholder="Name, email, company or phone" className="md:w-80" />
      </div>

      <Card className="mt-4">
        {loading && !data ? (
          <div className="flex justify-center py-10 text-brand-600"><Spinner className="h-6 w-6" /></div>
        ) : error ? (
          <Alert type="error">{error.message}</Alert>
        ) : customers.length === 0 ? (
          <EmptyState title={get("search") || get("status") ? "No customers match" : "No customers yet"} />
        ) : (
          <div className={`overflow-x-auto ${loading ? "opacity-60" : ""}`}>
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-semibold">Customer</th>
                  <th className="hidden py-3 pr-4 font-semibold md:table-cell">Contact</th>
                  <th className="py-3 pr-4 text-right font-semibold">Orders</th>
                  <th className="hidden py-3 pr-4 text-right font-semibold sm:table-cell">Spent</th>
                  <th className="hidden py-3 pr-4 font-semibold lg:table-cell">Joined</th>
                  <th className="py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="max-w-56 py-3.5 pr-4">
                      <Link href={`/admin/customers/${c._id}`} className="block truncate font-semibold text-brand-700 hover:text-brand-800">
                        {c.name}
                      </Link>
                      <p className="truncate text-xs text-slate-500">{c.companyName || "—"}</p>
                    </td>
                    <td className="hidden max-w-[16rem] py-3.5 pr-4 md:table-cell">
                      <p className="truncate text-slate-800">{c.email}</p>
                      <p className="text-xs text-slate-500">{c.phone || "—"}</p>
                    </td>
                    <td className="py-3.5 pr-4 text-right font-medium text-slate-900">{c.orderCount}</td>
                    <td className="hidden py-3.5 pr-4 text-right text-slate-900 sm:table-cell">{formatMoney(c.totalSpent)}</td>
                    <td className="hidden py-3.5 pr-4 text-slate-600 lg:table-cell">{formatDate(c.createdAt)}</td>
                    <td className="py-3.5">
                      {c.isActive ? (
                        <Badge className="bg-green-50 text-green-800 ring-green-200">Active</Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 ring-red-200">Deactivated</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination pagination={data?.pagination} noun="customers" />
      </Card>
    </>
  );
}
