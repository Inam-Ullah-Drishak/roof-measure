"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Button, { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import PageHeader from "@/components/dashboard/PageHeader";
import { SearchBox, Pagination } from "@/components/ui/ListControls";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { formatDate } from "@/lib/format";

// Admin: newsletter signups from the website footer
export default function AdminSubscribers() {
  const searchParams = useSearchParams();
  const get = (k) => searchParams.get(k) || "";

  const query = new URLSearchParams({ limit: "20" });
  for (const k of ["search", "page"]) if (get(k)) query.set(k, get(k));
  const { data, error, loading, reload } = useApi(`/admin/subscribers?${query}`);
  const subscribers = data?.subscribers || [];

  const [removing, setRemoving] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });

  const remove = async (s) => {
    if (!window.confirm(`Remove ${s.email} from the list?`)) return;
    setRemoving(s._id);
    try {
      const res = await api(`/admin/subscribers/${s._id}`, { method: "DELETE" });
      setNotice({ type: "success", message: res.message });
      reload();
    } catch (err) {
      setNotice({ type: "error", message: err.message });
    } finally {
      setRemoving("");
    }
  };

  const exportHref = `/api/admin/subscribers/export${get("search") ? `?search=${encodeURIComponent(get("search"))}` : ""}`;

  return (
    <>
      <PageHeader
        title="Subscribers"
        description="People who signed up for the newsletter. Export them to your email tool to send campaigns."
        actions={
          <a
            href={exportHref}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Export CSV
          </a>
        }
      />

      <Alert type={notice.type || "info"} className="mb-4">{notice.message}</Alert>

      <SearchBox key={get("search")} value={get("search")} placeholder="Search email" className="md:w-80" />

      <Card className="mt-4">
        {loading && !data ? (
          <div className="flex justify-center py-10 text-brand-600"><Spinner className="h-6 w-6" /></div>
        ) : error ? (
          <Alert type="error">{error.message}</Alert>
        ) : subscribers.length === 0 ? (
          <EmptyState title={get("search") ? "No subscribers match" : "No subscribers yet"} text="Signups from the website footer will appear here." />
        ) : (
          <ul className={`divide-y divide-slate-100 ${loading ? "opacity-60" : ""}`}>
            {subscribers.map((s) => (
              <li key={s._id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <a href={`mailto:${s.email}`} className="block truncate font-medium text-slate-900 hover:text-brand-700">{s.email}</a>
                  <p className="text-xs text-slate-500">Signed up {formatDate(s.createdAt)} · {s.source}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" loading={removing === s._id} onClick={() => remove(s)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
        <Pagination pagination={data?.pagination} noun="subscribers" />
      </Card>
    </>
  );
}
