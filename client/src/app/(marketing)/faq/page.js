import Link from "next/link";
import Button from "@/components/ui/Button";
import PageHero from "@/components/layout/PageHero";
import { orderHref } from "@/components/marketing/PricingCards";
import { site } from "@/config/site";
import { faqGroups as groups } from "@/config/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Answers to common questions about our aerial roof measurement reports: ordering, accuracy, pricing, payment, turnaround, file formats and your account.",
  path: "/faq",
  shareTitle: `Frequently Asked Questions | ${site.name}`,
});


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
