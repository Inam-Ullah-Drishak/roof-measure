// "Works with" strip: the software our files open in.
// Product names are shown as plain text (not logos), which doesn't need the
// companies' permission. Only list tools our formats really support.
const tools = [
  { name: "Xactimate", via: "ESX file" },
  { name: "AutoCAD & CAD tools", via: "DXF file" },
  { name: "Estimating software", via: "XML file" },
  { name: "Any device", via: "PDF report" },
  { name: "Stripe", via: "Secure payments" },
];

export default function WorksWith({ className = "" }) {
  return (
    <section className={`border-b border-slate-200 bg-slate-50 ${className}`} aria-labelledby="works-with">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <h2 id="works-with" className="font-sans text-sm font-semibold uppercase tracking-wider text-slate-500">
          Works with
        </h2>
        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {tools.map((t) => (
            <li key={t.name} className="text-center lg:text-left">
              <p className="font-display text-lg font-bold text-slate-700">{t.name}</p>
              <p className="text-xs text-slate-500">{t.via}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
