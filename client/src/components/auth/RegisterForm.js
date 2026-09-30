"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import PasswordField from "@/components/ui/PasswordField";
import Alert from "@/components/ui/Alert";
import { useAuth, homeFor, safeNext } from "@/context/AuthContext";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const validate = (f) => {
  const errors = {};
  if (!f.name.trim()) errors.name = "Please enter your name";
  if (!EMAIL_RE.test(f.email.trim())) errors.email = "Please enter a valid email";
  if (f.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (f.confirmPassword !== f.password) errors.confirmPassword = "Passwords don't match";
  return errors;
};

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const { user, loading, register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && !submitting) router.replace(next || homeFor(user));
  }, [loading, user, next, router, submitting]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear a field's error as soon as the user edits it
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const created = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        companyName: form.companyName.trim() || undefined,
        phone: form.phone.trim() || undefined,
      });
      router.replace(next || homeFor(created));
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  };

  const emailTaken = /already exists/i.test(serverError);

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Alert type="error">
        {serverError}
        {emailTaken && (
          <>
            {" "}
            <Link href="/login" className="font-semibold underline">Log in instead</Link>
          </>
        )}
      </Alert>

      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        required
        autoFocus
        value={form.name}
        onChange={onChange}
        error={errors.name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={form.email}
        onChange={onChange}
        error={errors.email}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Company"
          name="companyName"
          autoComplete="organization"
          value={form.companyName}
          onChange={onChange}
          hint="Optional"
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={onChange}
          hint="Optional"
        />
      </div>

      <PasswordField
        label="Password"
        name="password"
        autoComplete="new-password"
        required
        value={form.password}
        onChange={onChange}
        error={errors.password}
        hint="At least 8 characters"
      />
      <PasswordField
        label="Confirm password"
        name="confirmPassword"
        autoComplete="new-password"
        required
        value={form.confirmPassword}
        onChange={onChange}
        error={errors.confirmPassword}
      />

      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        Create account
      </Button>

      <p className="text-center text-xs text-slate-500">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline hover:text-slate-700">Terms of Service</Link> and{" "}
        <Link href="/privacy" className="underline hover:text-slate-700">Privacy Policy</Link>.
      </p>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
