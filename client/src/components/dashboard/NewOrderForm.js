"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button, { Spinner } from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/dashboard/PageHeader";
import { api } from "@/lib/api";
import { goToCheckout } from "@/lib/payments";
import { formatMoney } from "@/lib/format";
import { pricing } from "@/config/site";

const initial = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  propertyType: "residential",
  reportType: "standard",
  deliveryFormats: ["pdf"],
  turnaround: "standard",
  includeDetachedStructures: false,
  claimNumber: "",
  referenceNumber: "",
  specialInstructions: "",
};

const validate = (f) => {
  const errors = {};
  if (!f.street.trim()) errors.street = "Street address is required";
  if (!f.city.trim()) errors.city = "City is required";
  if (!f.state.trim()) errors.state = "State is required";
  if (!f.zipCode.trim()) errors.zipCode = "ZIP code is required";
  return errors;
};

export default function NewOrderForm() {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [quote, setQuote] = useState(null);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };
  const onInput = (e) => set(e.target.name, e.target.value);

  const toggleFormat = (id) => {
    if (id === "pdf") return; // PDF is always included
    set(
      "deliveryFormats",
      form.deliveryFormats.includes(id)
        ? form.deliveryFormats.filter((f) => f !== id)
        : [...form.deliveryFormats, id]
    );
  };

  // Live price from the server (the same calculation used when the order is created)
  const { reportType, turnaround, includeDetachedStructures, deliveryFormats } = form;
  const formatsKey = deliveryFormats.join(",");
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      api("/orders/quote", {
        method: "POST",
        body: { reportType, turnaround, includeDetachedStructures, deliveryFormats: formatsKey.split(",") },
      })
        .then((q) => !cancelled && setQuote(q))
        .catch(() => !cancelled && setQuote(null));
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reportType, turnaround, includeDetachedStructures, formatsKey]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    setSubmitting(true);
    let order;
    try {
      ({ order } = await api("/orders", {
        method: "POST",
        body: {
          property: {
            street: form.street.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            zipCode: form.zipCode.trim(),
          },
          propertyType: form.propertyType,
          reportType: form.reportType,
          deliveryFormats: form.deliveryFormats,
          turnaround: form.turnaround,
          includeDetachedStructures: form.includeDetachedStructures,
          claimNumber: form.claimNumber.trim() || undefined,
          referenceNumber: form.referenceNumber.trim() || undefined,
          specialInstructions: form.specialInstructions.trim() || undefined,
        },
      }));
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
      return;
    }

    // Order saved: go to Stripe. If that fails, the order page has a "Pay now" button.
    try {
      await goToCheckout(order._id);
    } catch (err) {
      router.push(`/dashboard/orders/${order._id}?payment=error&message=${encodeURIComponent(err.message)}`);
    }
  };

  return (
    <>
      <PageHeader title="New order" description="Tell us about the property and choose your report." />

      <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Alert type="error">{serverError}</Alert>

          <Card title="1. Property address">
            <div className="grid gap-4 sm:grid-cols-6">
              <Field className="sm:col-span-6" label="Street address" name="street" autoComplete="street-address" required value={form.street} onChange={onInput} error={errors.street} placeholder="123 Main St" />
              <Field className="sm:col-span-3" label="City" name="city" autoComplete="address-level2" required value={form.city} onChange={onInput} error={errors.city} />
              <Field className="sm:col-span-1" label="State" name="state" autoComplete="address-level1" required value={form.state} onChange={onInput} error={errors.state} placeholder="TX" maxLength={30} />
              <Field className="sm:col-span-2" label="ZIP code" name="zipCode" autoComplete="postal-code" inputMode="numeric" required value={form.zipCode} onChange={onInput} error={errors.zipCode} maxLength={10} />
            </div>
            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-medium text-slate-800">Property type</legend>
              <div className="flex flex-wrap gap-3">
                {[["residential", "Residential"], ["commercial", "Commercial"]].map(([value, label]) => (
                  <Choice key={value} type="radio" name="propertyType" checked={form.propertyType === value} onChange={() => set("propertyType", value)}>
                    {label}
                  </Choice>
                ))}
              </div>
            </fieldset>
          </Card>

          <Card title="2. Report type">
            <fieldset>
              <legend className="sr-only">Report type</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {pricing.reportTypes.map((r) => {
                  const selected = form.reportType === r.id;
                  return (
                    <label
                      key={r.id}
                      className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition ${
                        selected ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input type="radio" name="reportType" value={r.id} checked={selected} onChange={() => set("reportType", r.id)} className="sr-only" />
                      <span className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{r.name}</span>
                        <span className="font-display font-bold text-slate-900">${r.price}</span>
                      </span>
                      <span className="mt-1 text-sm text-slate-500">{r.audience}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </Card>

          <Card title="3. Options">
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-slate-800">Delivery formats</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {pricing.formats.map((f) => (
                  <Choice key={f.id} type="checkbox" checked={form.deliveryFormats.includes(f.id)} disabled={f.id === "pdf"} onChange={() => toggleFormat(f.id)}>
                    <span className="flex-1">{f.name}</span>
                    <span className="text-sm text-slate-500">{f.price ? `+$${f.price}` : f.note}</span>
                  </Choice>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-medium text-slate-800">Turnaround</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <Choice type="radio" name="turnaround" checked={form.turnaround === "standard"} onChange={() => set("turnaround", "standard")}>
                  <span className="flex-1">Standard</span>
                  <span className="text-sm text-slate-500">Included</span>
                </Choice>
                <Choice type="radio" name="turnaround" checked={form.turnaround === "rush"} onChange={() => set("turnaround", "rush")}>
                  <span className="flex-1">Rush</span>
                  <span className="text-sm text-slate-500">+${pricing.addOns.find((a) => a.id === "rush").price}</span>
                </Choice>
              </div>
            </fieldset>

            <div className="mt-6">
              <Choice type="checkbox" checked={form.includeDetachedStructures} onChange={() => set("includeDetachedStructures", !form.includeDetachedStructures)}>
                <span className="flex-1">Include detached structures (garage, shed)</span>
                <span className="text-sm text-slate-500">+${pricing.addOns.find((a) => a.id === "detachedStructures").price}</span>
              </Choice>
            </div>
          </Card>

          <Card title="4. Extra details" description="Optional, but helpful for insurance jobs.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Claim number" name="claimNumber" value={form.claimNumber} onChange={onInput} maxLength={100} />
              <Field label="Your reference / PO" name="referenceNumber" value={form.referenceNumber} onChange={onInput} maxLength={100} />
            </div>
            <div className="mt-4">
              <label htmlFor="specialInstructions" className="mb-1.5 block text-sm font-medium text-slate-800">
                Special instructions
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                rows={4}
                maxLength={1000}
                value={form.specialInstructions}
                onChange={onInput}
                placeholder="e.g. Measure the main house only, the roof was replaced in 2019…"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              <p className="mt-1 text-right text-xs text-slate-400">{form.specialInstructions.length}/1000</p>
            </div>
          </Card>
        </div>

        {/* Order summary (sticks while scrolling on desktop) */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <Card title="Order summary">
            {quote ? (
              <>
                <ul className="space-y-2 text-sm">
                  {quote.breakdown.map((line) => (
                    <li key={line.label} className="flex justify-between gap-3">
                      <span className="capitalize text-slate-600">{line.label}</span>
                      <span className="font-medium text-slate-900">{formatMoney(line.amount)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between gap-3 text-slate-600">
                    <span>PDF report</span>
                    <span>Included</span>
                  </li>
                </ul>
                <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-display text-2xl font-bold text-slate-900">{formatMoney(quote.total, quote.currency)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-center py-6 text-brand-600"><Spinner className="h-5 w-5" /></div>
            )}

            <Button type="submit" size="lg" className="mt-6 w-full" loading={submitting}>
              Continue to payment
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 1 1 8 0v4" />
              </svg>
              Secure payment by Stripe
            </p>
          </Card>
        </div>
      </form>
    </>
  );
}

// Checkbox / radio styled as a selectable row
function Choice({ type, name, checked, disabled, onChange, children }) {
  return (
    <label
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
        checked ? "border-brand-600 bg-brand-50" : "border-slate-200 hover:border-slate-300"
      } ${disabled ? "cursor-default opacity-80" : "cursor-pointer"}`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="h-4 w-4 accent-brand-600"
      />
      <span className="flex flex-1 items-center gap-2 font-medium text-slate-800">{children}</span>
    </label>
  );
}
