import SectionHeading, { CheckIcon } from "@/components/marketing/SectionHeading";
import { serviceArea } from "@/config/site";

// Where we measure roofs. The state names also help local search.
export default function ServiceArea({ className = "" }) {
  const nationwide = serviceArea.states.length >= 50;

  return (
    <section className={`py-20 sm:py-24 ${className}`}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <SectionHeading
            align="left"
            eyebrow="Service area"
            title={nationwide ? "Roof reports anywhere in the US" : "Where we measure"}
            text={serviceArea.text}
          />
          <ul className="mt-6 space-y-3 text-slate-700">
            {serviceArea.points.map((p) => (
              <li key={p} className="flex gap-3">
                <CheckIcon className="mt-0.5 h-5 w-5 flex-none text-brand-600" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <ul className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:col-span-3 lg:grid-cols-10" aria-label="States we serve">
          {serviceArea.states.map(([code, name]) => (
            <li
              key={code}
              title={name}
              className="flex aspect-square items-center justify-center rounded-lg bg-brand-50 font-display text-sm font-bold text-brand-700 ring-1 ring-brand-100"
            >
              <abbr title={name} className="no-underline">{code}</abbr>
              <span className="sr-only">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
