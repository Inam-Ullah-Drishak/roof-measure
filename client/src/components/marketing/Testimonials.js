import SectionHeading from "@/components/marketing/SectionHeading";

// PLACEHOLDER: replace with real customer quotes (with their permission) before launch.
// Don't add review/rating structured data for these until they're real reviews.
const testimonials = [
  {
    quote:
      "We used to lose half a day measuring every roof. Now I order a report from the office and have numbers before I even call the homeowner back.",
    name: "Mike Thompson",
    role: "Owner",
    company: "Thompson Roofing Co.",
    trade: "Roofing contractor",
  },
  {
    quote:
      "The ESX file drops straight into Xactimate. That alone saves me a lot of time on every claim, and the diagrams are clear enough to share with the carrier.",
    name: "Sarah Mitchell",
    role: "Independent Adjuster",
    company: "Mitchell Claims Services",
    trade: "Insurance adjuster",
  },
  {
    quote:
      "Pitch and area for every facet is exactly what we need to lay out panels. Ordering is simple and the pricing is easy to build into our proposals.",
    name: "David Chen",
    role: "Project Manager",
    company: "BrightPath Solar",
    trade: "Solar installer",
  },
];

const initials = (name) => name.split(" ").map((p) => p[0]).join("");

export default function Testimonials({ className = "" }) {
  return (
    <section className={`py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by roofing professionals"
          text="Contractors, adjusters and installers use our reports to quote faster and with confidence."
        />

        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.name}>
              <figure className="flex h-full flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="flex gap-1 text-accent-500" aria-label="5 out of 5 stars" role="img">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg key={i} className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5Z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="mt-5 flex-1 text-lg leading-8 text-slate-700">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-600 font-display font-bold text-white" aria-hidden="true">
                    {initials(t.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="truncate text-sm text-slate-500">{t.role}, {t.company}</p>
                  </div>
                  <span className="ml-auto hidden flex-none rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:inline-block">
                    {t.trade}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
