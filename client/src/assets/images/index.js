// Website photos. Imported (not linked from /public) so Next.js can resize them,
// serve WebP/AVIF, and show a blurred preview while they load.
// Use with next/image:  <Image src={photos.heroRoof.src} alt={photos.heroRoof.alt} placeholder="blur" />
import heroRoof from "./hero-aerial-roof.jpg";
import reportTablet from "./report-tablet.jpg";
import reportLaptop from "./report-laptop.jpg";
import residential from "./service-residential.jpg";
import commercial from "./service-commercial.jpg";
import insurance from "./service-insurance.jpg";
import solar from "./audience-solar.jpg";
import manualMeasuring from "./manual-measuring.jpg";
import drone from "./about-drone.jpg";
import support from "./contact-support.jpg";
import neighborhood from "./hero-neighborhood.jpg";

export const photos = {
  heroRoof: { src: heroRoof, alt: "Aerial top-down view of a suburban house with a complex hip roof" },
  reportTablet: { src: reportTablet, alt: "Tablet on a work truck seat next to a hard hat, tape measure and clipboard" },
  reportLaptop: { src: reportLaptop, alt: "Contractor ordering a roof report on a laptop at the office" },
  residential: { src: residential, alt: "Aerial view of a two-story home with a new shingle roof" },
  commercial: { src: commercial, alt: "Aerial view of a commercial building with a flat white roof and HVAC units" },
  insurance: { src: insurance, alt: "Insurance adjuster with a tablet in front of a storm-damaged roof" },
  solar: { src: solar, alt: "Suburban house roof with solar panels installed" },
  manualMeasuring: { src: manualMeasuring, alt: "Roofer in a safety harness measuring a steep roof by hand" },
  drone: { src: drone, alt: "Drone flying above a neighborhood of rooftops at sunrise" },
  support: { src: support, alt: "Customer support desk with a headset and laptop" },
  neighborhood: { src: neighborhood, alt: "" }, // decorative page-banner background
};
