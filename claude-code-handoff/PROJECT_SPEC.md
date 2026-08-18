# Excellence Medical Care (EMC) — Website Rebuild
## Build Specification for Claude Code

Status: Ready for implementation
Owner: Muaz (EMC digital project)
Supersedes: the two ChatGPT-generated briefs previously drafted (kept for reference in `/reference/`)

---

## 0. How to use this document

This is the single source of truth for the build. It replaces the two earlier prompt documents, which contradicted each other in places (e.g. page architecture, CMS approach, whether to show client logos) and left several technical decisions open. Every decision that was ambiguous before has been resolved below — do not re-derive tech stack or IA choices from the original briefs.

Read in this order:
1. Section 2 (verified facts) before writing any copy — it tells you what's real and what's a placeholder.
2. Section 4 (tech stack) and Section 5 (folder structure) before scaffolding the repo.
3. Section 7 (sitemap) and Section 8 (data models) before building any page.
4. Section 16 (build phases) to sequence the work — build in that order, not all at once.

If something in this spec is genuinely ambiguous, make the most defensible decision, note it in a `DECISIONS.md` file at the repo root, and continue. Do not stop to ask unless a legal/compliance claim is at stake (see Section 18).

---

## 1. Project summary

Excellence Medical Care Ltd. (EMC) is a Dammam-based healthcare technology and medical solutions company, currently operating under the live site `tamiozmed.com`. This project is a full redesign and rebuild — new information architecture, new visual system evolved from the existing brand mark, new copy, and a modern codebase. It is not a reskin.

**Positioning shift.** The current site reads as a regional distributor with a supplier-logo grid. The new site should read as a healthcare technology partner: an organization that brings global medical technologies to Saudi and Gulf healthcare providers along with the clinical training, technical support, regulatory knowledge, and after-sales service that make those technologies safe and effective in practice. Avoid the phrase "medical distributor." Prefer framing like "healthcare technology and medical solutions partner."

**Primary business goal.** The site is a lead-generation and credibility asset, not e-commerce. Every product and solution page should end in a path to a human conversation (Request a Demo, Request a Quotation, Speak with a Specialist) — never a cart or checkout.

**Audience.** Ministry of Health and NUPCO procurement contacts, government/military/university/private hospital administrators, biomedical engineers, ICU and anesthesia consultants, ENT surgeons, procurement managers, hospital CEOs. Copy should be written for a credentialed technical buyer, not a consumer — confident, precise, evidence-oriented, never salesy.

**Visual bar.** Medtronic, Stryker, GE Healthcare, Philips Healthcare, Karl Storz, Dräger — large editorial photography, generous white space, restrained motion, a color system that uses brand purple and teal as accents rather than backgrounds.

---

## 2. Verified facts vs. placeholders — read before writing copy

This is the most important section. The original briefs told the AI not to invent statistics, certifications, or client claims, but didn't separate what's actually known from what still needs to come from EMC. That separation is done here, based on the live `tamiozmed.com` site and the internal `UE Product Presentation_EMC V3.pdf`.

### 2.1 Verified — safe to use as-is

