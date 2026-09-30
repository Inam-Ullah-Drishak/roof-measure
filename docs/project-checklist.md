# Roof Measure: Project Checklist

Aerial roof measurement service website. Status as of **October 1, 2026**.

✅ = done  ·  ⬜ = still to do  ·  🟡 = done, but uses placeholder content to replace before launch

---

## Summary against the client's scope

| Scope item | Status |
|---|---|
| Service-based website, ~10 pages | ✅ 12 public pages + blog |
| User login / signup and user panel | ✅ |
| Admin panel to manage customers | ✅ (plus orders, team, blog, enquiries, subscribers) |
| Payments / integrations | ✅ Stripe (test mode) |
| Complete SEO | ✅ on-site SEO done · ⬜ Google Search Console after launch |
| Design and branding by us | ✅ design · 🟡 placeholder logo |
| Domain, hosting, SSL, deployment | ⬜ |
| Ongoing maintenance and support | ⬜ after launch |

---

## 1. Public website

### Pages
- ✅ Home
- ✅ Services (Residential, Commercial, Insurance sections)
- ✅ Pricing (pricing cards, price calculator, add-ons, pricing FAQ)
- ✅ How It Works
- ✅ Sample Reports (built-in report preview, report comparison) · 🟡 sample PDF downloads
- ✅ About · 🟡 team members and stats
- ✅ FAQ (23 questions in 5 groups) · 🟡 turnaround, accuracy and refund answers
- ✅ Contact (contact form + contact details)
- ✅ Blog (list, categories, article pages)
- ✅ Privacy Policy · 🟡 company name/address, lawyer review
- ✅ Terms of Service · 🟡 company name/state, lawyer review
- ✅ Custom 404 page

### Home page sections
- ✅ Hero with aerial photo and report stats
- ✅ Stats bar 🟡 (placeholder numbers)
- ✅ "Works with" strip 🟡 (icons; official logos when permission is confirmed)
- ✅ Who we serve (with photos)
- ✅ How it works (3 steps)
- ✅ Why choose us (hand measuring vs. our reports)
- ✅ Pricing
- ✅ Delivery formats
- ✅ Service area 🟡 (all 50 states)
- ✅ Testimonials 🟡 (dummy quotes; replace with real ones)
- ✅ FAQ preview
- ✅ Latest blog posts
- ✅ Call to action

### Site-wide
- ✅ Header with main menu (desktop + animated mobile menu)
- ✅ Footer with links, contact details and newsletter signup
- ✅ Sticky "Order now" bar on mobile
- ✅ 14 professional photos, optimized (WebP, resized per screen, blur while loading)
- ✅ Responsive layout (desktop, tablet, mobile)
- ✅ Accessibility basics (skip link, labels, keyboard focus, reduced motion)

---

## 2. Customer accounts (user panel)

- ✅ Sign up, log in, log out
- ✅ Forgot password / reset password by email
- ✅ Dashboard overview
- ✅ New order form (address, report type, formats, turnaround, detached structures, claim/PO number, instructions, live price)
- ✅ My orders list with status
- ✅ Order details: status, payment, download reports
- ✅ Pay for an order (Stripe checkout) and "Pay now" for unpaid orders
- ✅ Cancel an unpaid order
- ✅ Account settings (profile, change password)
- ✅ Reports can only be downloaded after payment

---

## 3. Admin panel

- ✅ Dashboard: revenue, orders today, customers, new enquiries, orders by status, work queue
- ✅ Orders: list, search, filters (status, payment, assigned to, dates), order details
- ✅ Update order status with history and notes
- ✅ Upload / delete report files (PDF, ESX, XML, DXF, images)
- ✅ Internal notes on orders
- ✅ Assign orders to team members (they get an email)
- ✅ Customers: list, search, details, edit, deactivate/reactivate
- ✅ Enquiries: contact form messages, mark read/replied, delete
- ✅ Team: add employees/admins (email invite), change role, deactivate, resend invite, workload per person
- ✅ Blog: write, edit, publish/unpublish, delete posts (Markdown editor, toolbar, image upload, preview, cover image, SEO fields)
- ✅ Subscribers: newsletter list, search, remove, CSV export
- ✅ Account settings

