import Link from "next/link";
import SectionHeading from "@/components/marketing/SectionHeading";
import { featuredFaqs } from "@/config/faqs";

// Top questions on the Home page; the full list is on /faq.
// (No FAQ structured data here: the FAQ page already has it for these questions.)
export default function FaqPreview({ className = "" }) {
  return (
    <section className={`py-20 sm:py-24 ${className}`}>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Questions? We've got answers"
            text="The things people ask us most. Can't find what you're looking for?"
          />
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-semibold">
            <Link href="/faq" className="text-brand-700 hover:text-brand-800">See all FAQs &rarr;</Link>
            <Link href="/contact" className="text-slate-600 hover:text-slate-900">Contact us</Link>
          </div>
        </div>

        <div className="divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200 lg:col-span-2">
          {featuredFaqs.map((f) => (
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
      </div>
    </section>
  );
}
