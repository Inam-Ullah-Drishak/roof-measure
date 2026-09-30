import Link from "next/link";
import Button from "@/components/ui/Button";
import PageHero from "@/components/layout/PageHero";
import RoofDiagram from "@/components/home/RoofDiagram";
import SectionHeading, { CheckIcon } from "@/components/marketing/SectionHeading";
import { orderHref } from "@/components/marketing/PricingCards";
import { site, pricing } from "@/config/site";

export const metadata = {
  title: "Sample Roof Reports",
  description:
    "See what's inside our aerial roof measurement reports: roof diagrams, total area and squares, pitch per facet, ridge, hip, valley, rake and eave lengths, and a waste factor table.",
  alternates: { canonical: "/sample-reports" },
  openGraph: { title: `Sample Roof Measurement Reports | ${site.name}`, url: "/sample-reports" },
};

// Put the sample PDFs in client/public/samples/ and set `file` (e.g. "/samples/standard.pdf").
// Until a file is set, the card asks visitors to request that sample instead.
const samples = [
  { reportType: "standard", title: "Standard residential report", text: "A typical single-family home with a hip roof.", file: "" },
  { reportType: "premium", title: "Premium residential report", text: "A complex roof with facet-by-facet diagrams and flashing lengths.", file: "" },
  { reportType: "commercial", title: "Commercial report", text: "A flat-roof commercial building with parapet walls.", file: "" },
];

// Example numbers shown in the preview (match the diagram and the home page)
const summary = [
  ["Total roof area", "2,846 sq ft"],
  ["Total squares", "28.5"],
  ["Roof facets", "4"],
  ["Predominant pitch", "8/12"],
];

const lines = [
  ["Ridges", "22' 3\""],
  ["Hips", "78' 4\""],
  ["Valleys", "14' 2\""],
  ["Rakes", "39' 4\""],
  ["Eaves", "169' 0\""],
];

const facets = [
  ["A", "8/12", "1,012"],
  ["B", "8/12", "411"],
  ["C", "8/12", "411"],
  ["D", "8/12", "1,012"],
];

const waste = [0, 10, 12, 15, 17, 20].map((pct) => [pct, ((2846 * (1 + pct / 100)) / 100).toFixed(1)]);

const sections = [
  { title: "Roof diagrams", text: "Top-down diagrams with every facet labeled, so you can match numbers to the roof at a glance." },
  { title: "Area & squares", text: "Total roof area in square feet and roofing squares, plus the area of each facet." },
  { title: "Pitch", text: "The pitch of every facet and the predominant pitch of the roof." },
  { title: "Line lengths", text: "Ridge, hip, valley, rake and eave totals for ordering ridge cap, drip edge and starter." },
  { title: "Waste factor table", text: "Squares to order at common waste percentages, so material orders are right first time." },
  { title: "Property image", text: "An aerial image of the property so you know exactly which building was measured." },
];

const formats = [
  ["PDF", "Clear diagrams and tables. Included with every report."],
  ["ESX", "Imports directly into Xactimate."],
  ["XML", "For estimating and CRM software."],
  ["DXF", "Opens in AutoCAD and other CAD tools."],
];

export default function SampleReportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Sample reports"
        title="See exactly what you'll get"
        text="Every report is built to help you quote with confidence: clear diagrams, accurate measurements and the files your software needs."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={orderHref()} variant="accent" size="lg">Order a report</Button>
          <Button href="#downloads" variant="light" size="lg">Sample downloads</Button>
        </div>
      </PageHero>

      {/* Report preview */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Report preview"
            title="Inside a roof measurement report"
            text="An example of the main pages of a Standard report for a residential hip roof."
          />

          <div className="mt-12 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <p className="font-display font-bold text-slate-900">{site.name} · Roof Measurement Report</p>
                <p className="text-sm text-slate-500">123 Example St, Anytown, TX 75001 · Standard report</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Example</span>
            </div>

            <div className="grid gap-8 p-6 lg:grid-cols-5 lg:p-8">
              <div className="lg:col-span-3">
                <div className="rounded-2xl bg-brand-950 p-3">
                  <RoofDiagram className="h-auto w-full" />
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {summary.map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
                      <dd className="mt-1 font-display text-xl font-bold text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <PreviewTable title="Line lengths" head={["Line", "Length"]} rows={lines} />
                <PreviewTable title="Facets" head={["Facet", "Pitch", "Area (sq ft)"]} rows={facets} />
                <PreviewTable
                  title="Waste factor"
                  head={["Waste", "Squares"]}
                  rows={waste.map(([pct, sq]) => [`${pct}%`, sq])}
                />
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            Example data for illustration. Your report shows the measurements for your property.
          </p>
        </div>
      </section>

      {/* What's in it */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What's inside"
            title="Everything you need to quote the job"
            text="Each section of the report answers a question you'd otherwise need a ladder and a tape measure for."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <div key={s.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare report types */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Report types"
            title="Compare what each report includes"
            text="Choose the report that fits the roof and the job."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pricing.reportTypes.map((r) => (
              <div key={r.id} className="flex flex-col rounded-2xl border border-slate-200 p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-semibold">{r.name}</h3>
                  <p className="font-display text-2xl font-bold text-slate-900">${r.price}</p>
                </div>
                <p className="mt-1 text-sm text-slate-500">{r.audience}</p>
                <ul className="mt-5 flex-1 space-y-3">
                  {r.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-slate-700">
                      <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button href={orderHref({ reportType: r.id })} variant="outline" className="mt-6 w-full">
                  Order {r.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section id="downloads" className="scroll-mt-20 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Downloads"
            title="Download a sample report"
            text="See a full report for each report type before you order."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {samples.map((s) => (
              <div key={s.reportType} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6M9 13h6M9 17h4" />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{s.text}</p>
                {s.file ? (
                  <a
                    href={s.file}
                    download
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                  >
                    Download PDF
                  </a>
                ) : (
                  <Button href="/contact" variant="outline" className="mt-6 w-full">Request this sample</Button>
                )}
              </div>
            ))}
          </div>

          <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {formats.map(([name, text]) => (
              <div key={name} className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
                <dt className="font-display font-bold text-brand-700">{name}</dt>
                <dd className="mt-1 text-sm text-slate-600">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Get a report for your next job</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Enter the address, choose your options and download your report from your dashboard.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={orderHref()} size="lg">Order a report</Button>
            <Button href="/pricing" variant="outline" size="lg">See pricing</Button>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            Questions about a report?{" "}
            <Link href="/contact" className="font-semibold text-brand-700 hover:text-brand-800">Contact our team</Link>
          </p>
        </div>
      </section>
    </>
  );
}

function PreviewTable({ title, head, rows }) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
      <h3 className="bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900">{title}</h3>
      <table className="w-full text-left text-sm">
        <thead className="text-slate-500">
          <tr>
            {head.map((h, i) => (
              <th key={h} className={`px-4 py-2 font-medium ${i ? "text-right" : ""}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i} className={`px-4 py-2 ${i ? "text-right font-medium text-slate-900" : "text-slate-700"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
