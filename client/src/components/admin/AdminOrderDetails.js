"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import Button, { Spinner } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import PageHeader from "@/components/dashboard/PageHeader";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { useAuth } from "@/context/AuthContext";
import { formatBytes, formatDate, formatMoney, reportTypeName, ORDER_STATUS } from "@/lib/format";

// Same rules as the server (server/src/controllers/adminOrderController.js)
const NEXT_STATUSES = {
  pending: ["in_progress", "cancelled"],
  in_progress: ["completed", "pending", "cancelled"],
  completed: ["in_progress"],
  cancelled: ["pending"],
};

const ACTION_LABELS = {
  in_progress: { pending: "Start work", completed: "Reopen" },
  completed: "Mark completed",
  pending: { in_progress: "Move back to pending", cancelled: "Restore order" },
  cancelled: "Cancel order",
};

const actionLabel = (from, to) =>
  typeof ACTION_LABELS[to] === "string" ? ACTION_LABELS[to] : ACTION_LABELS[to][from];

const ALLOWED_FILES = ".pdf,.esx,.xml,.dxf,.jpg,.jpeg,.png";

// Employees can't cancel or restore orders (same rule as the server)
const EMPLOYEE_BLOCKED = ["cancelled"];

export default function AdminOrderDetails({ id }) {
  const { data, error, loading, reload } = useApi(`/admin/orders/${id}`);
  const order = data?.order;

  if (loading && !order) {
    return <div className="flex justify-center py-24 text-brand-600"><Spinner className="h-8 w-8" /></div>;
  }

  if (error || !order) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="mt-2 text-slate-600">{error?.status === 0 ? error.message : "This order doesn't exist, was removed, or isn't assigned to you."}</p>
        <Button href="/admin/orders" variant="outline" className="mt-6">Back to orders</Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            Order {order.orderNumber}
            {order.turnaround === "rush" && (
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-sm font-bold uppercase text-red-700">Rush</span>
            )}
          </span>
        }
        description={`Placed ${formatDate(order.createdAt, { time: true })}`}
        actions={
          <>
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.payment.status} />
          </>
        }
      >
        <BackButton href="/admin/orders">Back to orders</BackButton>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <StatusPanel order={order} onDone={reload} />
          <FilesPanel order={order} onDone={reload} />
          <NotesPanel key={order.adminNotes || ""} order={order} />
          <HistoryPanel order={order} />
        </div>

        <div className="space-y-6">
          <CustomerPanel order={order} />
          <AssignPanel order={order} onDone={reload} />

          <Card title="Property">
            <p className="font-medium text-slate-900">{order.property.street}</p>
            <p className="text-slate-600">{order.property.city}, {order.property.state} {order.property.zipCode}</p>
            <p className="mt-2 text-sm capitalize text-slate-500">{order.propertyType}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${order.property.street}, ${order.property.city}, ${order.property.state} ${order.property.zipCode}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Open in Google Maps ↗
            </a>
          </Card>

          <Card title="Order details">
            <dl className="space-y-3 text-sm">
              <Row label="Report">{reportTypeName(order.reportType)}</Row>
              <Row label="Formats">{order.deliveryFormats.map((f) => f.toUpperCase()).join(", ")}</Row>
              <Row label="Turnaround"><span className="capitalize">{order.turnaround}</span></Row>
              <Row label="Detached structures">{order.includeDetachedStructures ? "Yes" : "No"}</Row>
              {order.claimNumber && <Row label="Claim number">{order.claimNumber}</Row>}
              {order.referenceNumber && <Row label="Reference">{order.referenceNumber}</Row>}
            </dl>
            {order.specialInstructions && (
              <div className="mt-4 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
                <p className="text-sm font-semibold text-amber-900">Customer instructions</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-amber-900">{order.specialInstructions}</p>
              </div>
            )}
          </Card>

          <Card title="Payment">
            <dl className="space-y-3 text-sm">
              <Row label="Total"><span className="font-semibold">{formatMoney(order.price, order.currency)}</span></Row>
              <Row label="Status"><PaymentStatusBadge status={order.payment.status} /></Row>
              {order.payment.paidAt && <Row label="Paid on">{formatDate(order.payment.paidAt, { time: true })}</Row>}
              {order.payment.paymentIntentId && (
                <Row label="Stripe">
                  <span className="break-all font-mono text-xs">{order.payment.paymentIntentId}</span>
                </Row>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}

function StatusPanel({ order, onDone }) {
  const { user } = useAuth();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const isEmployee = user?.role === "employee";
  const options = (NEXT_STATUSES[order.status] || []).filter(
    (s) => !isEmployee || (!EMPLOYEE_BLOCKED.includes(s) && !EMPLOYEE_BLOCKED.includes(order.status))
  );
  const noFiles = order.reportFiles.length === 0;

  const change = async (status) => {
    if (status === "cancelled" && !window.confirm(`Cancel order ${order.orderNumber}?`)) return;
    setError("");
    setBusy(status);
    try {
      await api(`/admin/orders/${order._id}/status`, { method: "PATCH", body: { status, note: note.trim() || undefined } });
      setNote("");
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <Card title="Update status" description={`Currently: ${ORDER_STATUS[order.status]?.label}`}>
      <Alert type="error" className="mb-4">{error}</Alert>

      {order.status === "pending" && order.payment.status !== "paid" && (
        <Alert type="info" className="mb-4">This order hasn&apos;t been paid yet. You can still start it if you&apos;ve arranged payment another way.</Alert>
      )}

      <label htmlFor="status-note" className="mb-1.5 block text-sm font-medium text-slate-800">
        Note <span className="font-normal text-slate-500">(optional, saved in the history)</span>
      </label>
      <textarea
        id="status-note"
        rows={2}
        maxLength={500}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Measured from 2025 imagery"
        className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />

      {isEmployee && order.status === "cancelled" && (
        <p className="mt-4 text-sm text-slate-500">This order was cancelled. Only an admin can restore it.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((status) => {
          const blocked = status === "completed" && noFiles;
          return (
            <Button
              key={status}
              variant={status === "cancelled" ? "outline" : status === "completed" || status === "in_progress" ? "primary" : "outline"}
              className={status === "cancelled" ? "text-red-700" : ""}
              loading={busy === status}
              disabled={Boolean(busy) || blocked}
              title={blocked ? "Upload the report file first" : undefined}
              onClick={() => change(status)}
            >
              {actionLabel(order.status, status)}
            </Button>
          );
        })}
      </div>
      {order.status === "in_progress" && noFiles && (
        <p className="mt-3 text-sm text-slate-500">Upload the report file below before marking this order completed.</p>
      )}
      {order.status === "in_progress" && !noFiles && (
        <p className="mt-3 text-sm text-slate-500">Marking completed emails the customer that their report is ready.</p>
      )}
    </Card>
  );
}

function FilesPanel({ order, onDone }) {
  const inputRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState("");
  const [error, setError] = useState("");

  const onPick = (e) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setError("You can upload up to 5 files at once.");
      return;
    }
    setSelected(files);
  };

  const upload = async () => {
    const body = new FormData();
    selected.forEach((f) => body.append("files", f));
    setUploading(true);
    setError("");
    try {
      await api(`/admin/orders/${order._id}/files`, { method: "POST", body });
      setSelected([]);
      if (inputRef.current) inputRef.current.value = "";
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async (file) => {
    if (!window.confirm(`Delete ${file.fileName}? The customer won't be able to download it anymore.`)) return;
    setDeleting(file._id);
    setError("");
    try {
      await api(`/admin/orders/${order._id}/files/${file._id}`, { method: "DELETE" });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting("");
    }
  };

  const cancelled = order.status === "cancelled";

  return (
    <Card title="Report files" description="Customers can download these after paying.">
      <Alert type="error" className="mb-4">{error}</Alert>

      {order.reportFiles.length > 0 ? (
        <ul className="mb-5 divide-y divide-slate-100 rounded-xl ring-1 ring-slate-200">
          {order.reportFiles.map((f) => (
            <li key={f._id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-50 text-xs font-bold uppercase text-brand-700">
                  {f.format === "other" ? "FILE" : f.format}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{f.fileName}</p>
                  <p className="text-xs text-slate-500">{formatBytes(f.size)} · {formatDate(f.uploadedAt, { time: true })}</p>
                </div>
              </div>
              <div className="flex flex-none gap-2">
                <a href={`/api/orders/${order._id}/files/${f._id}/download`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  Download
                </a>
                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" loading={deleting === f._id} onClick={() => remove(f)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-5 text-sm text-slate-500">No files uploaded yet.</p>
      )}

      {cancelled ? (
        <p className="text-sm text-slate-500">Files can&apos;t be added to a cancelled order.</p>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-300 p-5 text-center">
          <input ref={inputRef} id="report-files" type="file" multiple accept={ALLOWED_FILES} onChange={onPick} className="sr-only" />
          <label htmlFor="report-files" className="cursor-pointer text-sm font-semibold text-brand-700 hover:text-brand-800">
            Choose files
          </label>
          <p className="mt-1 text-xs text-slate-500">PDF, ESX, XML, DXF, JPG or PNG · up to 5 files</p>

          {selected.length > 0 && (
            <div className="mt-4 text-left">
              <ul className="space-y-1 text-sm text-slate-700">
                {selected.map((f) => (
                  <li key={f.name} className="flex justify-between gap-3">
                    <span className="truncate">{f.name}</span>
                    <span className="flex-none text-slate-500">{formatBytes(f.size)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <Button onClick={upload} loading={uploading}>Upload {selected.length} file{selected.length > 1 ? "s" : ""}</Button>
                <Button
                  variant="ghost"
                  disabled={uploading}
                  onClick={() => {
                    setSelected([]);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function NotesPanel({ order }) {
  const [notes, setNotes] = useState(order.adminNotes || "");
  const [saved, setSaved] = useState(order.adminNotes || "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const save = async () => {
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const data = await api(`/admin/orders/${order._id}/notes`, { method: "PATCH", body: { adminNotes: notes } });
      setSaved(data.order.adminNotes || "");
      setStatus({ type: "success", message: "Notes saved." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Internal notes" description="Only your team can see these, never the customer.">
      <Alert type={status.type || "info"} className="mb-4">{status.message}</Alert>
      <textarea
        rows={4}
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setStatus({ type: "", message: "" });
        }}
        aria-label="Internal notes"
        placeholder="e.g. Customer called, wants it by Friday"
        className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <Button className="mt-3" onClick={save} loading={saving} disabled={notes === saved}>Save notes</Button>
    </Card>
  );
}

function HistoryPanel({ order }) {
  const history = [...(order.statusHistory || [])].reverse();
  return (
    <Card title="History">
      <ol className="space-y-4">
        {history.map((h, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-brand-500" aria-hidden="true" />
            <div className="min-w-0 text-sm">
              <p>
                <span className="font-semibold text-slate-900">{ORDER_STATUS[h.status]?.label || h.status}</span>
                <span className="text-slate-500">
                  {" · "}{formatDate(h.changedAt, { time: true })}
                  {h.changedBy?.name && ` · by ${h.changedBy.name}${h.changedBy.role === "customer" ? " (customer)" : ""}`}
                </span>
              </p>
              {h.note && <p className="mt-0.5 whitespace-pre-wrap text-slate-600">{h.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function CustomerPanel({ order }) {
  const { user } = useAuth();
  const c = order.customer;
  if (!c) return <Card title="Customer"><p className="text-sm text-slate-500">This customer account no longer exists.</p></Card>;
  return (
    <Card
      title="Customer"
      actions={
        user?.role === "admin" && (
          <Link href={`/admin/customers/${c._id}`} className="text-sm font-semibold text-brand-700 hover:text-brand-800">View</Link>
        )
      }
    >
      <p className="font-medium text-slate-900">{c.name}</p>
      {c.companyName && <p className="text-sm text-slate-600">{c.companyName}</p>}
      <p className="mt-2 text-sm"><a href={`mailto:${c.email}`} className="text-brand-700 hover:underline">{c.email}</a></p>
      {c.phone && <p className="text-sm"><a href={`tel:${c.phone}`} className="text-slate-700 hover:underline">{c.phone}</a></p>}
      {c.isActive === false && <p className="mt-2 text-sm font-semibold text-red-600">Account deactivated</p>}
    </Card>
  );
}

function AssignPanel({ order, onDone }) {
  const { user } = useAuth();
  const current = order.assignedTo?._id || "";
  const mine = current === user._id;

  if (user.role !== "admin") {
    return (
      <Card title="Assigned to">
        <p className="text-sm text-slate-900">{mine ? "You" : order.assignedTo?.name || "Nobody"}</p>
        <p className="mt-1 text-xs text-slate-500">Only an admin can reassign this order.</p>
      </Card>
    );
  }

  return <AssignControls key={current} order={order} onDone={onDone} />;
}

// Admins: pick any active admin or employee (they get an email)
function AssignControls({ order, onDone }) {
  const { user } = useAuth();
  const current = order.assignedTo?._id || "";
  const team = useApi("/admin/team?status=active");
  const members = team.data?.members || [];

  const [choice, setChoice] = useState(current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const assign = async (assignedTo) => {
    setBusy(true);
    setError("");
    try {
      await api(`/admin/orders/${order._id}/assign`, { method: "PATCH", body: { assignedTo: assignedTo || null } });
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const chosen = members.find((m) => m._id === choice);

  return (
    <Card title="Assigned to">
      <Alert type="error" className="mb-3">{error}</Alert>
      <p className="text-sm text-slate-900">
        {order.assignedTo ? `${order.assignedTo.name}${current === user._id ? " (you)" : ""}` : <span className="text-slate-500">Nobody yet</span>}
      </p>

      <label htmlFor="assign-to" className="mb-1.5 mt-4 block text-sm font-medium text-slate-800">Assign to</label>
      <select
        id="assign-to"
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
        disabled={busy || team.loading}
        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      >
        <option value="">Nobody (unassigned)</option>
        {members.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name}{m._id === user._id ? " (you)" : ""} · {m.role === "admin" ? "Admin" : "Employee"} · {m.openOrders} open
          </option>
        ))}
      </select>
      {team.error && <p className="mt-1.5 text-sm text-red-600">{team.error.message}</p>}
      {chosen && chosen._id !== user._id && choice !== current && (
        <p className="mt-1.5 text-xs text-slate-500">{chosen.name} will get an email about this order.</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" loading={busy} disabled={choice === current} onClick={() => assign(choice)}>
          {choice ? "Assign" : "Unassign"}
        </Button>
        {current !== user._id && (
          <Button size="sm" variant="outline" disabled={busy} onClick={() => assign(user._id)}>Assign to me</Button>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Manage your team on the <Link href="/admin/team" className="font-semibold text-brand-700 hover:text-brand-800">Team page</Link>.
      </p>
    </Card>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-900">{children}</dd>
    </div>
  );
}
