import { DM_Sans, Bricolage_Grotesque } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { site } from "@/config/site";
import "./globals.css";

const body = DM_Sans({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const heading = Bricolage_Grotesque({ variable: "--font-heading", subsets: ["latin"], display: "swap" });

// Default SEO for every page. Each page sets its own title and description.
export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable}`}>
      <body className="flex min-h-screen flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
