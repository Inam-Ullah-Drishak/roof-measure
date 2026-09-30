import Link from "next/link";
import LegalPage from "@/components/marketing/LegalPage";
import { site, legal } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects your personal information when you use our website and order roof measurement reports.`,
  path: "/privacy",
  shareTitle: `Privacy Policy | ${site.name}`,
});

// Written to match what the site actually does (account data, orders, Stripe,
// email, file storage, one login cookie, no analytics). Update it if that changes.
const sections = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          This website is operated by <strong>{legal.companyName}</strong> (&quot;{site.name}&quot;, &quot;we&quot;, &quot;us&quot;), {legal.address}.
          We provide aerial roof measurement reports.
        </p>
        <p>
          This policy explains what personal information we collect, why we collect it, and the choices you have.
          If you have questions, contact us at <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: (
      <>
        <p>We only collect the information we need to provide our service:</p>
        <ul>
          <li><strong>Account details:</strong> your name, email address, password (stored encrypted, never in plain text), and optionally your phone number and company name.</li>
          <li><strong>Order details:</strong> the property address, report type, file formats, turnaround, claim or reference numbers, and any special instructions you give us.</li>
          <li><strong>Payment details:</strong> payments are handled by Stripe. We receive confirmation that you paid and a payment reference, but we never see or store your full card number.</li>
          <li><strong>Messages:</strong> the name, email, phone number and message you send through our contact form or by email.</li>
          <li><strong>Technical information:</strong> your IP address and basic request information, used to keep the site secure and prevent abuse.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    content: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Measure the properties you order reports for and deliver your reports.</li>
          <li>Process payments and keep records of your orders.</li>
          <li>Send you emails about your orders, such as order confirmations, payment receipts and &quot;report ready&quot; notices, and password reset links.</li>
          <li>Answer your questions and provide support.</li>
          <li>Keep our website secure, prevent fraud and meet our legal obligations.</li>
        </ul>
        <p>We do not sell your personal information, and we do not use it for third-party advertising.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    content: (
      <>
        <p>We share information only with trusted service providers that help us run our service, and only as much as they need:</p>
        <ul>
          <li><strong>Stripe</strong> to process card payments.</li>
          <li><strong>Our email provider</strong> to send account and order emails.</li>
          <li><strong>Our hosting and file storage providers</strong> to run the website and securely store your reports.</li>
          <li><strong>Aerial imagery providers</strong> may receive the property address so we can obtain imagery to measure the roof.</li>
        </ul>
        <p>
          We may also share information if required by law, to protect our rights, or as part of a sale or merger of our business.
          In that case, your information would remain protected by this policy.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p>
          We use a single essential cookie to keep you logged in. It is secure, can&apos;t be read by other websites, and expires
          after 7 days or when you log out. The site can&apos;t work properly without it, so there is no option to turn it off.
        </p>
        <p>We do not use advertising or tracking cookies.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    content: (
      <>
        <p>
          We keep your account and order history for as long as your account is open, so you can download your reports again.
          We keep order and payment records for as long as the law requires for tax and accounting purposes.
          Contact form messages are kept for as long as needed to answer them.
        </p>
        <p>If you close your account, we delete or anonymize your personal information unless we need to keep it by law.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    content: (
      <p>
        We use HTTPS encryption across the whole site, store passwords encrypted, limit access to your information to the
        people who need it to do their job, and only let you download your reports after you log in. No system is completely
        secure, but we work hard to protect your information.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your choices and rights",
    content: (
      <>
        <p>You can update your name, phone number, company and password at any time from your account settings. You can also ask us to:</p>
        <ul>
          <li>Send you a copy of the personal information we hold about you.</li>
          <li>Correct information that is wrong.</li>
          <li>Delete your account and personal information.</li>
        </ul>
        <p>
          Depending on where you live, for example California, you may have additional rights under local law.
          To make a request, email <a href={`mailto:${site.email}`}>{site.email}</a>. We will respond within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: <p>Our service is for businesses and adults. We do not knowingly collect information from anyone under 18.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. When we do, we&apos;ll change the &quot;last updated&quot; date at the top of this page,
        and for important changes we&apos;ll let you know by email.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <p>
        Questions about your privacy? Email <a href={`mailto:${site.email}`}>{site.email}</a>, call {site.phone}, or use
        our <Link href="/contact">contact form</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="We respect your privacy. This page explains what information we collect, how we use it, and your choices."
      sections={sections}
    />
  );
}
