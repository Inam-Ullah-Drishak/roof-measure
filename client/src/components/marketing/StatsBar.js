import { stats } from "@/config/site";

// Row of headline numbers (placeholders in site.js until the client confirms them)
export default function StatsBar({ className = "" }) {
  return (
    <section className={`border-b border-slate-200 bg-white ${className}`} aria-label="Key numbers">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map(([value, label]) => (
          <div key={label} className="flex flex-col-reverse text-center">
            <dt className="mt-1 text-sm text-slate-500">{label}</dt>
            <dd className="font-display text-3xl font-extrabold text-brand-700 sm:text-4xl">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
