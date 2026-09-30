// Business details used across the whole website.
// Replace the placeholders once the client confirms their details.
export const site = {
  name: "Roof Measure",
  tagline: "Aerial Roof Measurement Reports",
  description:
    "Accurate aerial roof measurement reports for roofing contractors, insurance adjusters and solar installers. Order online, get a detailed report fast, in PDF, ESX, XML or DXF.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "support@example.com",
  phone: "+1 (555) 000-0000",
  address: "United States",
  hours: "Mon–Fri, 8am–6pm",
};

export const mainNav = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/sample-reports", label: "Sample Reports" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Keep in sync with server/src/config/pricing.js (the server is the source of truth
// for what customers are charged; these are only for display).
export const pricing = {
  reportTypes: [
    {
      id: "standard",
      name: "Standard",
      price: 25,
      audience: "Residential roofs",
      features: [
        "Total roof area and number of squares",
        "Pitch for every roof facet",
        "Ridge, hip, valley, rake and eave lengths",
        "Labeled roof diagram",
        "Waste factor table",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 40,
      audience: "Complex residential roofs",
      popular: true,
      features: [
        "Everything in Standard",
        "Detailed facet-by-facet diagrams",
        "Flashing and step-flashing lengths",
        "Penetration count and locations",
        "Ideal for insurance claims",
      ],
    },
    {
      id: "commercial",
      name: "Commercial",
      price: 75,
      audience: "Commercial & multi-family",
      features: [
        "Large and flat roof measurements",
        "Parapet wall lengths",
        "Multiple structures on one report",
        "Detailed section breakdown",
        "Priority support",
      ],
    },
  ],
  addOns: [
    { id: "rush", name: "Rush turnaround", price: 15 },
    { id: "detachedStructures", name: "Detached structures (garage, shed)", price: 10 },
  ],
  formats: [
    { id: "pdf", name: "PDF report", price: 0, note: "Always included" },
    { id: "esx", name: "ESX (Xactimate)", price: 10 },
    { id: "xml", name: "XML", price: 5 },
    { id: "dxf", name: "DXF (CAD)", price: 5 },
  ],
};
