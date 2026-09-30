import Image from "next/image";
import { photos } from "@/assets/images";

// Dark banner at the top of each website page, over an aerial neighborhood photo
export default function PageHero({ eyebrow, title, text, children, image = photos.neighborhood }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover opacity-60"
      />
      {/* Keeps the text readable on any photo */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-950 via-brand-950/85 to-brand-950/40" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,111,246,0.3),transparent_60%)]" />
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