| Fact | Value | Source |
|---|---|---|
| Legal name | Excellence Medical Care Ltd. (EMC) | live site footer, PDF |
| Trading/site brand | Tamioz / TamiozMed | live site |
| Established | 2013 | live site, PDF |
| Headquarters | Dammam, Saudi Arabia — PO Box 9397, King Fahd Road | live site |
| Phone | +966 13 833 5536 | live site |
| Email | info@tamiozmed.com | live site |
| Social | X/Twitter @tamiozmed, Instagram @tamiozmed1 (no LinkedIn currently — create one before launch if possible) | live site |
| CEO | Moosa Almoosa, founder and CEO | live site |
| Vision | "To inspire a healthier future by being the leading provider of innovative healthcare solutions across Saudi Arabia and the Gulf Region." | matches verbatim in both live-adjacent brief and internal PDF — confirmed |
| Mission | "Driven by excellence and innovation, we partner with healthcare providers to deliver world-class medical technologies that create safer procedures, greater clinical confidence, and better patient care." | confirmed in PDF |
| Values | Innovation, Quality, Integrity, Customer Success, Patient First | confirmed in PDF (note: differs from the 3 values — Innovation, Compassion, Integrity — currently live on tamiozmed.com; use the PDF's 5-value set, it is the more recent internal document) |
| Current clinical/service areas | Anesthesia, Orthopedic, Infection Control | live site nav |
| Current partners | UE Medical, OXY'PHARM, Long Life Surgical Industries, BeneCare Medical, Ortholand | live site |

**Current partner detail (verified from live site):**
- **UE Medical** (China) — video laryngoscopes, promoting a new standard in airway management and intubation.
- **OXY'PHARM** — est. 2003, biodegradable devices/products for automated surface disinfection and disinsectisation; eco-friendly nosocomial infection control.
- **Long Life Surgical Industries** — est. 1981, manufactures laryngoscopes and surgical instruments, ISO-13485.
- **BeneCare Medical** — est. 2001 (UK), casting materials, orthopedic footwear, upper/lower limb orthotics, low-temperature thermoplastics.
- **Ortholand** — orthopedic supports, designed for maximum usability, competitively priced.

**UE Medical — verified from internal presentation PDF (use for the UE Medical partner page and Airway Management solution page):**
- Founded 2010, headquartered in Xianju, Zhejiang, China.
- 580+ employees worldwide; serving 70+ countries and regions; 11,000+ hospitals worldwide use UE Medical products.
- Cooperates with 80% of top-tier hospitals in China.
- 2 service centers, 3 sales centers, 4 R&D centers, 150+ R&D engineers worldwide.
- Recognized as a top-3 single-use video laryngoscope brand in U.S. emergency medicine (per internal deck — attribute as "per UE Medical corporate materials," do not present as an independent EMC claim).
- **Product platform:** UE Integrated Airway Management Platform — one monitor compatible across the UE product range, split-screen multi-product display, 64GB onboard storage for data/photo/video capture supporting teaching and clinical traceability, integrated trolley for device/consumable storage, in-hospital and out-of-hospital use.
- **UEScope Video Laryngoscope** — models referenced: UED-A, UED-C, UED-D (platform deck) and VL300/VL310 reusable video laryngoscope (current site: 60° angle of view, 5 blade sizes, all-angle adjustable monitor, photo/video capture on VL310, 2-year warranty, SFDA and MDNR certified — attribute certification to this specific product, not company-wide).
- **SaCoVLM Video Laryngeal Mask** — flexible visual stylet, dual ventral/dorsal cuff, gastric tube channel, cleaning channel, pre-molded arc connector.
- **Flexible Bronchoscope** — single-use and reusable variants, compatible with the shared UE monitor.

**Existing hospital/client logos** currently displayed on the live site (KKESH, Kingdom Hospital, King Fahd Medical City, KFSHRC, NUPCO, Mowasat, KSMC, KKUH, Magrabi, SFH, RCH, PSMMC, PMBAAH, Obeid Specialist Hospital, Dr. Sulaiman Al Habib, Dallah, and ~15 more): these are real and currently public on `tamiozmed.com`. Reuse is reasonable since they're already published, but **confirm with EMC before go-live** that permissions are still current — don't silently drop them, and don't silently expand the list. Build the logo grid as CMS-driven content so this is a one-line addition, not a redesign.

### 2.2 Not yet verified — must render as CMS placeholders, never invented text

- Exact "years of experience," "products," "suppliers/partners" counts for homepage stat counters — the live site shows animated counters with no confirmed end values. Ship these as an editable `stats.json` with a clear `"verified": false` flag and a visible `[STAT PENDING]` state in the CMS admin (not on the public site — see Section 8.6).
- Any awards, exclusive distributorship claims, government contract names, ISO/SFDA certificates beyond the one already confirmed for the VL300/VL310, and customer testimonials/quotes. None of these exist in source material. Do not write placeholder testimonials with fake names — build the testimonials section so it renders nothing (or a "coming soon" state) until real content is supplied, rather than shipping fabricated quotes.
- New solution areas implied by the redesign brief (Critical Care, Respiratory Care) beyond what UE Medical's airway platform already substantiates — these are legitimate business-unit categories to scaffold in the IA, but do not write clinical claims or product listings under them until EMC supplies products. An empty, well-designed "more solutions coming soon" state is correct; a fabricated product list is not.

---

## 3. Positioning & voice

- Lead with outcomes for clinicians and patients, not product specs. Specs come after the pitch, not instead of it.
- Write like a technical peer, not a copywriter performing enthusiasm. Avoid "revolutionary," "cutting-edge," "world-class" used as filler — earn premium language with specificity (numbers, named technologies, named clinical use cases) wherever verified facts support it.
- Never say "we sell." Say what EMC helps clinicians and hospitals do.
- Every claim of fact (certification, statistic, distributorship status) must trace to Section 2.1 or a CMS field explicitly marked as EMC-supplied. Nothing else.
- Bilingual content is two native drafts, not one translated. Arabic medical terminology should read like it was written by someone who works in a Saudi hospital, not machine-translated.

---

## 4. Tech stack (decided — do not re-litigate)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15 (App Router)**, TypeScript, React Server Components | SSR/SSG for SEO; route handlers for forms |
| Styling | **Tailwind CSS v4** | utility-first, fast to theme from design tokens in Section 6 |
| Component primitives | **shadcn/ui** (Radix-based) | accessible dialog, tabs, accordion, form, combobox — use for Request Demo modal, product filters, FAQ, mega menu |
| Animation | **Framer Motion** | page transitions, scroll reveals, hover/micro-interactions — keep restrained, no gratuitous motion (see Section 13) |
| Icons | **Lucide React** | do not mix icon sets |
| i18n / RTL | **next-intl** | full route-based locales `/en/...` and `/ar/...`; see Section 10 |
| Content | **Local, typed content collections** (`/content/**/*.json` + Zod schemas) for Phase 1 — see Section 4.1 | avoids blocking the build on external CMS account setup |
| Forms backend | **Next.js Route Handlers + Zod validation + Resend** for email delivery of leads (Section 11) | swap/extend to CRM webhook in Phase 2 |
| Images | `next/image`, media stored in `/public/media` (Phase 1) with a documented path to a DAM/CDN later | |
| Deployment | **Vercel** | preview deployments per PR; production on custom domain |
| Testing | Playwright for critical flows (nav, language switch, demo form submit), axe-core for accessibility checks in CI | |

### 4.1 Why not a hosted CMS on day one

The brief calls for non-developer content editing (products, partners, news, jobs). A hosted headless CMS (Sanity is the recommended target — best-in-class Next.js integration, strong image pipeline, generous free tier) is the right long-term answer, but it requires EMC/Muaz to create an account and hand back API credentials, which would stall the build.

**Resolution:** build the entire content layer as strongly-typed local JSON files validated by Zod schemas that are *deliberately shaped to match what the Sanity schema would look like*. Every page component reads from these typed content functions (`getProduct(slug)`, `getPartners()`, etc.) — never inline copy in JSX. When Sanity is connected later, only the data-fetching functions change; components, routing, and types stay untouched. Document this migration path explicitly in `/content/README.md`.

---

## 5. Repository & folder structure

```
emc-website/
├── DECISIONS.md                 # log of any judgment calls made during build
├── content/
│   ├── README.md                # explains schema + future CMS migration path
│   ├── schemas/                 # Zod schemas — see Section 8
│   ├── solutions/*.json
│   ├── products/*.json
│   ├── partners/*.json
│   ├── news/*.json
│   ├── case-studies/*.json
│   ├── jobs/*.json
│   ├── team/*.json
│   ├── testimonials/*.json      # empty array until EMC supplies real quotes
│   └── stats.json                # includes "verified": boolean per stat
├── messages/
│   ├── en.json                  # next-intl translation strings (UI chrome, not content)
│   └── ar.json
├── public/
│   ├── media/
│   │   ├── logo/                # brand assets, see Section 6.5
│   │   ├── products/
│   │   ├── partners/
│   │   └── team/
│   └── downloads/                # brochures, catalogs, IFUs
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                      # home
│   │   │   ├── about/
│   │   │   ├── solutions/[slug]/
│   │   │   ├── products/[slug]/
│   │   │   ├── partners/[slug]/
│   │   │   ├── why-emc/
│   │   │   ├── services/
│   │   │   ├── knowledge-center/[slug]/
│   │   │   ├── careers/[slug]/
│   │   │   ├── contact/
│   │   │   ├── privacy-policy/
│   │   │   ├── terms-of-use/
│   │   │   └── cookie-policy/
│   │   └── api/
│   │       ├── leads/demo-request/route.ts
│   │       ├── leads/quote-request/route.ts
│   │       ├── leads/contact/route.ts
│   │       └── careers/apply/route.ts
│   ├── components/
│   │   ├── ui/                   # shadcn primitives
│   │   ├── layout/                # header, mega-menu, footer, sticky-nav, whatsapp-fab, back-to-top
│   │   ├── sections/               # hero, stats-band, solutions-grid, partner-grid, testimonials, cta-band
│   │   └── product/                # product-hero, spec-table, related-products, demo-modal
│   ├── lib/
│   │   ├── content.ts              # typed getters over /content
│   │   ├── seo.ts                  # metadata + JSON-LD builders
│   │   └── validations/            # Zod schemas for forms
│   └── i18n/
├── tests/
└── ...config files
```

---

## 6. Brand system

The existing Arabic mark (deep purple circular badge, white Arabic wordmark over a teal Arabic wordmark) is supplied as `EMC LOGO.png` in `/reference/brand/`. **Do not redraw, re-letter, or distort it.** It is currently raster-only (356×349px) — flag to EMC that a vector (AI/EPS/SVG) source file is needed for crisp use at large hero sizes and favicon scales; until supplied, use the raster at capped display sizes and rebuild only the favicon/app-icon as a simplified vector treatment.

### 6.1 Color tokens (extracted from the supplied logo file)

```css
--emc-purple-900:  #2A0C31;  /* darkest shade, deep backgrounds, footer */
--emc-purple-700:  #36103E;  /* primary brand purple — from logo */
--emc-purple-500:  #5A2568;  /* mid accent, hover states */
--emc-teal-600:    #2E948C;  /* secondary brand teal — from logo */
--emc-teal-400:    #4FBDB3;  /* lighter teal accent, links, icons */
--emc-teal-100:    #E6F5F3;  /* very light teal — section backgrounds */
--emc-navy-900:    #0B1B2B;  /* midnight navy — supporting dark, not purple */
--emc-white:       #FFFFFF;
--emc-gray-50:     #F7F8FA;
--emc-gray-200:    #E3E6EA;
--emc-gray-600:    #5B6470;  /* body text on white */
--emc-gray-900:    #14181D;  /* headings */
```

**Usage rule:** white and soft gray are the dominant surface colors (70%+ of any screen). Purple and teal are accents — section eyebrows, icons, CTA buttons, hover states, chart/data highlights, the mega-menu active state. Never fill a full-viewport hero background with flat purple; use it in gradients, editorial color blocks, or as a duotone overlay on photography instead. Midnight navy, not purple, is the dark mode / footer base.

### 6.2 Typography

- **English:** Manrope (headings, 600–800 weight) paired with Inter (body, 400–500 weight). Both on Google Fonts, both have strong multilingual number sets.
- **Arabic:** IBM Plex Sans Arabic for both headings and body (has the weight range to pair with Manrope's boldness and reads as technical/premium rather than decorative). Do not default to a generic system Arabic font.
- Numbers and technical specifications (model numbers, measurements) stay LTR even inside RTL paragraphs — use `dir="ltr"` spans, per Section 10.

### 6.3 Components to build into the shared library

Buttons (primary/secondary/ghost, each with a loading state), cards (solution card, product card, partner card, article card — all with consistent hover lift + shadow, not per-page one-offs), badges (e.g. "New," "SFDA Registered" — only rendered when a CMS field confirms it), stat counter (animates on scroll into view, respects `prefers-reduced-motion`), tabs (used on product detail pages), accordion (FAQ, spec tables on mobile), breadcrumb, mega-menu, sticky header that condenses on scroll, floating WhatsApp button, back-to-top button, toast/confirmation for form submission.

### 6.4 Motion principles

Subtle and purposeful: fade/slide-up on scroll reveal (staggered for card grids), smooth 200–300ms hover transitions, no parallax gimmicks, no auto-playing carousels without pause controls. Respect `prefers-reduced-motion` everywhere Framer Motion is used.

### 6.5 Logo asset delivery

Copy the supplied `EMC LOGO.png` into `/reference/brand/emc-logo-original.png` (source of truth, untouched) and generate from it: a padded square export for favicon/app-icon build (16/32/180/512px), and a "safe space" guideline (clear space = height of the badge's own radius on all sides, minimum display size 40px height). Do not generate a "white/reversed" or "monochrome" version by manipulating this raster aggressively — note in `DECISIONS.md` that those variants require the vector source and are a follow-up with EMC's brand owner.

---

## 7. Information architecture / sitemap

Primary navigation (mega menu where noted), mirrored under `/en/...` and `/ar/...`:

```
Home
Solutions (mega menu)
  ├── Airway Management
  ├── Anesthesia
  ├── Critical Care          [scaffold only until EMC supplies content — see 2.2]
  ├── Respiratory Care       [scaffold only until EMC supplies content — see 2.2]
  ├── Orthopedics
  └── Infection Control
Products
  ├── Browse All Products (filter by Solution / Manufacturer / Clinical Application)
  └── /products/[slug] (detail pages, not in nav)
Partners (mega menu)
  ├── UE Medical
  ├── OXY'PHARM
  ├── Long Life Surgical Industries
  ├── BeneCare Medical
  └── Ortholand
Why EMC
Services
Knowledge Center
  ├── Clinical Articles / Case Studies / White Papers / News / Events / Workshops (filterable single index, not six separate top-level pages)
About Us
Careers
Contact
```

Footer additionally links: Privacy Policy, Terms of Use, Cookie Policy, sitemap, social icons, WhatsApp, language switcher.

**Resolved conflict:** the two source briefs disagreed on structure — one wanted "Our Solutions" as a flat set of six pages each with product cards mixed in, the other correctly separated Solutions (clinical categories) from Products (browsable catalog) from Partners (manufacturers). This spec follows the second, cleaner model. Solutions pages describe the clinical problem and link out to relevant products and the responsible partner; they do not themselves list full specs.

Global chrome: sticky header with mega-menu, search (product + content search, client-side fuse.js index is sufficient at this content scale — no need for a search service), language switcher (EN/AR), primary CTA button ("Request a Demo") always visible in header, floating WhatsApp button, back-to-top button, breadcrumbs on every page except home.

---

## 8. Content data models

Define these as Zod schemas in `content/schemas/` and generate TypeScript types from them (`z.infer`). Every field below marked **(EMC)** must come from a real EMC-supplied value — leave it optional/undefined rather than fabricating a default.

### 8.1 Solution
`slug, name{en,ar}, shortDescription{en,ar}, heroImage, clinicalOverview{en,ar}, relatedProductSlugs[], relatedPartnerSlugs[], icon`

### 8.2 Partner
`slug, name, logo, country, foundedYear (EMC), summary{en,ar}, technologyExpertise{en,ar}, relationshipStatement{en,ar} (must not claim exclusivity unless EMC confirms — default copy: "Represented in Saudi Arabia by Excellence Medical Care."), clinicalAreas[] (ref Solution), featuredProductSlugs[], externalWebsite (EMC)`

### 8.3 Product
`slug, name, manufacturer (ref Partner), businessUnit, clinicalSpecialty[] (ref Solution), category, family, model, shortDescription{en,ar}, heroImage, gallery[], clinicalApplications{en,ar}, keyFeatures{en,ar}[], keyBenefits{en,ar}[], technicalSpecs: {label,value}[], accessories[], compatibleProductSlugs[], brochureUrl (EMC), ifuUrl (EMC), certificates[] (EMC, each item requires a source document reference), videos[], relatedProductSlugs[]`

### 8.4 News/KnowledgeCenter item
`slug, type: 'article'|'case-study'|'white-paper'|'news'|'event'|'workshop', title{en,ar}, publishDate, excerpt{en,ar}, body{en,ar}, coverImage, relatedSolutionSlugs[], downloadUrl?, eventDate?, eventLocation?`

### 8.5 Job
`slug, title{en,ar}, department, location, employmentType, description{en,ar}, applyVia: 'form'|'linkedin', linkedinUrl?`

### 8.6 Stats
`{ id, label{en,ar}, value: number | null, verified: boolean, displayIfUnverified: false }` — the homepage stats component must not render an entry where `verified` is false; this is a hard rule, not a style preference, to comply with Section 2.2.

### 8.7 Testimonial
`{ quote{en,ar}, author, title, organization, verified: true }` — array ships empty; component renders a graceful empty/hidden state, never mock testimonials.

### 8.8 Lead form submissions (not content — form payloads)

**Demo Request:** fullName, organization, jobTitle, department, city, email, mobile, productOrSolutionOfInterest, preferredContactMethod, message.
**Quotation Request:** organization, contactPerson, department, product, quantity, city, procurementType: 'tender'|'direct', message.
**Contact (general/sales/technical support):** inquiryType selector, name, organization, email, phone, message.
**Careers Application / Talent Network:** name, email, phone, position (or "general interest"), cvUpload, linkedinUrl?.

All four route through Zod-validated API routes, get emailed via Resend to a configurable EMC inbox, and are logged to a local JSON/DB store so nothing is lost if email delivery fails. Structure the payload shape so a Phase 2 CRM/Odoo webhook is a one-function addition (`lib/leads/dispatch.ts` with a single `submitLead()` entry point that fans out to email + storage + future webhook).

---

## 9. Page specifications

### 9.1 Home
Cinematic hero (headline "Advancing Healthcare Through Technology" or equivalent, subhead on EMC's role connecting professionals with technology, primary CTA "Explore Our Solutions," secondary CTA "Request a Demo") → trust/intro band ("Serving Saudi Healthcare Since 2013") → Solutions grid (6 cards) → one editorial Featured Technology feature (UE Integrated Airway Management Platform — the only category with enough verified content to carry this treatment today) → Partners band ("Global Technology. Local Expertise.") → Why EMC summary (links to full page) → Stats band (verified only, Section 8.6) → Knowledge Center preview (3 latest items) → Testimonials (renders only if content exists) → final CTA band ("Let's Advance Healthcare Together").

### 9.2 About Us
Who We Are, Our Story (write from the verified 2013-founding fact — do not invent milestones), Vision, Mission, Core Values (the 5-value PDF set), Leadership (CEO Moosa Almoosa; additional leadership only if EMC supplies bios/photos), Corporate Philosophy paragraph tying back to the positioning in Section 3.

### 9.3 Solutions (index + 6 detail pages)
Each detail page: hero, clinical challenge framing, how EMC's portfolio addresses it, related products grid, related partner callout, CTA. Airway Management and Anesthesia can be fully substantiated today from UE Medical content; Orthopedics and Infection Control from Ortholand/BeneCare/OXY'PHARM; Critical Care and Respiratory Care ship as a clean "portfolio expanding — speak with our team" state until EMC supplies products (see 2.2) — do not leave them out of navigation, but do not fabricate their content either.

### 9.4 Products (index + detail)
Index: filter by Solution, Manufacturer, Clinical Application; search box; grid of product cards. Detail page follows the multinational-MedTech landing-page pattern specified in the original brief: breadcrumb → product name + manufacturer → large imagery → one-line clinical positioning statement → Request a Demo / Contact Sales / Download Brochure buttons → Overview → Clinical Applications → Key Benefits → Features → Technical Specifications (table, collapses to accordion on mobile) → Accessories → Downloads → Videos → Related Products → Partner info card → Contact Specialist CTA. No cart, no price, no "buy" language anywhere.

### 9.5 Partners (index + 5 detail pages)
Index: premium logo grid, each tile linking to a detail page. Detail page: logo, country, company introduction, technology expertise, relationship statement (per 8.2 rule), product portfolio, clinical areas, featured products, external website link.

### 9.6 Why EMC
Clinical Expertise, Technical Support, Training & Education, After-Sales Service, Regulatory Knowledge, Fast Response, Hospital Partnership, Quality Assurance — each as a short, evidence-oriented paragraph, not a marketing slogan. Where a claim needs proof (e.g. "fast response"), phrase it around EMC's actual operating model rather than an invented SLA number.

### 9.7 Services
Clinical Training, Hands-on Workshops, Product Demonstrations, Installation, Commissioning, Maintenance & Preventive Maintenance, Technical Support, Hospital Consultation, Tender Support. Each gets a short description and, where relevant, a CTA into the Contact form pre-filtered to "Technical Support" or "Tender Support."

### 9.8 Knowledge Center
Single filterable index (type: article/case study/white paper/news/event/workshop) + detail template. Ships with zero or minimal seed content — do not fabricate clinical articles; structure is the deliverable here, content arrives from EMC over time.

### 9.9 Careers
Listings (empty state: "No open positions right now — join our Talent Network" CTA) + detail page + application form (Section 8.8) + a short, honest culture/benefits section written generically around EMC's stated values rather than invented perks.

### 9.10 Contact
Inquiry-type selector (Corporate / Sales / Technical Support / Demo Request) that adjusts the form fields shown, embedded map (Dammam, King Fahd Road coordinates from the live site), phone/email/WhatsApp, working hours (EMC to confirm — placeholder "Sunday–Thursday, 8:00 AM – 5:00 PM" flagged as unverified), social links.

### 9.11 Legal
Privacy Policy, Terms of Use, Cookie Policy — standard structure, written generically (not fabricated legal claims about data handling EMC hasn't confirmed); flag to EMC for legal review before launch.

---

## 10. Bilingual / RTL requirements

- Route-based locales via next-intl: `/en/*` default, `/ar/*` full mirror. No query-param language switching.
- Arabic renders `dir="rtl"` at the `<html>` level; layout, nav order, breadcrumbs, carousels, icon direction (arrows, chevrons), and mobile menu must all mirror — this is a real RTL implementation, not `direction: rtl` slapped on an LTR layout. Test every interactive component in both directions.
- Numbers, model numbers, and technical specs stay LTR inside RTL text via isolated `dir="ltr"` inline spans so they don't reverse digit order.
- All content model text fields are `{en, ar}` pairs (Section 8) — never a single field with runtime translation. Arabic copy is drafted natively, reviewed for medical terminology accuracy, not machine-translated from the English draft.
- SEO metadata (Section 12) is generated per locale, including separate OpenGraph copy, not a shared string.

---

## 11. Lead generation & forms

CTAs used consistently site-wide: Request a Demo, Request a Quotation, Speak with a Product Specialist, Download Brochure, Contact EMC. Implement Request a Demo as a modal (shadcn Dialog) reachable from the header on every page, plus a full-page version at `/contact` with the inquiry-type selector. Validate client- and server-side with the same Zod schema (Section 8.8). On submit: show inline success state (no page navigation), send confirmation to the submitter, notify EMC's sales inbox via Resend, persist to local storage/DB as a durability fallback. Document the CRM/Odoo webhook extension point in code comments even though it isn't wired up yet.

---

## 12. SEO & structured data

Per-locale metadata (title, description, canonical, hreflang alternates linking en↔ar), OpenGraph + Twitter cards, `sitemap.xml` and `robots.txt` generated from the route tree, JSON-LD for Organization (home), Product (product pages), BreadcrumbList (all interior pages), Article (knowledge center items). Target keyword clusters from the brief (medical equipment Saudi Arabia, airway management Saudi Arabia, video laryngoscope Saudi Arabia, anesthesia equipment Saudi Arabia, orthopedic medical products Saudi Arabia, infection control solutions Saudi Arabia) — work these into page titles/H1s/meta descriptions naturally per relevant page, not stuffed onto the homepage.

---

## 13. Interaction & accessibility notes

WCAG 2.1 AA as the bar: color contrast (verify purple-on-white and teal-on-white combinations meet 4.5:1 for body text — the raw teal `#2E948C` on white is borderline for small text, use `--emc-teal-600` or darker for text, reserve lighter teal for large text/icons/backgrounds), full keyboard navigation through the mega-menu and modals, visible focus states, alt text on every image (especially product imagery — describe the device, not just "product photo"), form errors announced to screen readers. Lighthouse performance target: 90+ on the product and home pages (optimize hero imagery, lazy-load below-the-fold sections, avoid layout shift from web fonts via `font-display: swap` and size-adjusted fallbacks).

---

## 14. Existing site content inventory (reference only — rewrite, don't copy)

Full scrape notes live in `/reference/tamiozmed-content-inventory.md`. Do not port this copy verbatim — it's outdated in tone and, in places, factually thin (e.g. unresolved stat counters, a 3-value set that the internal PDF has since updated to 5). Use it only to confirm facts against Section 2 and to make sure nothing genuinely important (a real client, a real partner, a real certification) gets dropped in the rewrite.

---

## 15. Assets provided

- `/reference/brand/emc-logo-original.png` — official logo, raster, 356×349px. Treat as the color/brand source of truth (Section 6.1). Flag to EMC that a vector source is needed.
- `/reference/UE-Product-Presentation-EMC-V3.pdf` — internal UE Medical partnership deck. Source for Section 2.1's UE Medical facts and for Airway Management solution/product copy.
- `/reference/tamiozmed-content-inventory.md` — structured notes from the live site (this build's predecessor).
- `/reference/original-briefs/` — the two original ChatGPT-authored prompts, kept for traceability only. This spec supersedes them.

---

## 16. Build phases

Build and ship in this order — don't attempt the whole site in one pass.

1. **Foundation:** repo scaffold (Section 5), design tokens (Section 6), i18n routing skeleton with EN/AR shells, shared layout (header/mega-menu/footer/WhatsApp/back-to-top), content schemas + typed getters (Section 8).
2. **Home + About + Why EMC:** the pages that carry the most verified content today; validates the design system end-to-end.
3. **Solutions + Partners:** all 6 solution pages (2 fully substantiated, 4 in the honest "expanding" state), all 5 partner pages.
4. **Products:** catalog index with filters/search, detail template, seeded with UE Medical's actual product line (UEScope, SaCoVLM, Flexible Bronchoscope) as the reference implementation for future products.
5. **Lead gen:** Request Demo modal + Contact page + all four form flows wired to email delivery.
6. **Services + Knowledge Center + Careers:** structure-first, minimal seed content.
7. **Legal pages, SEO pass, accessibility pass, performance pass, Playwright test suite.**
8. **Launch checklist:** verify every Section 2.2 placeholder is still clearly marked, no fabricated stat/testimonial/certification made it into the build, hreflang/sitemap valid, forms tested end-to-end in both languages.

---

## 17. Definition of done

- Every page renders correctly and fully in both `/en` and `/ar`, including RTL layout mirroring.
- No hardcoded copy inside JSX for anything defined in Section 8's content models — all sourced from `/content`.
- No fabricated statistic, testimonial, certification, award, or client claim exists anywhere in the shipped copy — grep the codebase for the words "years of experience," "certified," "award," "exclusive" before calling this done and manually verify each hit traces to Section 2.1.
- Lighthouse ≥ 90 performance/accessibility/SEO/best-practices on home and one product page.
- All four lead-gen forms submit successfully, validate correctly, and produce both an email notification and a durable local record.
- `DECISIONS.md` documents every judgment call made where this spec was silent.

---

## 18. Content rules (hard constraints)

Never invent: hospital customers, government contracts, awards, certifications, product registrations, exclusive distributorship claims, statistics, testimonials, or clinical efficacy claims. Where verified information doesn't exist yet, ship a clearly-marked placeholder or an honest empty state — never a plausible-sounding fake. If a page would look thin without fabricated content, that's a signal to simplify the page, not to invent facts. This is a compliance matter for a medical-adjacent company, not a style preference — treat it as a blocking rule during code review.
