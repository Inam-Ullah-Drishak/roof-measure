import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/services", label: "Services", text: "Residential, commercial and insurance reports" },
  { href: "/pricing", label: "Pricing", text: "Simple per-report pricing" },
  { href: "/sample-reports", label: "Sample reports", text: "See what's inside a report" },
  { href: "/faq", label: "FAQ", text: "Answers to common questions" },
];

// Shown for any URL that doesn't exist
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <section className="relative overflow-hidden bg-brand-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.35),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
            <p className="font-display text-7xl font-extrabold text-accent-400 sm:text-8xl">404</p>
            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">We couldn&apos;t measure this page</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              The page you&apos;re looking for doesn&apos;t exist or has moved. Check the address, or head somewhere below.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/" variant="accent" size="lg">Back to home</Button>
              <Button href="/contact" variant="light" size="lg">Contact us</Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <ul className="mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block h-full rounded-2xl border border-slate-200 p-5 transition-shadow hover:shadow-lg">
                  <p className="font-semibold text-brand-700">{l.label} &rarr;</p>
                  <p className="mt-1 text-sm text-slate-600">{l.text}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
