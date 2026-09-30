// "Works with" strip: the software our files open in.
//
// Each item shows an icon tile. To show a company's official logo instead, put the
// file in client/public/logos/ and set `logo` (e.g. logo: "/logos/stripe.svg").
// Only use official logos you're allowed to use (check each brand's guidelines;
// Stripe publishes badges for this, others may need permission).
const tools = [
  {
    name: "Xactimate",
    via: "ESX file",
    logo: "",
    color: "bg-red-50 text-red-600 ring-red-100",
    icon: "M4 20V10l8-6 8 6v10H4Zm5 0v-5h6v5M9 11h6",
  },
  {
    name: "AutoCAD & CAD tools",
    via: "DXF file",
    logo: "",
    color: "bg-sky-50 text-sky-600 ring-sky-100",
    icon: "M12 3v3m0 0-6 14m6-14 6 14M8 15h8M12 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  },
  {
    name: "Estimating software",
    via: "XML file",
    logo: "",
    color: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    icon: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 4h8v3H8V7Zm0 7h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01M16 17h.01",
  },
  {
    name: "Any device",
    via: "PDF report",
    logo: "",
    color: "bg-amber-50 text-amber-600 ring-amber-100",
    icon: "M3 6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v8H3V6Zm-1 8h15M18 9h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm1.5 8h.01",
  },
  {
    name: "Stripe",
    via: "Secure payments",
    logo: "",
    color: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    icon: "M6 10V8a6 6 0 1 1 12 0v2M5 10h14v11H5V10Zm7 4v3",
  },
];

export default function WorksWith({ className = "" }) {
  return (
    <section className={`border-b border-slate-200 bg-slate-50 ${className}`} aria-labelledby="works-with">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:justify-between lg:gap-10 lg:px-8">
        <h2 id="works-with" className="flex-none font-sans text-sm font-semibold uppercase tracking-wider text-slate-500">
          Works with
        </h2>
        <ul className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:w-auto lg:flex-wrap lg:justify-end lg:gap-8">
          {tools.map((t) => (
            <li key={t.name} className="flex items-center gap-3">
              {t.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- small static logo files
                <img src={t.logo} alt={`${t.name} logo`} className="h-10 w-auto max-w-28 flex-none object-contain" />
              ) : (
                <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ring-1 ${t.color}`} aria-hidden="true">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.icon} />
                  </svg>
                </span>
              )}
              <div className="min-w-0">
                <p className="font-display font-bold leading-tight text-slate-800">{t.name}</p>
                <p className="text-xs text-slate-500">{t.via}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
