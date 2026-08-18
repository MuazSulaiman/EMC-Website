# UI Polish & Animation Pass — Design

## Context

A full UI/UX audit of the live site (browsed in Chrome at `localhost:3002`,
cross-referenced against the component/content source) found the site is
**not** a generic template that needs a redesign. It's a spec-driven build
(`PROJECT_SPEC.md`, phase history in `PROGRESS.md`) that already has a
deliberate, documented motion philosophy:

> "Subtle and purposeful: fade/slide-up on scroll reveal (staggered for card
> grids), smooth 200–300ms hover transitions, no parallax gimmicks, no
> auto-playing carousels without pause controls. Respect
> `prefers-reduced-motion` everywhere Framer Motion is used." — Section 6.4

Most of what a typical "add some animation" pass would suggest is **already
built**: `Reveal`/`RevealGroup` scroll-reveal (`src/components/motion/reveal.tsx`,
used in 29 files), a hand-rolled draggable/pausable logo marquee
(`customer-marquee.tsx`), a scroll-triggered `StatCounter`, a
condense-on-scroll sticky header, and consistent hover-lift+shadow on every
card type. This spec does **not** redesign the site — it closes four
specific, verified gaps between what the spec/components promise and what
actually ships, without introducing any motion pattern the site doesn't
already use elsewhere.

**Explicitly ruled out** (verified in code, not just visually):

- **Mega-menu enter/exit animation** — already implemented via Base UI's
  `data-open:animate-in`/`fade-in-0`/`zoom-in-95` classes in
  `src/components/ui/navigation-menu.tsx`. Nothing to add.
- **GradientMesh inconsistency between About and other detail pages** — it's
  already used consistently across About, Solutions/Products/Partners
  detail, and `CtaBand` as the deliberate photography stand-in (Section
  6.1: "use it in gradients... instead" of a flat purple fill or invented
  photography). Not a gap.
- **Site-wide route/page transition fade** — would touch Next.js App Router
  layout/template boundaries app-wide for a purely cosmetic win, and risks
  exactly the kind of "gratuitous motion" / hydration flakiness the site's
  own spec warns against. Deprioritized as not worth the risk.
- **Dark mode toggle** — `next-themes` is an installed-but-unused dependency,
  but Section 6.3 only calls for "midnight navy... dark mode / footer base"
  (i.e. the footer's dark band), not a real theme switch. No task; flagged
  as a separate product decision if EMC wants a real dark mode later.

## Scope (4 tasks, verified against current code)

### 1. Featured Technology facts don't animate like every other stat does

`src/components/sections/home/featured-technology.tsx` renders its 3 facts
(11,000+ hospitals / 70+ countries / 64GB storage) as static text. The site
already has a scroll-triggered, reduced-motion-aware `StatCounter`
(`src/components/ui/stat-counter.tsx`) used by `stats-band.tsx` — but that
component never renders today because every seeded stat has
`verified: false` (`content/stats.json`, Section 8.6 policy: never show an
unconfirmed number). Featured Technology's facts **are** already
EMC-confirmed real numbers (Section 2.1, UE Medical's own figures), so they
can safely go through `StatCounter` — they're the one place on the site a
real animated counter can ship today.

**The blocker:** `facts[].value` is currently a *pre-formatted localized
string* (`{ "en": "11,000+", "ar": "+11,000" }`) — Arabic literally reverses
the digit/symbol order for RTL display. `StatCounter` takes a raw
`value: number` and does its own `.toLocaleString()` + suffix formatting; it
cannot animate a pre-formatted string, and regex-parsing "+11,000" back into
a number (differently per locale) would be fragile and against the
codebase's own "don't hack around content shape, fix the schema" pattern
(see `DECISIONS.md`'s Select/`SelectValue` fixes for the established
precedent).

**Fix:** migrate the schema so each fact carries a raw number plus a
localized suffix:

```ts
facts: z.array(
  z.object({
    label: localizedStringSchema,
    value: z.number(),
    suffix: localizedStringSchema,
  }),
),
```

`content/pages/home.json` becomes `{ "value": 11000, "suffix": { "en": "+", "ar": "+" } }`,
`{ "value": 70, "suffix": { "en": "+", "ar": "+" } }`, `{ "value": 64, "suffix": { "en": "GB", "ar": " جيجابايت" } }`.
`FeaturedTechnology` renders `<StatCounter value={fact.value} suffix={fact.suffix} />`
instead of static `{fact.value}` text. Arabic numeral direction is handled
by `StatCounter`'s existing `.toLocaleString()` + the `ltr-embed` wrapper
class already used for numbers elsewhere in this component.

### 2. Hero entrance is one block, not staggered

`src/components/sections/home/hero.tsx` wraps the entire left column
(eyebrow, headline, subhead, both buttons) in a single `<Reveal>` — it all
fades/slides in together as one unit. Every other multi-element group on the
site (stat bands, card grids) uses `RevealGroup` + per-child `delay` for a
staggered feel. The hero — the very first thing a visitor sees — is the one
place that doesn't. Split it into individually-delayed `Reveal`s (eyebrow →
headline, then subhead, then the button row), using the same stagger
increment (`0.08`–`0.1`s) already used elsewhere, so the homepage's most
prominent element matches the motion language used everywhere else on the
page below it.

### 3. Solutions mega-menu has no icons; every other solution touchpoint does

Every place a solution appears elsewhere on the site — the homepage
solutions grid, solution detail hero — shows an icon badge
(`inline-flex size-11 ... rounded-xl bg-emc-teal-100 text-emc-purple-700`
+ `DynamicIcon`). The one place solutions are listed as plain text is the
header's Solutions mega-menu (`MegaMenuItem` in
`src/components/layout/desktop-nav.tsx`), sourced from the static
`solutionsMenu` in `src/lib/nav.ts`, which only carries `labelKey`/`href`.

