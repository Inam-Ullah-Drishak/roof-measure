import Link from "next/link";
import LegalPage from "@/components/marketing/LegalPage";
import { site, legal } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: `The terms that apply when you use the ${site.name} website and order aerial roof measurement reports.`,
  path: "/terms",
  shareTitle: `Terms of Service | ${site.name}`,
});

// Keep the cancellation and refund rules in line with the FAQ page and the
// server (customers can cancel their own order only while it's unpaid).
const sections = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    content: (
      <>
        <p>
          These terms are an agreement between you and <strong>{legal.companyName}</strong> (&quot;{site.name}&quot;, &quot;we&quot;, &quot;us&quot;).
          By creating an account or ordering a report, you agree to them. If you order on behalf of a company, you confirm
          you&apos;re allowed to accept these terms for it.
        </p>
        <p>
          Please also read our <Link href="/privacy">Privacy Policy</Link>, which explains how we handle your information.
        </p>
      </>
    ),
  },
  {
    id: "service",
    title: "Our service",
    content: (
      <p>
        We provide roof measurement reports created from aerial imagery. Each report includes the measurements and files
        described for the report type and options you choose when you order. See our <Link href="/services">services</Link> and{" "}
        <Link href="/sample-reports">sample reports</Link> pages for details.
      </p>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    content: (
      <ul>
        <li>You must be at least 18 and give us accurate information.</li>
        <li>Keep your password safe. You&apos;re responsible for orders placed from your account.</li>
        <li>Tell us straight away if you think someone else has accessed your account.</li>
        <li>We may suspend or close accounts that break these terms or are used for fraud.</li>
      </ul>
    ),
  },
  {
    id: "orders",
    title: "Placing orders",
    content: (
      <>
        <p>
          You are responsible for entering the correct property address and choosing the right report type and options.
          Use the special instructions box to point out the right building if there is more than one on the property.
        </p>
        <p>
          Your order is accepted once payment is confirmed. We may decline an order, for example if we can&apos;t get usable
          imagery for the property. If that happens, you won&apos;t be charged, or we&apos;ll refund you in full.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Prices and payment",
    content: (
      <>
        <p>
          Prices are shown on our <Link href="/pricing">pricing page</Link> and in full before you pay. All prices are in US dollars.
          We may change our prices, but a change never affects an order you&apos;ve already paid for.
        </p>
        <p>
          Payments are processed securely by Stripe. By paying, you also agree to Stripe&apos;s terms. You&apos;re responsible
          for any taxes that apply to your purchase.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Turnaround and delivery",
    content: (
      <p>
        Reports are delivered to your online dashboard and we email you when they&apos;re ready. Turnaround times, including
        rush turnaround, are estimates, not guarantees. Delays can happen, for example because of imagery availability or
        high demand. If your order is delayed significantly, we&apos;ll let you know.
      </p>
    ),
  },
  {
    id: "cancellations",
    title: "Cancellations and refunds",
    content: (
      <ul>
        <li>You can cancel an unpaid order at any time from your dashboard.</li>
        <li>To cancel a paid order, contact us before we start measuring and we&apos;ll refund you in full.</li>
        <li>If we can&apos;t complete your report, we&apos;ll refund you in full.</li>
        <li>
          If you think a delivered report is wrong, contact us within 30 days. We&apos;ll review it and correct it at no cost,
          or refund you if we can&apos;t fix it.
        </li>
        <li>We don&apos;t refund reports that were completed correctly for the address and options you ordered.</li>
      </ul>
    ),
  },
  {
    id: "accuracy",
    title: "Accuracy of reports",
    content: (
      <>
        <p>
          We work hard to make every report accurate, and every report is checked before delivery. However, measurements
          made from aerial imagery can be affected by things like image quality, trees, shadows, recent changes to the
          building, and features that can&apos;t be seen from above.
        </p>
        <p>
          Our reports are a tool to help you estimate. <strong>You are responsible for checking measurements before relying on
          them</strong>, for example before ordering materials or finalizing a quote, and for any decisions you make based on them.
        </p>
      </>
    ),
  },
  {
    id: "use-of-reports",
    title: "Using your reports",
    content: (
      <>
        <p>
          Once you&apos;ve paid, you may use your reports for your own business, including sharing them with your customers,
          insurance companies and suppliers for the property they cover.
        </p>
        <p>
          You may not resell our reports as a measurement service, remove our branding, or copy our website, reports or
          software. We keep all rights to our website, report designs and branding.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>When using our website, you agree not to:</p>
        <ul>
          <li>Break the law or use our service for fraud.</li>
          <li>Try to access other users&apos; accounts, orders or reports.</li>
          <li>Interfere with the website&apos;s security or overload it, for example with automated requests.</li>
          <li>Upload or send anything harmful, such as viruses.</li>
        </ul>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>
          Our service is provided &quot;as is&quot;. To the maximum extent the law allows, we are not liable for indirect or
          consequential losses, such as lost profits, lost jobs, or the cost of materials ordered based on a report.
        </p>
        <p>
          Our total liability for any claim relating to a report is limited to the amount you paid for that report.
          Nothing in these terms limits liability that can&apos;t be limited by law.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    content: (
      <p>
        These terms are governed by the laws of the State of {legal.state}, United States. Any dispute will be handled by the
        courts of {legal.state}, unless the law where you live says otherwise. Before starting any claim, please contact us
        so we can try to resolve it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        We may update these terms from time to time. We&apos;ll change the &quot;last updated&quot; date at the top of this page, and for
        important changes we&apos;ll let you know by email. The terms in place when you place an order apply to that order.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <p>
        Questions about these terms? Email <a href={`mailto:${site.email}`}>{site.email}</a>, call {site.phone}, or use
        our <Link href="/contact">contact form</Link>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="The rules for using our website and ordering roof measurement reports, written in plain English."
      sections={sections}
    />
  );
}
