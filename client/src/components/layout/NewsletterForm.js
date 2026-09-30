"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Button";
import { api } from "@/lib/api";

// Footer signup. Saved to the Subscribers list in the admin panel.
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: hidden from real visitors
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email." });
      return;
    }
    setSending(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await api("/newsletter", { method: "POST", body: { email: email.trim(), source: "footer", website } });
      setStatus({ type: "success", message: res.message });
      setEmail("");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h3 className="font-sans text-sm font-semibold text-white">Roofing tips in your inbox</h3>
      <p className="mt-2 text-sm text-slate-400">New guides and updates, about once a month. Unsubscribe any time.</p>
      <form onSubmit={onSubmit} noValidate className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        />
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-brand-950 transition-colors hover:bg-accent-400 disabled:opacity-60"
        >
          {sending && <Spinner />}
          Subscribe
        </button>
      </form>
      {status.message && (
        <p role={status.type === "error" ? "alert" : "status"} className={`mt-2 text-sm ${status.type === "error" ? "text-red-300" : "text-green-300"}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}
