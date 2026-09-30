"use client";

import { useEffect, useState } from "react";
import Button, { Spinner } from "@/components/ui/Button";
import { orderHref } from "@/components/marketing/PricingCards";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { pricing } from "@/config/site";

const rushPrice = pricing.addOns.find((a) => a.id === "rush").price;
const detachedPrice = pricing.addOns.find((a) => a.id === "detachedStructures").price;

export default function PriceCalculator() {
  const [reportType, setReportType] = useState("premium");
  const [rush, setRush] = useState(false);
  const [detached, setDetached] = useState(false);
  const [formats, setFormats] = useState(["pdf"]);
  const [quote, setQuote] = useState(null);

  const toggleFormat = (id) =>
    id !== "pdf" && setFormats((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  // The server calculates the price, so it always matches what customers pay
  const formatsKey = formats.join(",");
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      api("/orders/quote", {
        method: "POST",
        body: {
          reportType,
          turnaround: rush ? "rush" : "standard",
          includeDetachedStructures: detached,
          deliveryFormats: formatsKey.split(","),
        },
      })
        .then((q) => !cancelled && setQuote(q))
        .catch(() => !cancelled && setQuote(null));
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reportType, rush, detached, formatsKey]);

  const orderLink = orderHref({
    reportType,
    ...(rush && { turnaround: "rush" }),
    ...(detached && { detached: "1" }),
    ...(formats.length > 1 && { formats: formatsKey }),
  });

  return (
    <div className="grid overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 lg:grid-cols-5">
      <div className="space-y-8 p-6 sm:p-8 lg:col-span-3">
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">Report type</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {pricing.reportTypes.map((r) => (
              <label
                key={r.id}
                className={`cursor-pointer rounded-xl border px-4 py-3 transition ${
                  reportType === r.id ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input type="radio" name="calc-report" className="sr-only" checked={reportType === r.id} onChange={() => setReportType(r.id)} />
                <span className="block font-semibold text-slate-900">{r.name}</span>
                <span className="text-sm text-slate-500">${r.price}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">File formats</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {pricing.formats.map((f) => (
              <Toggle key={f.id} checked={formats.includes(f.id)} disabled={f.id === "pdf"} onChange={() => toggleFormat(f.id)}>
                <span className="flex-1">{f.name}</span>
                <span className="text-slate-500">{f.price ? `+$${f.price}` : "Free"}</span>
              </Toggle>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">Extras</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Toggle checked={rush} onChange={() => setRush((v) => !v)}>
              <span className="flex-1">Rush turnaround</span>
              <span className="text-slate-500">+${rushPrice}</span>
            </Toggle>
            <Toggle checked={detached} onChange={() => setDetached((v) => !v)}>
              <span className="flex-1">Detached structures</span>
              <span className="text-slate-500">+${detachedPrice}</span>
            </Toggle>
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col bg-brand-950 p-6 text-slate-300 sm:p-8 lg:col-span-2">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">Your price</p>
        <div className="mt-3 flex min-h-[3.5rem] items-baseline gap-2" aria-live="polite">
          {quote ? (
            <>
              <span className="font-display text-5xl font-bold text-white">{formatMoney(quote.total, quote.currency)}</span>
              <span className="text-sm">per report</span>
            </>
          ) : (
            <Spinner className="h-6 w-6 text-white" />
          )}
        </div>

        {quote && (
          <ul className="mt-6 flex-1 space-y-2 border-t border-white/10 pt-6 text-sm">
            {quote.breakdown.map((line) => (
              <li key={line.label} className="flex justify-between gap-3">
                <span className="capitalize">{line.label}</span>
                <span className="text-white">{formatMoney(line.amount)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-3">
              <span>PDF report</span>
              <span className="text-white">Included</span>
            </li>
          </ul>
        )}

        <Button href={orderLink} variant="accent" size="lg" className="mt-8 w-full">
          Order with these options
        </Button>
        <p className="mt-3 text-center text-xs text-slate-400">No subscription. You only pay when you order.</p>
      </div>
    </div>
  );
}

function Toggle({ checked, disabled, onChange, children }) {
  return (
    <label
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
        checked ? "border-brand-600 bg-brand-50 text-slate-900" : "border-slate-200 text-slate-700 hover:border-slate-300"
      } ${disabled ? "cursor-default" : "cursor-pointer"}`}
    >
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} className="h-4 w-4 accent-brand-600" />
      {children}
    </label>
  );
}
