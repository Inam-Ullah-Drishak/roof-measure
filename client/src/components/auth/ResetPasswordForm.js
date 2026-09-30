"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PasswordField from "@/components/ui/PasswordField";
import Alert from "@/components/ui/Alert";
import { api } from "@/lib/api";
import { useAuth, homeFor } from "@/context/AuthContext";

export default function ResetPasswordForm({ token, welcome = false }) {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = {};
    if (form.password.length < 8) found.password = "Password must be at least 8 characters";
    if (form.confirmPassword !== form.password) found.confirmPassword = "Passwords don't match";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      // The server logs the user in after a successful reset
      const data = await api(`/auth/reset-password/${encodeURIComponent(token)}`, {
        method: "POST",
        body: { password: form.password },
      });
      setUser(data.user);
      router.replace(homeFor(data.user));
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  };

  const linkExpired = /invalid or has expired/i.test(serverError);

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Alert type="error">
        {serverError}
        {linkExpired && welcome && " Ask your admin to resend your invite."}
        {linkExpired && !welcome && (
          <>
            {" "}
            <Link href="/forgot-password" className="font-semibold underline">Request a new link</Link>
          </>
        )}
      </Alert>

      <PasswordField
        label={welcome ? "Password" : "New password"}
        name="password"
        autoComplete="new-password"
        required
        autoFocus
        value={form.password}
        onChange={onChange}
        error={errors.password}
        hint="At least 8 characters"
      />
      <PasswordField
        label={welcome ? "Confirm password" : "Confirm new password"}
        name="confirmPassword"
        autoComplete="new-password"
        required
        value={form.confirmPassword}
        onChange={onChange}
        error={errors.confirmPassword}
      />

      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        {welcome ? "Set password and log in" : "Set new password"}
      </Button>
    </form>
  );
}
