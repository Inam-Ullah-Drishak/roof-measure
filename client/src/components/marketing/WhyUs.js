import Image from "next/image";
import SectionHeading, { CheckIcon } from "@/components/marketing/SectionHeading";
import { photos } from "@/assets/images";
import { site, pricing } from "@/config/site";

const fromPrice = Math.min(...pricing.reportTypes.map((r) => r.price));

// [topic, measuring by hand, with an aerial report]
const rows = [
  ["Time", "Hours per roof, plus driving to the property", "Order in minutes from your desk"],
  ["Safety", "Climbing ladders and walking steep roofs", "Nobody goes on the roof"],
  ["Accuracy", "Easy to miss a facet or misjudge a pitch", "Every facet measured and checked"],
  ["Quoting speed", "Quote after the site visit", "Quote before you arrive"],
  ["Software", "Type measurements in by hand", "ESX, XML and DXF files import directly"],
  ["Cost", "A crew's time on every job, even the ones you lose", `From $${fromPrice} per report, no subscription`],
];

function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}

// "Measuring by hand vs. our reports" comparison
export default function WhyUs({ className = "" }) {
  return (
    <section className={`py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why choose us"
          title="Skip the ladder, not the accuracy"
          text="See how an aerial report compares with measuring every roof by hand."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {[
            { photo: photos.manualMeasuring, label: "Measuring by hand", tone: "bg-slate-900/80 text-white" },
            { photo: photos.reportLaptop, label: `With ${site.name}`, tone: "bg-brand-600 text-white" },
          ].map(({ photo, label, tone }) => (
            <figure key={label} className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <Image
                src={photo.src}
                alt={photo.alt}
                placeholder="blur"
                sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
                className="aspect-[16/10] h-auto w-full object-cover"
              />
              <figcaption className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-sm font-semibold backdrop-blur ${tone}`}>
                {label}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl ring-1 ring-slate-200">
          <div className="hidden grid-cols-[10rem_1fr_1fr] bg-slate-50 text-sm font-semibold md:grid">
            <div className="px-6 py-4" />
            <div className="px-6 py-4 text-slate-500">Measuring by hand</div>
            <div className="bg-brand-600 px-6 py-4 text-white">With {site.name}</div>
          </div>
          <dl className="divide-y divide-slate-200">
            {rows.map(([topic, hand, us]) => (
              <div key={topic} className="grid gap-3 bg-white p-5 md:grid-cols-[10rem_1fr_1fr] md:gap-0 md:p-0">
                <dt className="font-semibold text-slate-900 md:px-6 md:py-5">{topic}</dt>
                <dd className="flex gap-3 text-sm text-slate-500 md:px-6 md:py-5">
                  <XIcon className="mt-0.5 h-5 w-5 flex-none text-slate-400" />
                  <span><span className="sr-only">Measuring by hand: </span>{hand}</span>
                </dd>
                <dd className="flex gap-3 text-sm font-medium text-slate-900 md:bg-brand-50/60 md:px-6 md:py-5">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-none text-brand-600" />
                  <span><span className="sr-only">With {site.name}: </span>{us}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
