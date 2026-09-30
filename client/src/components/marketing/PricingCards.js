import Button from "@/components/ui/Button";
import { CheckIcon } from "@/components/marketing/SectionHeading";
import { pricing } from "@/config/site";

// Link that opens the order form with options already chosen.
// Logged-out visitors sign up first, then land on the form.
export const orderHref = (options = {}) => {
  const form = `/dashboard/orders/new${Object.keys(options).length ? `?${new URLSearchParams(options)}` : ""}`;
  return `/register?next=${encodeURIComponent(form)}`;
};

export default function PricingCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {pricing.reportTypes.map((r) => (
        <div
          key={r.id}
          className={`relative flex flex-col rounded-2xl p-8 ${
            r.popular ? "bg-brand-950 text-slate-300 shadow-xl ring-2 ring-brand-600" : "border border-slate-200 bg-white"
          }`}
        >
          {r.popular && (
            <span className="absolute -top-3 left-8 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-brand-950">
              Most popular
            </span>
          )}
          <h3 className={`text-xl font-semibold ${r.popular ? "text-white" : ""}`}>{r.name}</h3>
          <p className={`mt-1 text-sm ${r.popular ? "text-slate-400" : "text-slate-500"}`}>{r.audience}</p>
          <p className="mt-6 flex items-baseline gap-1">
            <span className={`font-display text-4xl font-bold ${r.popular ? "text-white" : "text-slate-900"}`}>${r.price}</span>
            <span className="text-sm">/ report</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {r.features.map((f) => (
              <li key={f} className="flex gap-2">
                <CheckIcon className={`h-5 w-5 flex-none ${r.popular ? "text-accent-400" : "text-brand-600"}`} />
                {f}
              </li>
            ))}
          </ul>
          <Button href={orderHref({ reportType: r.id })} variant={r.popular ? "accent" : "outline"} className="mt-8 w-full">
            Order {r.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
