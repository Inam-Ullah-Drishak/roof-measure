import Link from "next/link";
import Button from "@/components/ui/Button";
import PageHero from "@/components/layout/PageHero";
import SectionHeading, { CheckIcon } from "@/components/marketing/SectionHeading";
import PricingCards, { orderHref } from "@/components/marketing/PricingCards";
import PriceCalculator from "@/components/marketing/PriceCalculator";
import { site, pricing } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

const fromPrice = Math.min(...pricing.reportTypes.map((r) => r.price));

export const metadata = pageMetadata({
  title: "Pricing",
  description: `Simple per-report pricing for aerial roof measurement reports, from $${fromPrice}. No subscription. Add rush delivery, detached structures, or ESX, XML and DXF files as needed.`,
  path: "/pricing",
  shareTitle: `Roof Measurement Report Pricing | ${site.name}`,
});

const included = [
  "Total roof area and squares",
  "Pitch for every facet",
  "Ridge, hip, valley, rake and eave lengths",
  "Labeled roof diagrams",
  "Waste factor table",
  "Secure online download",
];

const faqs = [
  {
    q: "Is there a subscription or monthly fee?",
    a: "No. You pay per report, only when you place an order. Creating an account is free.",
  },
  {
    q: "When am I charged?",
    a: "You pay securely by card through Stripe when you place your order. We start measuring as soon as payment is confirmed.",
  },
  {
    q: "Which file format should I choose?",
    a: "Every report includes a PDF. Choose ESX if you estimate in Xactimate, XML for other estimating software, and DXF if you work in AutoCAD or other CAD tools.",
  },
  {
    q: "What does rush turnaround mean?",
    a: "Rush orders go to the front of our queue, so you get your report faster than a standard order.",
  },
  {
    q: "Do you offer volume pricing?",
    a: "If you order reports regularly, contact us and we'll talk about what works for your business.",
  },
];

// Helps Google show prices and the FAQ in search results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Aerial roof measurement report",
      provider: { "@type": "Organization", name: site.name, url: site.url },
      areaServed: "US",
      offers: pricing.reportTypes.map((r) => ({
        "@type": "Offer",
        name: `${r.name} roof report`,
        price: r.price,
        priceCurrency: "USD",
        url: `${site.url}/pricing`,
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

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="Pricing"
        title="Pay per report. No subscription."
        text={`Roof measurement reports from $${fromPrice}. Pick the report you need, add extras only when you need them, and see your exact price before you pay.`}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PricingCards />
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20" id="calculator">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Price calculator"
            title="See your exact price"
            text="Choose your options and we'll show the total you'll pay. Then order with one click."
          />
          <div className="mt-12">
            <PriceCalculator />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Add-ons"
              title="Extras, only when you need them"
              text="Every report comes with a PDF. Add the options below at checkout."
            />
            <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Option</th>
                    <th className="px-5 py-3 text-right font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pricing.formats.map((f) => (
                    <tr key={f.id}>
                      <td className="px-5 py-3.5 text-slate-800">{f.name}</td>
                      <td className="px-5 py-3.5 text-right font-medium text-slate-900">{f.price ? `+$${f.price}` : "Included"}</td>
                    </tr>
                  ))}
                  {pricing.addOns.map((a) => (
                    <tr key={a.id}>
                      <td className="px-5 py-3.5 text-slate-800">{a.name}</td>
                      <td className="px-5 py-3.5 text-right font-medium text-slate-900">+${a.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Every report"
              title="What's included"
              text="Whichever report you choose, you get the measurements you need to quote with confidence."
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-800 ring-1 ring-slate-200">
                  <CheckIcon className="h-5 w-5 flex-none text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Questions" title="Pricing FAQ" />
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
            Still have questions?{" "}
            <Link href="/contact" className="font-semibold text-brand-700 hover:text-brand-800">Contact our team</Link>
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to order your first report?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Create a free account, enter the address and pay securely online.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={orderHref()} size="lg">Order a report</Button>
            <Button href="/sample-reports" variant="outline" size="lg">See a sample report</Button>
          </div>
        </div>
      </section>
    </>
  );
}