**Fix:** add an `icon` field to `NavItem`/`solutionsMenu.items` in
`src/lib/nav.ts`, populated with the same Lucide icon name each solution
already uses in its content file (`content/solutions/*.json` — verified:
`airway-management` → `Wind`, `anesthesia` → `Syringe`, `critical-care` →
`HeartPulse`, `respiratory-care` → `Activity`, `orthopedics` → `Bone`,
`infection-control` → `ShieldCheck`), then render a small icon via
`DynamicIcon` next to each menu label in `MegaMenuItem`. `nav.ts` is already
the intentional static mirror of the content sitemap (see its own top-of-file
comment), so hardcoding the icon there — rather than fetching content data
into a client nav component — matches the existing pattern. `partnersMenu`
is left untouched (partners are brand names, not icon-representable
categories, and have no `icon` field in their content schema).

### 4. Product cards are the one card type with no icon badge

`SolutionCard` and (once wired) the mega-menu both show a solution's icon.
`ProductCard` (`src/components/sections/product-card.tsx`) shows only text —
manufacturer name, title, description — no icon, so the Products page and
every "related products" grid feels flatter than the Solutions side of the
site. Every seeded product's `clinicalSpecialty[0]` (e.g.
`"airway-management"`) is a real solution slug (Section 8.3 schema), so the
same icon used for that solution elsewhere can badge the product card too —
no invented data, just reusing an existing, already-correct mapping.

**Fix:** export the slug→icon map built for Task 3 as a plain constant
(`solutionIcons: Record<string, string>`) from `src/lib/nav.ts` so both the
mega-menu and `ProductCard` import the same source of truth. `ProductCard`
looks up `solutionIcons[product.clinicalSpecialty[0]]` and, when found,
renders the identical icon-badge markup `SolutionCard` uses, so all card
types in the system now share one visual pattern. `ProductCard` is used in
4 places (`product-catalog.tsx`, and the 3 detail pages' "related products"
grids) — using a plain sync constant (not an async content-layer fetch)
keeps it working identically in `ProductCard`'s client- and server-rendered
call sites without new data plumbing.

## Non-goals

- No new dependencies (Framer Motion, Lucide, next-intl already cover
  everything above).
- No changes to `Reveal`/`RevealGroup`/`StatCounter`/`CustomerMarquee`
  themselves — they're correct as built; this spec only wires more of the
  site through them.
- No content fabrication — every number/icon used above already exists
  verified in `content/`; nothing here invents a stat, name, or claim.
- No route-level transition, no dark-mode toggle, no mega-menu motion (see
  "Explicitly ruled out" above).

## Testing / verification

- `npm run lint` and `npx tsc --noEmit` clean.
- `npm run build` succeeds (static generation for all locales/routes
  touched: home, products index, solution/product/partner detail pages).
- `npm run test:e2e` (existing Playwright + axe suite) passes unchanged —
  none of these tasks touch focus order, landmarks, or contrast.
- Manual in-browser check (EN + AR) of: homepage hero stagger, Featured
  Technology counters animating on scroll into view, mega-menu icons,
  product card icons on `/products`, `/solutions/[slug]`, `/products/[slug]`,
  and `/partners/[slug]`.
- Manual check with `prefers-reduced-motion: reduce` enabled: hero and
  stat counters should render in their final state immediately, no motion
  (already guaranteed by `Reveal`/`StatCounter`'s existing
  `useReducedMotion()` branches — this is a regression check, not new code).
