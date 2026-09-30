"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Alert from "@/components/ui/Alert";
import { api } from "@/lib/api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }

    setSubmitting(true);
    try {
      await api("/auth/forgot-password", { method: "POST", body: { email: email.trim() } });
      setSentTo(email.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // The server gives the same answer whether or not the account exists
  if (sentTo) {
    return (
      <div className="space-y-6">
        <Alert type="success">
          If an account exists for <strong>{sentTo}</strong>, we&apos;ve sent a link to reset your password.
          The link expires in 15 minutes.
        </Alert>
        <p className="text-sm text-slate-600">
          Didn&apos;t get it? Check your spam folder, or{" "}
          <button
            type="button"
            onClick={() => setSentTo("")}
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            try again
          </button>
          .
        </p>
        <Button href="/login" variant="outline" className="w-full">Back to log in</Button>
      </div>
    );
  }

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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        Send reset link
      </Button>
      <p className="text-center text-sm text-slate-600">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">Back to log in</Link>
      </p>
    </form>
  );
}
