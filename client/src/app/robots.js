import { site } from "@/config/site";

// Public pages can be crawled; private areas and one-time links can't.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/reset-password", "/forgot-password", "/api"],
    },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
