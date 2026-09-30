"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button, { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Field from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import PageHeader from "@/components/dashboard/PageHeader";
import { FilterTabs } from "@/components/ui/ListControls";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

const tabs = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Deactivated" },
];

const ROLES = {
  employee: { label: "Employee", text: "Sees and works only on orders assigned to them." },
  admin: { label: "Admin", text: "Full access: all orders, customers, enquiries and the team." },
};

const selectClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:opacity-60";

export default function AdminTeam() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";
  const { data, error, loading, reload } = useApi(`/admin/team${status ? `?status=${status}` : ""}`);
  const members = data?.members || [];

  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  const done = (message, type = "success") => {
    setNotice({ type, message });
    reload();
  };

  return (
    <>
      <PageHeader
        title="Team"
        description="Admins and employees who work on orders."
        actions={!adding && <Button onClick={() => setAdding(true)}>Add team member</Button>}
      />

      {adding && (
        <AddMemberForm
          onCancel={() => setAdding(false)}
          onAdded={(res) => {
            setAdding(false);
            done(res.message, res.emailSent ? "success" : "error");
          }}
        />
      )}

      <Alert type={notice.type || "info"} className="mb-4">{notice.message}</Alert>

      <FilterTabs tabs={tabs} value={status} />

      <Card className="mt-4">
        {loading && !data ? (
          <div className="flex justify-center py-10 text-brand-600"><Spinner className="h-6 w-6" /></div>
        ) : error ? (
          <Alert type="error">{error.message}</Alert>
        ) : members.length === 0 ? (
          <EmptyState title={status ? "Nobody here" : "No team members yet"} text="Add an employee to start assigning orders." />
        ) : (
          <ul className={`divide-y divide-slate-100 ${loading ? "opacity-60" : ""}`}>
            {members.map((m) => (
              <MemberRow key={`${m._id}-${m.role}-${m.isActive}`} member={m} onDone={done} />
            ))}
          </ul>
        )}
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Object.entries(ROLES).map(([role, r]) => (
          <div key={role} className="rounded-xl bg-white p-4 text-sm ring-1 ring-slate-200">
            <p className="font-semibold text-slate-900">{r.label}</p>
            <p className="mt-1 text-slate-600">{r.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function AddMemberForm({ onCancel, onAdded }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "employee" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = {};
    if (!form.name.trim()) found.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) found.email = "Enter a valid email";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      const res = await api("/admin/team", {
        method: "POST",
        body: { ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined },
      });
      onAdded(res);
    } catch (err) {
      setServerError(err.message);
      setSaving(false);
    }
  };

  return (
    <Card title="Add team member" description="They'll get an email with a link to set their password." className="mb-6">
      <form onSubmit={onSubmit} noValidate>
        <Alert type="error" className="mb-4">{serverError}</Alert>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="name" required autoFocus value={form.name} onChange={onChange} error={errors.name} maxLength={100} />
          <Field label="Email" name="email" type="email" required value={form.email} onChange={onChange} error={errors.email} />
          <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} />
          <div>
            <label htmlFor="new-role" className="mb-1.5 block text-sm font-medium text-slate-800">Role</label>
            <select id="new-role" name="role" value={form.role} onChange={onChange} className={`block w-full py-2.5 ${selectClass}`}>
              {Object.entries(ROLES).map(([value, r]) => (
                <option key={value} value={value}>{r.label}</option>
              ))}
            </select>
            <p className="mt-1.5 text-sm text-slate-500">{ROLES[form.role].text}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button type="submit" loading={saving}>Add and send invite</Button>
          <Button type="button" variant="ghost" disabled={saving} onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}

function MemberRow({ member: m, onDone }) {
  const { user } = useAuth();
  const isSelf = m._id === user._id;
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const run = async (key, request) => {
    setBusy(key);
    setError("");
    try {
      const res = await request();
      onDone(res.message);
    } catch (err) {
      setError(err.message);
      setBusy("");
    }
  };

  const update = (key, body) => run(key, () => api(`/admin/team/${m._id}`, { method: "PATCH", body }));

  const changeRole = (role) => {
    if (role === "admin" && !window.confirm(`Give ${m.name} full admin access?`)) return;
    update("role", { role });
  };

  const toggleActive = () => {
    if (
      m.isActive &&
      !window.confirm(
        `Deactivate ${m.name}? They won't be able to log in${m.openOrders ? ` and their ${m.openOrders} open order(s) will become unassigned` : ""}.`
      )
    )
      return;
    update("active", { isActive: !m.isActive });
  };

  return (
    <li className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700" aria-hidden="true">
          {m.name?.[0]?.toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
            <span className="truncate">{m.name}{isSelf && <span className="font-normal text-slate-500"> (you)</span>}</span>
            {!m.isActive && <Badge className="bg-red-50 text-red-700 ring-red-200">Deactivated</Badge>}
            {m.isActive && m.invitePending && <Badge className="bg-amber-50 text-amber-800 ring-amber-200">Invite pending</Badge>}
          </p>
          <p className="truncate text-sm text-slate-500">{m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <Link href={`/admin/orders?assignedTo=${m._id}`} className="text-slate-600 hover:text-brand-700">
          <span className="font-display text-lg font-bold text-slate-900">{m.openOrders}</span> open
        </Link>
        <span className="text-slate-600">
          <span className="font-display text-lg font-bold text-slate-900">{m.completedOrders}</span> done
        </span>

        {isSelf ? (
          <span className="w-28 text-slate-700">{ROLES[m.role]?.label}</span>
        ) : (
          <select
            value={m.role}
            onChange={(e) => changeRole(e.target.value)}
            disabled={Boolean(busy) || !m.isActive}
            aria-label={`Role for ${m.name}`}
            className={`w-28 ${selectClass}`}
          >
            {Object.entries(ROLES).map(([value, r]) => (
              <option key={value} value={value}>{r.label}</option>
            ))}
          </select>
        )}

        {!isSelf && (
          <div className="flex gap-2">
            {m.isActive && m.invitePending && (
              <Button
                size="sm"
                variant="outline"
                loading={busy === "invite"}
                disabled={Boolean(busy)}
                onClick={() => run("invite", () => api(`/admin/team/${m._id}/invite`, { method: "POST" }))}
              >
                Resend invite
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className={m.isActive ? "text-red-600 hover:bg-red-50" : ""}
              loading={busy === "active"}
              disabled={Boolean(busy)}
              onClick={toggleActive}
            >
              {m.isActive ? "Deactivate" : "Reactivate"}
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
