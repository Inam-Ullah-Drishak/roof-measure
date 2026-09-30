"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Button, { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import PageHeader from "@/components/dashboard/PageHeader";
import { FilterTabs, SearchBox, Pagination } from "@/components/ui/ListControls";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { formatDate } from "@/lib/format";
import { site } from "@/config/site";

const STATUS = {
  new: { label: "New", className: "bg-accent-500/15 text-accent-600 ring-accent-500/30" },
  read: { label: "Read", className: "bg-slate-100 text-slate-600 ring-slate-200" },
  replied: { label: "Replied", className: "bg-green-50 text-green-800 ring-green-200" },
};

export default function AdminEnquiries() {
  const searchParams = useSearchParams();
  const get = (k) => searchParams.get(k) || "";

  const query = new URLSearchParams({ limit: "20" });
  for (const k of ["status", "search", "page"]) if (get(k)) query.set(k, get(k));
  const { data, error, loading, reload } = useApi(`/admin/enquiries?${query}`);
  const enquiries = data?.enquiries || [];

  const tabs = [
    { value: "", label: "All" },
    { value: "new", label: "New", count: data?.newCount },
    { value: "read", label: "Read" },
    { value: "replied", label: "Replied" },
  ];

  return (
    <>
      <PageHeader title="Enquiries" description="Messages from the website contact form." />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <FilterTabs tabs={tabs} value={get("status")} />
        <SearchBox key={get("search")} value={get("search")} placeholder="Search name, email or message" className="md:w-80" />
      </div>

      <Card className="mt-4">
        {loading && !data ? (
          <div className="flex justify-center py-10 text-brand-600"><Spinner className="h-6 w-6" /></div>
        ) : error ? (
          <Alert type="error">{error.message}</Alert>
        ) : enquiries.length === 0 ? (
          <EmptyState title={get("status") === "new" ? "No new enquiries. You're all caught up." : "No enquiries found"} />
        ) : (
          <ul className={`divide-y divide-slate-100 ${loading ? "opacity-60" : ""}`}>
            {enquiries.map((e) => (
              <Enquiry key={e._id} enquiry={e} onChange={reload} />
            ))}
          </ul>
        )}
        <Pagination pagination={data?.pagination} noun="enquiries" />
      </Card>
    </>
  );
}

function Enquiry({ enquiry: e, onChange }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const setStatus = async (status) => {
    setBusy(status);
    setError("");
    try {
      await api(`/admin/enquiries/${e._id}`, { method: "PATCH", body: { status } });
      onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const toggle = () => {
    setOpen((v) => !v);
    // Opening a new message marks it as read (in the background)
    if (!open && e.status === "new") {
      api(`/admin/enquiries/${e._id}`, { method: "PATCH", body: { status: "read" } })
        .then(onChange)
        .catch(() => {});
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete the message from ${e.name}? This can't be undone.`)) return;
    setBusy("delete");
    try {
      await api(`/admin/enquiries/${e._id}`, { method: "DELETE" });
      onChange();
    } catch (err) {
      setError(err.message);
      setBusy("");
    }
  };

  const replyHref = `mailto:${e.email}?subject=${encodeURIComponent(`Re: ${e.subject || `Your message to ${site.name}`}`)}&body=${encodeURIComponent(
    `Hi ${e.name.split(" ")[0]},\n\n\n\n---\nOn ${formatDate(e.createdAt, { time: true })} you wrote:\n> ${e.message.replace(/\n/g, "\n> ")}`
  )}`;

  return (
    <li className="py-4">
      <button type="button" onClick={toggle} className="flex w-full items-start gap-3 text-left" aria-expanded={open}>
        <span className={`mt-2 h-2 w-2 flex-none rounded-full ${e.status === "new" ? "bg-accent-500" : "bg-transparent"}`} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className={`text-slate-900 ${e.status === "new" ? "font-bold" : "font-semibold"}`}>{e.name}</span>
            <span className="truncate text-sm text-slate-500">{e.email}</span>
            <Badge className={STATUS[e.status]?.className}>{STATUS[e.status]?.label}</Badge>
            <span className="ml-auto text-xs text-slate-500">{formatDate(e.createdAt, { time: true })}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-800">{e.subject || "No subject"}</p>
          {!open && <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{e.message}</p>}
        </div>
      </button>

      {open && (
        <div className="ml-5 mt-3">
          <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-800">{e.message}</p>
          {e.phone && (
            <p className="mt-2 text-sm text-slate-600">
              Phone: <a href={`tel:${e.phone}`} className="font-medium text-brand-700 hover:underline">{e.phone}</a>
            </p>
          )}
          <Alert type="error" className="mt-3">{error}</Alert>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={replyHref} className="inline-flex items-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Reply by email
            </a>
            {e.status !== "replied" && (
              <Button size="sm" variant="outline" loading={busy === "replied"} onClick={() => setStatus("replied")}>
                Mark as replied
              </Button>
            )}
            {e.status !== "new" && (
              <Button size="sm" variant="ghost" loading={busy === "new"} onClick={() => setStatus("new")}>
                Mark as unread
              </Button>
            )}
            <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" loading={busy === "delete"} onClick={remove}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}
