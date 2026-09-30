"use client";

import { useState } from "react";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import Button, { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Field from "@/components/ui/Field";
import { Badge, OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import PageHeader from "@/components/dashboard/PageHeader";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { formatAddress, formatDate, formatMoney } from "@/lib/format";

export default function AdminCustomerDetails({ id }) {
  const { data, error, loading, reload } = useApi(`/admin/customers/${id}`);

  if (loading && !data) {
    return <div className="flex justify-center py-24 text-brand-600"><Spinner className="h-8 w-8" /></div>;
  }
  if (error || !data) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Customer not found</h1>
        <p className="mt-2 text-slate-600">{error?.status === 0 ? error.message : "This customer doesn't exist or was removed."}</p>
        <Button href="/admin/customers" variant="outline" className="mt-6">Back to customers</Button>
      </div>
    );
  }

  const { customer, stats, recentOrders } = data;

  const statCards = [
    { label: "Total orders", value: stats.totalOrders },
    { label: "Open", value: stats.pendingOrders },
    { label: "Completed", value: stats.completedOrders },
    { label: "Total spent", value: formatMoney(stats.totalSpent) },
  ];

  return (
    <>
      <PageHeader
        title={customer.name}
        description={`Customer since ${formatDate(customer.createdAt)}`}
        actions={
          customer.isActive ? (
            <Badge className="bg-green-50 text-green-800 ring-green-200">Active</Badge>
          ) : (
            <Badge className="bg-red-50 text-red-700 ring-red-200">Deactivated</Badge>
          )
        }
      >
        <BackButton href="/admin/customers">Back to customers</BackButton>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Recent orders"
            actions={
              stats.totalOrders > 0 && (
                <Link href={`/admin/orders?customer=${customer._id}`} className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                  All {stats.totalOrders} orders
                </Link>
              )
            }
          >
            {recentOrders.length === 0 ? (
              <EmptyState title="No orders yet" />
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentOrders.map((o) => (
                  <li key={o._id}>
                    <Link href={`/admin/orders/${o._id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 hover:bg-slate-50">
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-700">{o.orderNumber}</p>
                        <p className="truncate text-sm text-slate-600">{formatAddress(o.property)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <OrderStatusBadge status={o.status} />
                        <PaymentStatusBadge status={o.payment?.status} />
                        <span className="w-20 text-right text-sm font-medium text-slate-900">{formatMoney(o.price)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <EditCustomer key={customer.updatedAt} customer={customer} onDone={reload} />
          <AccountStatus customer={customer} onDone={reload} />
        </div>
      </div>
    </>
  );
}

function EditCustomer({ customer, onDone }) {
  const initial = { name: customer.name || "", companyName: customer.companyName || "", phone: customer.phone || "" };
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const changed = Object.keys(initial).some((k) => form[k] !== initial[k]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus({ type: "", message: "" });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatus({ type: "error", message: "Name is required." });
      return;
    }
    setSaving(true);
    try {
      await api(`/admin/customers/${customer._id}`, {
        method: "PATCH",
        body: { name: form.name.trim(), companyName: form.companyName.trim(), phone: form.phone.trim() },
      });
      onDone();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
      setSaving(false);
    }
  };

  return (
    <Card title="Details">
      <form onSubmit={save} className="space-y-4" noValidate>
        <Alert type={status.type || "info"}>{status.message}</Alert>
        <Field label="Name" name="name" required value={form.name} onChange={onChange} />
        <Field label="Email" name="email" value={customer.email} disabled />
        <Field label="Company" name="companyName" value={form.companyName} onChange={onChange} />
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} />
        <div className="flex gap-2">
          <Button type="submit" loading={saving} disabled={!changed}>Save</Button>
          <a href={`mailto:${customer.email}`} className="inline-flex items-center rounded-lg px-4 text-sm font-semibold text-brand-700 hover:bg-brand-50">
            Email customer
          </a>
        </div>
      </form>
    </Card>
  );
}

function AccountStatus({ customer, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    const deactivate = customer.isActive;
    if (deactivate && !window.confirm(`Deactivate ${customer.name}? They won't be able to log in until you reactivate them.`)) return;
    setBusy(true);
    setError("");
    try {
      await api(`/admin/customers/${customer._id}/status`, { method: "PATCH", body: { isActive: !deactivate } });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Account access">
      <Alert type="error" className="mb-3">{error}</Alert>
      <p className="text-sm text-slate-600">
        {customer.isActive
          ? "This customer can log in and place orders."
          : "This account is deactivated. The customer can't log in."}
      </p>
      <Button
        variant="outline"
        className={`mt-4 ${customer.isActive ? "text-red-700" : "text-green-700"}`}
        loading={busy}
        onClick={toggle}
      >
        {customer.isActive ? "Deactivate account" : "Reactivate account"}
      </Button>
    </Card>
  );
}
