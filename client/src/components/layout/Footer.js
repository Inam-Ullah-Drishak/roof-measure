import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { site } from "@/config/site";

const columns = [
  {
    title: "Services",
    links: [
      { href: "/services#residential", label: "Residential reports" },
      { href: "/services#commercial", label: "Commercial reports" },
      { href: "/services#insurance", label: "Insurance & claims" },
      { href: "/sample-reports", label: "Sample reports" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Create account" },
      { href: "/dashboard", label: "My orders" },
      { href: "/contact", label: "Contact support" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo light />
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">{site.description}</p>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="sr-only">Email</dt>
                <dd><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></dd>
              </div>
              <div className="flex gap-2">
                <dt className="sr-only">Phone</dt>
                <dd><a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">{site.phone}</a></dd>
              </div>
              <div className="text-slate-400">{site.hours}</div>
            </dl>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-sans text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
