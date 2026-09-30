import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { photos } from "@/assets/images";
import SectionHeading, { CheckIcon } from "@/components/marketing/SectionHeading";
import PricingCards, { orderHref } from "@/components/marketing/PricingCards";
import Testimonials from "@/components/marketing/Testimonials";
import StatsBar from "@/components/marketing/StatsBar";
import WorksWith from "@/components/marketing/WorksWith";
import WhyUs from "@/components/marketing/WhyUs";
import ServiceArea from "@/components/marketing/ServiceArea";
import FaqPreview from "@/components/marketing/FaqPreview";
import BlogPreview from "@/components/blog/BlogPreview";
import { site, pricing } from "@/config/site";

export const metadata = {
  title: { absolute: `${site.name} | Aerial Roof Measurement Reports Online` },
  description: site.description,
  alternates: { canonical: "/" },
};

const audiences = [
  {
    title: "Roofing contractors",
    photo: photos.residential,
    text: "Quote more jobs without climbing ladders. Get accurate squares, pitches and line lengths before you arrive.",
    icon: "M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6",
  },
  {
    title: "Insurance adjusters",
    photo: photos.insurance,
    text: "Claim-ready reports with ESX files that import straight into Xactimate, so estimates move faster.",
    icon: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Zm-3 9 2 2 4-4",
  },
  {
    title: "Solar installers",
    photo: photos.solar,
    text: "Know every facet's pitch and area to plan panel layouts and send proposals the same day.",
    icon: "M12 3v2m0 14v2M5 12H3m18 0h-2M6.3 6.3 4.9 4.9m14.2 14.2-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  },
  {
    title: "Property managers",
    photo: photos.commercial,
    text: "Plan maintenance and budget replacements across your portfolio with consistent, documented measurements.",
    icon: "M4 21V5a2 2 0 0 1 2-2h8l6 6v12M14 3v6h6M8 13h8M8 17h5",
  },
];

const steps = [
  {
    title: "Enter the address",
    text: "Create an account, enter the property address and choose your report type and file formats.",
  },
  {
    title: "Pay securely",
    text: "Pay online by card through Stripe. You'll see the full price before you pay, with no surprises.",
  },
  {
    title: "Download your report",
    text: "Our team measures the roof from high-resolution aerial imagery. We email you as soon as it's ready.",
  },
];

const benefits = [
  "Accurate measurements from aerial imagery",
  "Rush turnaround available",
  "PDF, ESX, XML and DXF formats",
  "Secure online ordering and payment",
];

export default function HomePage() {
  const fromPrice = Math.min(...pricing.reportTypes.map((r) => r.price));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,111,246,0.35),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-brand-100">
              <span className="h-2 w-2 rounded-full bg-accent-500" />
              Reports from ${fromPrice}
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Aerial roof measurements, <span className="text-accent-400">without the ladder</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Order an accurate roof measurement report online for any address. Get total area, pitch,
              and every ridge, hip and valley, delivered as PDF or ready for Xactimate.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={orderHref()} variant="accent" size="lg">Order a report</Button>
              <Button href="/sample-reports" variant="light" size="lg">See a sample report</Button>
            </div>
            <ul className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 flex-none text-accent-400" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src={photos.heroRoof.src}
                  alt={photos.heroRoof.alt}
                  priority
                  placeholder="blur"
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="aspect-4/3 h-auto w-full object-cover"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-brand-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Measured from aerial imagery
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow">
                  Pitch 8/12
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 left-6 hidden rounded-xl bg-white p-4 shadow-xl sm:block">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total roof area</p>
              <p className="font-display text-2xl font-bold text-slate-900">2,846 sq ft</p>
              <p className="text-sm text-slate-500">28.5 squares · 4 facets</p>
            </div>
          </div>
        </div>
      </section>

      <StatsBar />
      <WorksWith />

      {/* Who it's for */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Who we serve"
            title="Built for the people who work on roofs"
            text="Whether you're quoting a re-roof, settling a claim or designing a solar system, you get the numbers you need without a site visit."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <div key={a.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={a.photo.src}
                    alt={a.photo.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
                <div className="relative p-6 pt-8">
                  <div className="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg ring-4 ring-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={a.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">{a.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps to your roof report"
            text="No software to install and no subscription. Order only when you need a report."
          />
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-display font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link href="/how-it-works" className="font-semibold text-brand-700 hover:text-brand-800">
              Learn more about our process &rarr;
            </Link>
          </div>
        </div>
      </section>

      <WhyUs />

      {/* Report types */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Reports & pricing"
            title="Simple, per-report pricing"
            text="Pay per report. Add rush delivery or extra file formats only when you need them."
          />
          <div className="mt-14">
            <PricingCards />
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            PDF included with every report. ESX, XML and DXF files available as add-ons.{" "}
            <Link href="/pricing" className="font-semibold text-brand-700 hover:text-brand-800">See full pricing</Link>
          </p>
        </div>
      </section>

      {/* Formats */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Delivery formats"
              title="Works with the tools you already use"
              text="Every report comes as an easy-to-read PDF. Add the file formats your software needs and import measurements in seconds."
            />
            <Image
              src={photos.reportTablet.src}
              alt={photos.reportTablet.alt}
              placeholder="blur"
              sizes="(min-width: 1024px) 600px, 100vw"
              className="mt-8 aspect-4/3 h-auto w-full rounded-2xl object-cover shadow-lg ring-1 ring-slate-200"
            />
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              ["PDF", "Clear diagrams and measurement tables for your customer or file."],
              ["ESX", "Import directly into Xactimate for insurance estimates."],
              ["XML", "Bring measurements into estimating and CRM software."],
              ["DXF", "Open in AutoCAD and other CAD tools for design work."],
            ].map(([name, text]) => (
              <div key={name} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <dt className="font-display text-lg font-bold text-brand-700">{name}</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-600">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ServiceArea className="bg-slate-50" />
      <Testimonials />
      <FaqPreview className="bg-slate-50" />
      <BlogPreview />

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-14 text-center sm:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.3),transparent_55%)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready for your next roof report?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
                Create a free account and order your first report in minutes. No subscription required.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/register" variant="accent" size="lg">Create free account</Button>
                <Button href="/contact" variant="light" size="lg">Talk to our team</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
