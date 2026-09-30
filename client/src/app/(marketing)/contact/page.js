import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/layout/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { photos } from "@/assets/images";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: `Questions about aerial roof measurement reports, pricing or an existing order? Contact the ${site.name} team by email, phone or our contact form.`,
  path: "/contact",
  shareTitle: `Contact ${site.name}`,
});

const contactMethods = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: "M3 6h18v12H3zM3 7l9 6 9-6",
  },
  {
    label: "Phone",
    value: site.phone,
    href: `tel:${site.phone.replace(/[^\d+]/g, "")}`,
    icon: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  },
  {
    label: "Hours",
    value: site.hours,
    icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
];

// Tells search engines this is the business's contact page
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${site.name}`,
  url: `${site.url}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
  },
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="Contact"
        title="Let's talk about your next roof"
        text="Questions about reports, pricing or bulk orders? Send us a message and a real person will get back to you, usually within one business day."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <p className="mt-1 text-slate-600">Fields marked * are required.</p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <figure className="relative overflow-hidden rounded-2xl">
              <Image
                src={photos.support.src}
                alt={photos.support.alt}
                placeholder="blur"
                sizes="(min-width: 1024px) 400px, 100vw"
                className="aspect-[4/3] h-auto w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brand-950/90 to-transparent p-5 pt-12 text-sm font-semibold text-white">
                Real people, real answers · {site.hours}
              </figcaption>
            </figure>
            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">Other ways to reach us</h2>
              <ul className="mt-5 space-y-5">
                {contactMethods.map((m) => (
                  <li key={m.label} className="flex gap-4">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-600 text-white">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={m.icon} />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm text-slate-500">{m.label}</p>
                      {m.href ? (
                        <a href={m.href} className="font-medium text-slate-900 hover:text-brand-700">{m.value}</a>
                      ) : (
                        <p className="font-medium text-slate-900">{m.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-brand-950 p-6 text-slate-300">
              <h2 className="text-lg font-semibold text-white">Already a customer?</h2>
              <p className="mt-2 text-sm">
                Log in to track your orders, pay and download your reports any time.
              </p>
              <Link href="/login" className="mt-4 inline-block font-semibold text-accent-400 hover:text-accent-500">
                Go to my dashboard &rarr;
              </Link>
            </div>

            <div className="rounded-2xl p-6 ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">Quick answers</h2>
              <p className="mt-2 text-sm text-slate-600">
                Turnaround times, file formats and accuracy are covered in our FAQ.
              </p>
              <Link href="/faq" className="mt-4 inline-block font-semibold text-brand-700 hover:text-brand-800">
                Read the FAQ &rarr;
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
