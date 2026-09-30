import Logo from "@/components/ui/Logo";
import RoofDiagram from "@/components/home/RoofDiagram";

// Login/signup pages aren't useful search results
export const metadata = {
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-8 sm:px-10 lg:px-16">
        <Logo />
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>

      <aside className="relative hidden overflow-hidden bg-brand-950 lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,111,246,0.35),transparent_60%)]" />
        <div className="relative">
          <RoofDiagram className="h-auto w-full max-w-lg" />
          <h2 className="mt-10 text-3xl font-bold text-white">Accurate roof reports, ordered in minutes</h2>
          <p className="mt-4 max-w-md text-lg text-slate-300">
            Track your orders, pay securely and download every report from one dashboard.
          </p>
        </div>
      </aside>
    </div>
  );
}
