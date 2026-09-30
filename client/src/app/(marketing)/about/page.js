import Link from "next/link";
import Button from "@/components/ui/Button";
import PageHero from "@/components/layout/PageHero";
import RoofDiagram from "@/components/home/RoofDiagram";
import SectionHeading, { CheckIcon } from "@/components/marketing/SectionHeading";
import { orderHref } from "@/components/marketing/PricingCards";
import { site } from "@/config/site";

export const metadata = {
  title: "About Us",
  description: `${site.name} provides accurate aerial roof measurement reports for roofing contractors, insurance adjusters and solar installers, so they can quote jobs without climbing a ladder.`,
  alternates: { canonical: "/about" },
  openGraph: { title: `About ${site.name}`, url: "/about" },
};

const values = [
  {
    title: "Accuracy first",
    text: "Every report is measured by our team and checked before it's delivered. Your quotes and material orders depend on it, so we don't cut corners.",
    icon: "M9 12l2 2 4-4m5 2a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  },
  {
    title: "Fast turnaround",
    text: "Jobs are won by the contractor who quotes first. We work to get your report back quickly, with rush delivery when you need it sooner.",
    icon: "M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    title: "Simple, fair pricing",
    text: "Pay per report with no subscription, contracts or hidden fees. You see the full price before you pay.",
    icon: "M12 3v18m4-14H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7",
  },
  {
    title: "Real support",
    text: "Questions about a report? You reach a real person on our team who can help, not an automated ticket queue.",
    icon: "M8 10h8M8 14h5m-9 6 3-3h11a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14Z",
  },
];

const whyAerial = [
  "No ladders, harnesses or time on steep roofs",
  "Measure a roof before you drive out to it",
  "Quote more jobs in less time",
  "Consistent, documented measurements for every job",
  "Measurements for roofs that are unsafe to walk",
  "Files that import straight into your software",
];

// PLACEHOLDER: replace the stats and team below with the client's real details
const stats = [
  ["10,000+", "Roofs measured"],
  ["2016", "Founded"],
  ["50", "States covered"],
  ["98%", "Customer satisfaction"],
];

const team = [
  { name: "Alex Morgan", role: "Founder & CEO", bio: "Former roofing contractor who started the company to take the guesswork out of estimates." },
  { name: "Jordan Lee", role: "Head of Measurement", bio: "Leads our measurement team and the quality checks behind every report." },
  { name: "Sam Rivera", role: "Customer Success", bio: "Helps contractors and adjusters get the right report for every job." },
];

const initials = (name) => name.split(" ").map((p) => p[0]).join("");

const serve = ["Roofing contractors", "Insurance adjusters", "Solar installers", "Gutter & siding contractors", "Property managers", "Home builders & remodelers"];

// Tells Google about the business behind the site
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${site.url}/about`,
  mainEntity: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    areaServed: "US",
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="About us"
        title="Roof measurements you can build a quote on"
        text={`${site.name} helps roofing and insurance professionals get accurate roof measurements without a site visit, so they can spend less time on ladders and more time winning jobs.`}
      />

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map(([value, label]) => (
            <div key={label} className="flex flex-col-reverse text-center">
              <dt className="mt-1 text-sm text-slate-500">{label}</dt>
              <dd className="font-display text-3xl font-extrabold text-brand-700 sm:text-4xl">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our mission"
              title="Make measuring a roof the easy part of the job"
            />
            <div className="mt-6 space-y-4 text-lg leading-8 text-slate-600">
              <p>
                Measuring a roof by hand takes time, puts people at risk and often means a second trip to the property.
                One missed facet or wrong pitch can throw off a whole estimate.
              </p>
              <p>
                We measure roofs from high-resolution aerial imagery and turn them into clear, detailed reports. You get
                the area, pitch and every line length you need, ready to quote from or import into your estimating software.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-brand-950 p-3 shadow-xl">
            <RoofDiagram className="h-auto w-full" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What we stand for"
            title="What you can count on"
            text="The promises behind every report we deliver."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={v.icon} />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why aerial + who we serve */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why aerial measurement"
              title="Safer, faster and more consistent"
              text="Aerial measurement replaces the tape measure and the ladder for most jobs."
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {whyAerial.map((w) => (
                <li key={w} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-800 ring-1 ring-slate-200">
                  <CheckIcon className="h-5 w-5 flex-none text-brand-600" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Who we serve"
              title="Built for the trades"
              text="Our reports are used by professionals who need to know a roof's size and shape before they get there."
            />
            <ul className="mt-8 flex flex-wrap gap-3">
              {serve.map((s) => (
                <li key={s} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 ring-1 ring-brand-100">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-slate-600">
              See how our reports fit your work on our{" "}
              <Link href="/services" className="font-semibold text-brand-700 hover:text-brand-800">services page</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our team"
            title="The people behind your reports"
            text="A small team of roofing and measurement specialists who care about getting your numbers right."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {team.map((m) => (
              <li key={m.name} className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 font-display text-2xl font-bold text-white" aria-hidden="true">
                  {initials(m.name)}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{m.name}</h3>
                <p className="text-sm font-medium text-brand-600">{m.role}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{m.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-14 text-center sm:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.3),transparent_55%)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Let&apos;s measure your next roof</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
                Order your first report in minutes, or get in touch and we&apos;ll answer any questions.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href={orderHref()} variant="accent" size="lg">Order a report</Button>
                <Button href="/contact" variant="light" size="lg">Contact us</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
