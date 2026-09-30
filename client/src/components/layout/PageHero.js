// Dark banner at the top of each website page
export default function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="relative overflow-hidden bg-brand-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,111,246,0.35),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-accent-400">{eyebrow}</p>}
          <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">{title}</h1>
          {text && <p className="mt-5 text-lg leading-8 text-slate-300">{text}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
