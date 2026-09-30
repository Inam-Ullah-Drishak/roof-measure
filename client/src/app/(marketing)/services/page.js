import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PageHero from "@/components/layout/PageHero";
import SectionHeading, { CheckIcon } from "@/components/marketing/SectionHeading";
import { orderHref } from "@/components/marketing/PricingCards";
import { site, pricing } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { photos } from "@/assets/images";

export const metadata = pageMetadata({
  title: "Roof Measurement Services",
  description:
    "Aerial roof measurement reports for residential roofs, commercial and multi-family buildings, and insurance claims. Accurate area, pitch and line lengths in PDF, ESX, XML or DXF.",
  path: "/services",
  shareTitle: `Aerial Roof Measurement Services | ${site.name}`,
});

const priceOf = (id) => pricing.reportTypes.find((r) => r.id === id)?.price;

// Each id matches a footer link (/services#residential etc.)
const services = [
  {
    id: "residential",
    photo: photos.residential,
    eyebrow: "Residential",
    title: "Residential roof reports",
    text: "Quote re-roofs and repairs without climbing a ladder. Our residential reports give you every measurement you need to order materials and price the job, from simple gables to complex cut-up roofs.",
    reportType: "standard",
    audience: "Roofing contractors, remodelers, homeowners",
    features: [
      "Total roof area and number of squares",
      "Pitch for every roof facet",
      "Ridge, hip, valley, rake and eave lengths",
      "Labeled roof diagram",
      "Waste factor table for ordering materials",
    ],
    note: "Complex roof with many facets? Choose the Premium report for facet-by-facet diagrams and flashing lengths.",
  },
  {
    id: "commercial",
    photo: photos.commercial,
    eyebrow: "Commercial",
    title: "Commercial & multi-family reports",
    text: "Measure large, flat and low-slope roofs on warehouses, retail, apartment complexes and more. Multiple buildings on one property can be included in a single report.",
    reportType: "commercial",
    audience: "Commercial roofers, property managers, facility teams",
    features: [
      "Large and flat roof area measurements",
      "Parapet wall lengths",
      "Multiple structures on one report",
      "Section-by-section breakdown",
      "Priority support",
    ],
  },
  {
    id: "insurance",
    photo: photos.insurance,
    eyebrow: "Insurance & claims",
    title: "Reports for insurance claims",
    text: "Move claims faster with detailed, documented measurements. Add an ESX file and the measurements import straight into Xactimate, with no manual re-entry.",
    reportType: "premium",
    audience: "Insurance adjusters, public adjusters, storm restoration contractors",
    features: [
      "Detailed facet-by-facet diagrams",
      "Flashing and step-flashing lengths",
      "Penetration count and locations",
      "ESX file for Xactimate",
      "Rush turnaround for time-sensitive claims",
    ],
  },
];

const alsoFor = [
  {
    title: "Solar installers",
    text: "Pitch and area for every facet so you can plan panel layouts and send proposals fast.",
  },
  {
    title: "Gutter & siding contractors",
    text: "Eave and rake lengths ready for quoting gutters, fascia and trim.",
  },
  {
    title: "Property managers",
    text: "Consistent measurements across your portfolio for maintenance planning and budgets.",
  },
];

const formats = [
  ["PDF", "Clear diagrams and measurement tables. Included with every report."],
  ["ESX", "Imports directly into Xactimate for insurance estimates."],
  ["XML", "Bring measurements into estimating and CRM software."],
  ["DXF", "Open in AutoCAD and other CAD tools for design work."],
];

// Tells Google what services the business offers
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.text,
      serviceType: "Aerial roof measurement",
      provider: { "@type": "Organization", name: site.name, url: site.url },
      areaServed: "US",
      url: `${site.url}/services#${s.id}`,
      offers: { "@type": "Offer", price: priceOf(s.reportType), priceCurrency: "USD" },
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="Services"
        title="Aerial roof measurements for every job"
        text="Accurate roof reports measured from high-resolution aerial imagery, for homes, commercial buildings and insurance claims. Order online and download your report, with no site visit needed."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {services.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-brand-100 transition-colors hover:bg-white/10"
            >
              {s.eyebrow}
            </a>
          ))}
        </div>
      </PageHero>

      {services.map((s, i) => (
        <section key={s.id} id={s.id} className={`scroll-mt-20 py-16 sm:py-20 ${i % 2 ? "bg-slate-50" : ""}`}>
          <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className={i % 2 ? "lg:order-2" : ""}>
              <Image
                src={s.photo.src}
                alt={s.photo.alt}
                placeholder="blur"
                sizes="(min-width: 1024px) 600px, 100vw"
                className="mb-8 aspect-16/10 h-auto w-full rounded-2xl object-cover shadow-lg ring-1 ring-slate-200"
              />
              <SectionHeading align="left" eyebrow={s.eyebrow} title={s.title} text={s.text} />
              <p className="mt-6 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">Best for:</span> {s.audience}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={orderHref({ reportType: s.reportType })}>Order this report</Button>
                <Button href="/sample-reports" variant="outline">See a sample</Button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-5">
                <h3 className="font-semibold text-slate-900">What you get</h3>
                <p className="text-sm text-slate-500">
                  From <span className="font-display text-2xl font-bold text-slate-900">${priceOf(s.reportType)}</span>
                </p>
              </div>
              <ul className="mt-5 space-y-3">
                {s.features.map((f) => (
                  <li key={f} className="flex gap-3 text-slate-700">
                    <CheckIcon className="mt-0.5 h-5 w-5 flex-none text-brand-600" />
                    {f}
                  </li>
                ))}
              </ul>
              {s.note && <p className="mt-6 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">{s.note}</p>}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Also used by"
            title="One report, many trades"
            text="Our measurements help anyone who needs to know a roof's size and shape before they get there."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {alsoFor.map((a) => (
              <div key={a.title} className="rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow="Delivery formats"
            title="Files that work with your software"
            text="Every report includes a PDF. Add ESX, XML or DXF when you order and import your measurements in seconds."
          />
          <dl className="grid gap-4 sm:grid-cols-2">
            {formats.map(([name, text]) => (
              <div key={name} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <dt className="font-display text-lg font-bold text-brand-700">{name}</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-600">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Not sure which report you need?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Compare report types and see your exact price, or ask our team and we&apos;ll point you to the right one.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/pricing" size="lg">Compare pricing</Button>
            <Button href="/contact" variant="outline" size="lg">Talk to our team</Button>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            Want to see how it works first?{" "}
            <Link href="/how-it-works" className="font-semibold text-brand-700 hover:text-brand-800">Read about our process</Link>
          </p>
        </div>
      </section>
    </>
  );
}