### Employee role
- ✅ Employees log into the same panel but only see orders assigned to them
- ✅ Employees can start work, upload reports, add notes and complete orders
- ✅ Employees can't cancel orders, reassign, or see customers, enquiries, revenue, team, blog or subscribers

---

## 4. Payments and emails

- ✅ Stripe checkout for orders
- ✅ Stripe webhook + payment check when the customer returns
- ✅ Prices calculated on the server (can't be changed by the customer)
- ✅ Order received email (customer)
- ✅ Payment receipt email (customer) + new paid order alert (admins)
- ✅ Report ready email (customer)
- ✅ Order assigned email (employee)
- ✅ Team invite email
- ✅ Password reset email
- ✅ New contact enquiry email (admins)
- ⬜ Live Stripe keys (currently test mode)
- ⬜ Real email provider (emails print to the console in development)

---

## 5. SEO

- ✅ Unique title, description and canonical URL on every page
- ✅ Social share image and tags (Facebook, LinkedIn, WhatsApp, X)
- ✅ Structured data for Google (services, prices, FAQ, how-to, blog posts, breadcrumbs, organization)
- ✅ sitemap.xml (includes blog posts automatically)
- ✅ robots.txt (blocks admin, dashboard and private pages)
- ✅ Blog with 3 starter articles and per-post SEO settings
- ✅ Fast, optimized images with alt text
- ⬜ Set the real domain (`NEXT_PUBLIC_SITE_URL`)
- ⬜ Submit sitemap to Google Search Console
- ⬜ Google Business Profile (if the client has a physical location)
- ⬜ Analytics (e.g. Google Analytics), then update the Privacy Policy cookie section

---

## 6. Security

- ✅ Passwords encrypted; login sessions in secure cookies
- ✅ Old sessions logged out after a password change
- ✅ Role checks on every admin/employee API request
- ✅ Rate limiting (login, signup, password reset, contact, newsletter, whole API)
- ✅ Spam trap on contact and newsletter forms
- ✅ File upload type and size limits; private report storage
- ✅ Blog content can't inject scripts

---

## 7. Content still needed from the client 🟡

- ⬜ Business name, email, phone, address, hours (`client/src/config/site.js`)
- ⬜ Logo and brand colors
- ⬜ Final prices (keep `site.js` and `server/src/config/pricing.js` in sync)
- ⬜ Turnaround times, accuracy figure, refund policy
- ⬜ Real stats (roofs measured, states, etc.)
- ⬜ Real team members for the About page
- ⬜ Real customer testimonials (with permission)
- ⬜ Sample report PDFs (`client/public/samples/`)
- ⬜ Permission for Xactimate / AutoCAD logos (Stripe badge is allowed)
- ⬜ Legal company name and state; lawyer review of Privacy and Terms

---

## 8. Still to do

### Testing
- ⬜ Full end-to-end test: sign up → order → pay → assign → upload → complete → download
- ⬜ Screenshot review of every page on desktop and mobile
- ⬜ Lighthouse audit (performance, accessibility, SEO) aiming for 90+
- ⬜ Cross-browser check (Chrome, Safari, Firefox, Edge)

### Design polish (optional)
- ⬜ Trim the Home page to fewer sections
- ⬜ Subtle scroll animations
- ⬜ One consistent icon set
- ⬜ Header shrink on scroll + Services dropdown

### Deployment
- ⬜ Production database (MongoDB Atlas)
- ⬜ Own Cloudinary account (currently shared with another project)
- ⬜ Email provider (SMTP) and sending domain
- ⬜ Live Stripe account, keys and webhook
- ⬜ Hosting for the website (Next.js) and the API (Express)
- ⬜ Domain, DNS and SSL
- ⬜ Production environment variables
- ⬜ Create the first admin (`npm run create-admin`) and load blog posts (`npm run seed-posts`)
- ⬜ Backups and uptime monitoring

### After launch
- ⬜ Google Search Console + sitemap
- ⬜ Ongoing maintenance and support
