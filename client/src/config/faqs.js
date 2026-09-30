import { pricing } from "@/config/site";

// All FAQ questions. Used by the FAQ page and the FAQ preview on the Home page.
// A question with `featured: true` is shown on the Home page.
const fromPrice = Math.min(...pricing.reportTypes.map((r) => r.price));
const rushPrice = pricing.addOns.find((a) => a.id === "rush").price;
const esxPrice = pricing.formats.find((f) => f.id === "esx").price;

// PLACEHOLDER: confirm turnaround times, accuracy and refund policy with the client
export const faqGroups = [
  {
    id: "ordering",
    title: "Ordering",
    faqs: [
      {
        q: "How do I order a roof report?",
        a: "Create a free account, enter the property address, choose your report type, file formats and turnaround, then pay securely online. It takes just a few minutes.",
      },
      {
        q: "Do you need to visit the property?",
        featured: true,
        a: "No. We measure roofs from high-resolution aerial imagery, so nobody needs to go on site or climb onto the roof.",
      },
      {
        q: "Which report type should I choose?",
        a: "Standard suits most homes. Choose Premium for complex roofs with many facets or for insurance claims, and Commercial for flat roofs, large buildings and multi-family properties.",
      },
      {
        q: "Can I add a claim number or PO to my order?",
        a: "Yes. The order form has fields for a claim number and your own reference or PO number, plus a box for special instructions.",
      },
      {
        q: "What if I entered the wrong address?",
        a: "Contact us as soon as possible with your order number. If we haven't started measuring yet, we can correct it for you.",
      },
    ],
  },
  {
    id: "reports",
    title: "Reports & accuracy",
    faqs: [
      {
        q: "What's included in a report?",
        a: "Total roof area and squares, the pitch of every facet, ridge, hip, valley, rake and eave lengths, a labeled roof diagram and a waste factor table. Premium and Commercial reports add more detail.",
      },
      {
        q: "How accurate are the measurements?",
        featured: true,
        a: "Our measurements are typically within 1–2% of hand measurements. Every report is checked by our team before it's delivered.",
      },
      {
        q: "Can you measure detached garages and sheds?",
        a: "Yes. Tick \"detached structures\" when you order and we'll include them in the same report.",
      },
      {
        q: "What if the aerial imagery is unclear, for example because of trees?",
        a: "If we can't measure a roof accurately from the available imagery, we'll contact you before going further. You won't pay for a report we can't deliver.",
      },
      {
        q: "Can I see an example first?",
        a: "Yes. Visit our sample reports page to see what a report looks like.",
        link: { href: "/sample-reports", label: "See sample reports" },
      },
    ],
  },
  {
    id: "delivery",
    title: "Turnaround & delivery",
    faqs: [
      {
        q: "How long does a report take?",
        featured: true,
        a: "Standard reports are usually delivered within 24 hours of payment. Rush orders are usually delivered within a few hours during business hours.",
      },
      {
        q: "How will I know when my report is ready?",
        a: "We email you as soon as it's completed. You can also check the status of every order in your dashboard at any time.",
      },
      {
        q: "Which file formats do you offer?",
        featured: true,
        a: `Every report includes a PDF. You can add ESX for Xactimate (+$${esxPrice}), XML for other estimating software, or DXF for AutoCAD and other CAD tools.`,
      },
      {
        q: "Can I download my report again later?",
        a: "Yes. Your reports stay in your dashboard, so you can download them again whenever you need them.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & payment",
    faqs: [
      {
        q: "How much does a report cost?",
        a: `Reports start at $${fromPrice}. You see the exact price, including any add-ons, before you pay.`,
        link: { href: "/pricing", label: "See full pricing" },
      },
      {
        q: "Is there a subscription?",
        featured: true,
        a: "No. You pay per report, only when you order. Creating an account is free.",
      },
      {
        q: "How do I pay?",
        a: "By card through Stripe's secure checkout. We never see or store your card details.",
      },
      {
        q: "How much is rush delivery?",
        a: `Rush turnaround is +$${rushPrice} per report and moves your order to the front of our queue.`,
      },
      {
        q: "Can I get a refund?",
        a: "If we can't complete your report, you get a full refund. If there's a problem with a delivered report, contact us and we'll correct it or make it right.",
      },
      {
        q: "Do you offer volume discounts?",
        a: "If you order reports regularly, contact us and we'll talk about pricing that works for your business.",
      },
    ],
  },
  {
    id: "account",
    title: "Your account",
    faqs: [
      {
        q: "Do I need an account to order?",
        a: "Yes. A free account lets you track your orders, pay, and download your reports any time.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "Use the \"Forgot password\" link on the login page and we'll email you a link to choose a new one.",
        link: { href: "/forgot-password", label: "Reset your password" },
      },
      {
        q: "Can I cancel an order?",
        a: "You can cancel an unpaid order from your dashboard. For a paid order, contact us before we start measuring.",
      },
    ],
  },
];

// Top questions for the Home page
export const featuredFaqs = faqGroups.flatMap((g) => g.faqs).filter((f) => f.featured);
