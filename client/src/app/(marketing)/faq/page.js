import Link from "next/link";
import Button from "@/components/ui/Button";
import PageHero from "@/components/layout/PageHero";
import { orderHref } from "@/components/marketing/PricingCards";
import { site, pricing } from "@/config/site";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about our aerial roof measurement reports: ordering, accuracy, pricing, payment, turnaround, file formats and your account.",
  alternates: { canonical: "/faq" },
  openGraph: { title: `Frequently Asked Questions | ${site.name}`, url: "/faq" },
};

const fromPrice = Math.min(...pricing.reportTypes.map((r) => r.price));
const rushPrice = pricing.addOns.find((a) => a.id === "rush").price;
const esxPrice = pricing.formats.find((f) => f.id === "esx").price;

// PLACEHOLDER: confirm turnaround times, accuracy and refund policy with the client
const groups = [
  {
    id: "ordering",
    title: "Ordering",
    faqs: [
      {
        q: "How do I order a roof report?",
        a: "Create a free account, enter the property address, choose your report type, file formats and turnaround, then pay securely online. It takes just a few minutes.",
      },
      {
        q: "Do you need to visit the property?",
        a: "No. We measure roofs from high-resolution aerial imagery, so nobody needs to go on site or climb onto the roof.",
      },
      {
        q: "Which report type should I choose?",
        a: "Standard suits most homes. Choose Premium for complex roofs with many facets or for insurance claims, and Commercial for flat roofs, large buildings and multi-family properties.",
      },
      {
        q: "Can I add a claim number or PO to my order?",
        a: "Yes. The order form has fields for a claim number and your own reference or PO number, plus a box for special instructions.",
      },
      {
        q: "What if I entered the wrong address?",
        a: "Contact us as soon as possible with your order number. If we haven't started measuring yet, we can correct it for you.",
      },
    ],
  },
  {
    id: "reports",
    title: "Reports & accuracy",
    faqs: [
      {
        q: "What's included in a report?",
        a: "Total roof area and squares, the pitch of every facet, ridge, hip, valley, rake and eave lengths, a labeled roof diagram and a waste factor table. Premium and Commercial reports add more detail.",
      },
      {
        q: "How accurate are the measurements?",
        a: "Our measurements are typically within 1–2% of hand measurements. Every report is checked by our team before it's delivered.",
      },
      {
        q: "Can you measure detached garages and sheds?",
        a: "Yes. Tick \"detached structures\" when you order and we'll include them in the same report.",
      },
      {
        q: "What if the aerial imagery is unclear, for example because of trees?",
        a: "If we can't measure a roof accurately from the available imagery, we'll contact you before going further. You won't pay for a report we can't deliver.",
      },
      {
        q: "Can I see an example first?",
        a: "Yes. Visit our sample reports page to see what a report looks like.",
        link: { href: "/sample-reports", label: "See sample reports" },
      },
    ],
  },
  {
    id: "delivery",
    title: "Turnaround & delivery",
    faqs: [
      {
        q: "How long does a report take?",
        a: "Standard reports are usually delivered within 24 hours of payment. Rush orders are usually delivered within a few hours during business hours.",
      },
      {
        q: "How will I know when my report is ready?",
        a: "We email you as soon as it's completed. You can also check the status of every order in your dashboard at any time.",
      },
      {
        q: "Which file formats do you offer?",
        a: `Every report includes a PDF. You can add ESX for Xactimate (+$${esxPrice}), XML for other estimating software, or DXF for AutoCAD and other CAD tools.`,
      },
      {
        q: "Can I download my report again later?",
        a: "Yes. Your reports stay in your dashboard, so you can download them again whenever you need them.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & payment",
    faqs: [
      {
        q: "How much does a report cost?",
        a: `Reports start at $${fromPrice}. You see the exact price, including any add-ons, before you pay.`,
        link: { href: "/pricing", label: "See full pricing" },
      },
      {
        q: "Is there a subscription?",
        a: "No. You pay per report, only when you order. Creating an account is free.",
      },
      {
        q: "How do I pay?",
        a: "By card through Stripe's secure checkout. We never see or store your card details.",
      },
      {
        q: "How much is rush delivery?",
        a: `Rush turnaround is +$${rushPrice} per report and moves your order to the front of our queue.`,
      },
      {
        q: "Can I get a refund?",
        a: "If we can't complete your report, you get a full refund. If there's a problem with a delivered report, contact us and we'll correct it or make it right.",
      },
      {
        q: "Do you offer volume discounts?",
        a: "If you order reports regularly, contact us and we'll talk about pricing that works for your business.",
      },
    ],
  },
  {
    id: "account",
    title: "Your account",
    faqs: [
      {
        q: "Do I need an account to order?",
        a: "Yes. A free account lets you track your orders, pay, and download your reports any time.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "Use the \"Forgot password\" link on the login page and we'll email you a link to choose a new one.",
        link: { href: "/forgot-password", label: "Reset your password" },
      },
      {
        q: "Can I cancel an order?",
        a: "You can cancel an unpaid order from your dashboard. For a paid order, contact us before we start measuring.",
      },
    ],
  },
];

// Helps Google show these questions in search results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((g) =>
    g.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        text="Everything you need to know about ordering, pricing and receiving your roof measurement reports."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-brand-100 transition-colors hover:bg-white/10"
            >
              {g.title}
            </a>
          ))}
        </div>
      </PageHero>

      <div className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-14 px-4 sm:px-6 lg:px-8">
          {groups.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-20">
              <h2 className="text-2xl font-bold sm:text-3xl">{g.title}</h2>
              <div className="mt-6 divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200">
                {g.faqs.map((f) => (
                  <details key={f.q} className="group px-6 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                      {f.q}
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 leading-7 text-slate-600">{f.a}</p>
                    {f.link && (
                      <Link href={f.link.href} className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800">
                        {f.link.label} &rarr;
                      </Link>
                    )}
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Still have a question?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Our team is happy to help. Send us a message, or email{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-brand-700 hover:text-brand-800">{site.email}</a>.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg">Contact us</Button>
            <Button href={orderHref()} variant="outline" size="lg">Order a report</Button>
          </div>
        </div>
      </section>
    </>
  );
}
