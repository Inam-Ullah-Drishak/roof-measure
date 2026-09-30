import PageHero from "@/components/layout/PageHero";
import { legal } from "@/config/site";

// Shared layout for the Privacy Policy and Terms of Service pages.
// sections: [{ id, title, content: <JSX> }]
export default function LegalPage({ eyebrow, title, intro, sections }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={intro}>
        <p className="mt-6 text-sm text-slate-400">Last updated: {legal.lastUpdated}</p>
      </PageHero>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-4 lg:px-8">
        <nav aria-label="On this page" className="lg:col-span-1">
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ol className="mt-3 space-y-2 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-slate-600 hover:text-brand-700">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="max-w-3xl space-y-12 lg:col-span-3">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-24 leading-7 text-slate-600 [&_a]:font-semibold [&_a]:text-brand-700 hover:[&_a]:text-brand-800 [&_li]:mt-2 [&_p+p]:mt-4 [&_strong]:text-slate-900 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
            >
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                {i + 1}. {s.title}
              </h2>
              {s.content}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
