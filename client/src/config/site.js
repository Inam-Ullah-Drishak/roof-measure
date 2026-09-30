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

// Used on the Privacy Policy and Terms of Service pages.
// PLACEHOLDER: the client's registered business name, state and address. Have a lawyer review both pages.
export const legal = {
  companyName: "Roof Measure LLC",
  state: "Texas",
  address: "123 Example St, Anytown, TX 75001",
  lastUpdated: "September 30, 2026",
};

// PLACEHOLDER: headline numbers shown on the Home and About pages
export const stats = [
  ["10,000+", "Roofs measured"],
  ["24 hr", "Typical turnaround"],
  ["50", "States covered"],
  ["98%", "Customer satisfaction"],
];

// PLACEHOLDER: remove any states the client doesn't cover
export const serviceArea = {
  text: "We measure residential and commercial roofs in all 50 states. If there's aerial imagery of the property, we can measure it.",
  points: ["Homes, commercial buildings and multi-family", "Urban, suburban and rural properties", "Storm-affected areas for insurance claims"],
  states: [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
  ],
};

export const mainNav = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/sample-reports", label: "Sample Reports" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
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
