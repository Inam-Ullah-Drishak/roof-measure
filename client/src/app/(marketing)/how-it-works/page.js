import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PageHero from "@/components/layout/PageHero";
import SectionHeading, { CheckIcon } from "@/components/marketing/SectionHeading";
import { orderHref } from "@/components/marketing/PricingCards";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { photos } from "@/assets/images";

export const metadata = pageMetadata({
  title: "How It Works",
  description:
    "Order an aerial roof measurement report in minutes: enter the address, choose your options, pay securely and download your report from your dashboard. No site visit or subscription.",
  path: "/how-it-works",
  shareTitle: `How Our Roof Measurement Reports Work | ${site.name}`,
});

const steps = [
  {
    title: "Create your free account",
    text: "Sign up with your name and email. Your account keeps every order, invoice and report in one place.",
    points: ["No subscription or monthly fee", "Takes less than a minute"],
    icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z",
  },
  {
    title: "Enter the address and options",
    text: "Tell us where the property is, then pick your report type, file formats and turnaround. You see the full price as you go.",
    points: ["Standard, Premium or Commercial report", "Add ESX, XML or DXF files", "Rush turnaround and detached structures", "Add a claim number, PO or special notes"],
    icon: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  },
  {
    title: "Pay securely online",
    text: "Pay by card on Stripe's secure checkout. We never see or store your card details. We start work as soon as payment is confirmed.",
    points: ["Secure card payment by Stripe", "Email confirmation for every order"],
    icon: "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 3h18M7 15h3",
  },
  {
    title: "We measure your roof",
    text: "Our team measures every facet of the roof from high-resolution aerial imagery and checks the numbers before your report goes out.",
    points: ["Area, pitch and every line length", "Quality-checked before delivery"],
    icon: "M4 20 20 4M8 20l-4-4M14 14l-2-2m6-2-2-2M10 18l-2-2m8-8-2-2",
  },
  {
    title: "Download your report",
    text: "We email you as soon as your report is ready. Download it from your dashboard any time, in every format you ordered.",
    points: ["Email when your report is ready", "Re-download any time from your dashboard"],
    icon: "M12 4v12m0 0-4-4m4 4 4-4M4 20h16",
  },
];

const statuses = [
  { name: "Pending", text: "Your order is placed. Once payment is confirmed, it joins our measurement queue." },
  { name: "In progress", text: "Our team is measuring your roof and preparing your report files." },
  { name: "Completed", text: "Your report is ready. We email you and it's available to download in your dashboard." },
];

const tips = [
  "Double-check the full street address, city, state and ZIP code.",
  "Choose Commercial for flat roofs, large buildings and multi-family properties.",
  "Tick detached structures if you need the garage or shed measured too.",
  "Use special instructions to point out the right building on a large lot.",
  "Add your claim or PO number so it appears on your order for your records.",
];

const dashboard = [
  "Track the status of every order",
  "Download reports in every format you ordered",
  "Pay for an unpaid order with one click",
  "Update your account details and password",
];

const faqs = [
  {
    q: "Do you need to visit the property?",
    a: "No. We measure roofs from high-resolution aerial imagery, so nobody needs to go on site or climb onto the roof.",
  },
  {
    q: "How will I know when my report is ready?",
    a: "We send you an email as soon as your report is completed. You can also check the status of every order in your dashboard.",
  },
  {
    q: "What if I entered the wrong address?",
    a: "Contact us as soon as possible with your order number. If we haven't started measuring yet, we can correct it for you.",
  },
  {
    q: "Can I download my report again later?",
    a: "Yes. Your reports stay in your dashboard, so you can download them again whenever you need them.",
  },
];

// Helps Google show the ordering steps and FAQ in search results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      name: "How to order an aerial roof measurement report",
      step: steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.text,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function HowItWorksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="How it works"
        title="From address to roof report, all online"
        text="No site visit, no ladder and no software to install. Order in a few minutes and download your report from your dashboard."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={orderHref()} variant="accent" size="lg">Order a report</Button>
          <Button href="/sample-reports" variant="light" size="lg">See a sample report</Button>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Step by step"
            title="Five simple steps"
            text="Here's exactly what happens from the moment you sign up to the moment your report arrives."
          />
          <ol className="relative mt-14 space-y-10 before:absolute before:bottom-6 before:left-6 before:top-6 before:w-px before:bg-slate-200">
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-6">
                <div className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-600 text-white shadow-sm ring-8 ring-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={s.icon} />
                  </svg>
                </div>
                <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm font-semibold text-brand-600">Step {i + 1}</p>
                  <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{s.text}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-slate-700">
                        <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-brand-600" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Order tracking"
            title="Always know where your order is"
            text="Every order shows a clear status in your dashboard, so you never have to chase us for an update."
          />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {statuses.map((s, i) => (
              <li key={s.name} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 font-display text-sm font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Before you order"
              title="Tips for an accurate report"
              text="A few details up front help us measure the right roof the first time."
            />
            <ul className="mt-8 space-y-3">
              {tips.map((t) => (
                <li key={t} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-800 ring-1 ring-slate-200">
                  <CheckIcon className="h-5 w-5 flex-none text-brand-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Your dashboard"
              title="Everything in one place"
              text="Your free account gives you a simple dashboard for all your orders and reports."
            />
            <Image
              src={photos.reportLaptop.src}
              alt={photos.reportLaptop.alt}
              placeholder="blur"
              sizes="(min-width: 1024px) 600px, 100vw"
              className="mt-8 aspect-[16/9] h-auto w-full rounded-2xl object-cover shadow-lg ring-1 ring-slate-200"
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {dashboard.map((d) => (
                <li key={d} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-800 ring-1 ring-slate-200">
                  <CheckIcon className="h-5 w-5 flex-none text-brand-600" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Questions" title="Common questions" />
          <div className="mt-10 divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200">
            {faqs.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                  {f.q}
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-slate-600">
            More questions?{" "}
            <Link href="/faq" className="font-semibold text-brand-700 hover:text-brand-800">Read the full FAQ</Link>
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Create a free account and order your first roof report in minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={orderHref()} size="lg">Order a report</Button>
            <Button href="/pricing" variant="outline" size="lg">See pricing</Button>
          </div>
        </div>
      </section>
    </>
  );
}
