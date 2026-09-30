"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import PasswordField from "@/components/ui/PasswordField";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/dashboard/PageHeader";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AccountSettings() {
  return (
    <>
      <PageHeader title="Account" description="Manage your details and password." />
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm />
        <PasswordForm />
      </div>
    </>
  );
}

function ProfileForm() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    companyName: user.companyName || "",
    phone: user.phone || "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);

  const changed =
    form.name !== (user.name || "") ||
    form.companyName !== (user.companyName || "") ||
    form.phone !== (user.phone || "");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus({ type: "", message: "" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatus({ type: "error", message: "Name is required." });
      return;
    }
    setSaving(true);
    try {
      const data = await api("/auth/me", {
        method: "PATCH",
        body: { name: form.name.trim(), companyName: form.companyName.trim(), phone: form.phone.trim() },
      });
      setUser(data.user);
      setStatus({ type: "success", message: "Profile saved." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Profile" description="Used on your orders and invoices.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Alert type={status.type || "info"}>{status.message}</Alert>
        <Field label="Full name" name="name" autoComplete="name" required value={form.name} onChange={onChange} />
        <Field
          label="Email"
          name="email"
          type="email"
          value={user.email}
          disabled
          hint="Contact support to change your email."
        />
        <Field label="Company" name="companyName" autoComplete="organization" value={form.companyName} onChange={onChange} />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={onChange} />
        <Button type="submit" loading={saving} disabled={!changed}>Save changes</Button>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const empty = { currentPassword: "", newPassword: "", confirmPassword: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
    setStatus({ type: "", message: "" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!form.currentPassword) found.currentPassword = "Enter your current password";
    if (form.newPassword.length < 8) found.newPassword = "Password must be at least 8 characters";
    if (form.confirmPassword !== form.newPassword) found.confirmPassword = "Passwords don't match";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      await api("/auth/change-password", {
        method: "PATCH",
        body: { currentPassword: form.currentPassword, newPassword: form.newPassword },
      });
      setForm(empty);
      setStatus({ type: "success", message: "Password changed. You've been logged out on other devices." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Change password" description="You'll stay logged in on this device.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Alert type={status.type || "info"}>{status.message}</Alert>
        <PasswordField label="Current password" name="currentPassword" autoComplete="current-password" required value={form.currentPassword} onChange={onChange} error={errors.currentPassword} />
        <PasswordField label="New password" name="newPassword" autoComplete="new-password" required value={form.newPassword} onChange={onChange} error={errors.newPassword} hint="At least 8 characters" />
        <PasswordField label="Confirm new password" name="confirmPassword" autoComplete="new-password" required value={form.confirmPassword} onChange={onChange} error={errors.confirmPassword} />
        <Button type="submit" loading={saving}>Change password</Button>
      </form>
    </Card>
  );
}
