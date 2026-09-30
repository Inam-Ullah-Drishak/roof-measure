import { site } from "@/config/site";

// The generated share image (app/opengraph-image.js)
const shareImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` };

// Full SEO metadata for a public page. A page's own openGraph replaces the
// site-wide one completely, so the site name, image etc. are repeated here.
//   export const metadata = pageMetadata({ title, description, path: "/faq", shareTitle })
export function pageMetadata({ title, description, path, shareTitle = `${title} | ${site.name}` }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      title: shareTitle,
      description,
      url: path,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [shareImage.url],
    },
  };
}
