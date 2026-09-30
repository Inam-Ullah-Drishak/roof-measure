"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Alert from "@/components/ui/Alert";
import { api } from "@/lib/api";

const SUBJECTS = [
  "Question about a report",
  "Pricing or bulk orders",
  "Help with an existing order",
  "Partnership",
  "Something else",
];

const empty = { name: "", email: "", phone: "", subject: SUBJECTS[0], message: "", website: "" };

export default function ContactForm() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = {};
    if (!form.name.trim()) found.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) found.email = "Please enter a valid email";
    if (form.message.trim().length < 10) found.message = "Please write a little more (at least 10 characters)";
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    setSending(true);
    try {
      await api("/contact", {
        method: "POST",
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          subject: form.subject,
          message: form.message.trim(),
          website: form.website, // spam trap, real visitors leave it empty
        },
      });
      setSent(true);
      setForm(empty);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center ring-1 ring-green-200" role="status">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl text-white">✓</div>
        <h2 className="mt-4 text-2xl font-bold text-green-900">Message sent</h2>
        <p className="mt-2 text-green-800">Thanks for getting in touch. We&apos;ll reply by email, usually within one business day.</p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Alert type="error">{serverError}</Alert>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required value={form.name} onChange={onChange} error={errors.name} />
        <Field label="Email" name="email" type="email" autoComplete="email" required value={form.email} onChange={onChange} error={errors.email} />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={onChange} hint="Optional" />
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-800">Topic</label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={onChange}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-800">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={5000}
          value={form.message}
          onChange={onChange}
          placeholder="How can we help? For an existing order, include the order number (e.g. RM-10001)."
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "message-hint" : undefined}
          className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            errors.message ? "border-red-400 focus:ring-red-200" : "border-slate-300 focus:border-brand-500 focus:ring-brand-200"
          }`}
        />
        {errors.message && <p id="message-hint" className="mt-1.5 text-sm text-red-600">{errors.message}</p>}
      </div>

      {/* Spam trap: hidden from people, bots fill it in. Don't use type="hidden" (bots skip those). */}
      <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={onChange} />
      </div>

      <Button type="submit" size="lg" loading={sending} className="w-full sm:w-auto">Send message</Button>
    </form>
  );
}
