"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import PasswordField from "@/components/ui/PasswordField";
import Alert from "@/components/ui/Alert";
import { useAuth, homeFor, safeNext } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const { user, loading, login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in: skip the form
  useEffect(() => {
    if (!loading && user && !submitting) router.replace(next || homeFor(user));
  }, [loading, user, next, router, submitting]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const loggedIn = await login(form.email.trim(), form.password);
      router.replace(next || homeFor(loggedIn));
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Alert type="error">{error}</Alert>

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        autoFocus
        value={form.email}
        onChange={onChange}
      />

      <div>
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={onChange}
        />
        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            Forgot password?
          </Link>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        Log in
      </Button>

      <p className="text-center text-sm text-slate-600">
        New here?{" "}
        <Link
          href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"}
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Create a free account
        </Link>
      </p>
    </form>
  );
}
