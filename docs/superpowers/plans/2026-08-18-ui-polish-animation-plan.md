# UI Polish & Animation Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close four verified gaps between the site's own documented motion/visual system and what currently ships — animate the one set of facts that has real confirmed numbers, stagger the homepage hero entrance to match the rest of the page, and give the Solutions mega-menu and Product cards the same icon-badge treatment every other solution touchpoint already has.

**Architecture:** No new components, no new dependencies. Every task wires existing, already-correct primitives (`StatCounter`, `Reveal`, `DynamicIcon`) into places that don't use them yet, plus one small content-schema change (`facts[].value` string → number+suffix) needed to make Task 1 possible without fragile string-parsing.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind v4, Framer Motion (already installed), Zod (content schema validation), next-intl.

**Spec:** `docs/superpowers/specs/2026-08-18-ui-polish-animation-design.md`

## Global Constraints

- Respect `prefers-reduced-motion` everywhere — `Reveal`/`StatCounter` already branch on `useReducedMotion()`; new usages must not bypass that.
- No content fabrication — every number, label, and icon name used below already exists verified in `content/`; do not invent new ones (Section 18 of `PROJECT_SPEC.md`).
- Every text field stays a `{ en, ar }` pair (Section 10) — never hardcode an English-only string into a component.
- `npm run build`, `npm run lint`, and `npx tsc --noEmit` must stay clean after every task (this repo's own verification bar per `PROGRESS.md`).
- Follow existing patterns: badge/icon markup must match `SolutionCard`'s exact classes (`inline-flex size-11 items-center justify-center rounded-xl bg-emc-teal-100 text-emc-purple-700`), not a new visual style.

---

### Task 1: Animate Featured Technology's facts via StatCounter

**Files:**
- Modify: `content/schemas/home-page.ts:25-27` (the `facts` array shape)
- Modify: `content/pages/home.json:47-59` (the 3 fact objects, both locales)
- Modify: `src/app/[locale]/page.tsx:92-95` (the `facts` mapping passed to `FeaturedTechnology`)
- Modify: `src/components/sections/home/featured-technology.tsx` (props type + render)
- Test: manual + `npm run build` (this repo has no per-component unit tests — Zod parsing content at import time is the existing "test" for content-shape correctness, per `PROGRESS.md`'s own verification pattern)

**Interfaces:**
- Consumes: `StatCounter` from `src/components/ui/stat-counter.tsx` — `<StatCounter value={number} suffix?={string} duration?={number} />` (already exists, unchanged).
- Produces: `FeaturedTechnology`'s `facts` prop becomes `{ label: string; value: number; suffix: string }[]` — note this is a breaking change to `FeaturedTechnology`'s public props; it has exactly one caller (`src/app/[locale]/page.tsx`), updated in this same task.

- [ ] **Step 1: Update the content schema**

Edit `content/schemas/home-page.ts`, replace the `facts` field (currently lines 25-27):

```ts
    facts: z.array(
      z.object({
        label: localizedStringSchema,
        value: z.number(),
        suffix: localizedStringSchema,
      }),
    ),
```

- [ ] **Step 2: Update the content JSON (both locales)**

Edit `content/pages/home.json`, replace the `facts` array (currently lines 47-59) with:

```json
    "facts": [
      {
        "label": { "en": "Hospitals worldwide using UE Medical products", "ar": "مستشفى حول العالم يستخدم منتجات UE Medical" },
        "value": 11000,
        "suffix": { "en": "+", "ar": "+" }
      },
      {
        "label": { "en": "Countries and regions served", "ar": "دولة ومنطقة تخدمها الشركة" },
        "value": 70,
        "suffix": { "en": "+", "ar": "+" }
      },
      {
        "label": { "en": "Onboard storage for teaching & traceability", "ar": "سعة تخزين داخلية للتدريب والتتبع" },
        "value": 64,
        "suffix": { "en": "GB", "ar": " جيجابايت" }
      }
    ]
```

(Read the file first to confirm the exact surrounding structure/indentation before editing — do not assume line numbers are still exact if earlier tasks touched this file.)

- [ ] **Step 3: Update the page mapping**

In `src/app/[locale]/page.tsx`, the `FeaturedTechnology` call currently maps facts like this (lines 92-95):

```tsx
        facts={content.featuredTechnology.facts.map((fact) => ({
          label: l(fact.label),
          value: l(fact.value),
        }))}
```

Replace with:

```tsx
        facts={content.featuredTechnology.facts.map((fact) => ({
          label: l(fact.label),
          value: fact.value,
          suffix: l(fact.suffix),
        }))}
```

- [ ] **Step 4: Wire FeaturedTechnology to StatCounter**

In `src/components/sections/home/featured-technology.tsx`:

1. Add the import: `import { StatCounter } from "@/components/ui/stat-counter";`
2. Change the `facts` prop type (currently `{ label: string; value: string }[]`) to:

```ts
  facts: { label: string; value: number; suffix: string }[];
```

3. Replace the fact rendering (currently):

```tsx
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                <dd className="ltr-embed mt-1 text-xl font-heading font-bold text-emc-purple-700">
                  {fact.value}
                </dd>
              </div>
            ))}
```

with:

```tsx
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                <dd className="mt-1 text-xl font-heading font-bold text-emc-purple-700">
                  <StatCounter value={fact.value} suffix={fact.suffix} />
                </dd>
              </div>
            ))}
```

(Drop the `ltr-embed` class here — `StatCounter` already wraps its own output in a `<span className="ltr-embed">`, so keeping it on the parent `<dd>` too would be redundant, not wrong, but remove it for clarity since `StatCounter` now owns that concern.)

- [ ] **Step 5: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed with no errors. If `tsc` flags a type mismatch, it means another `FeaturedTechnology` caller exists that Step 1's "exactly one caller" assumption missed — grep `grep -rn "FeaturedTechnology" src/` and update any other call site the same way as Step 3.

- [ ] **Step 6: Manual visual verification**

Start the dev server (`npm run dev`), open the homepage in both `/en` and `/ar`, scroll to the "Featured Technology" section, and confirm:
- The three numbers (11,000+ / 70+ / 64GB, with correct Arabic suffix text) count up from 0 when the section scrolls into view, matching the animation style already visible on any section using `StatCounter` elsewhere.
- With OS/browser "reduce motion" enabled, the numbers appear instantly at their final value with no count-up (this is `StatCounter`'s existing `useReducedMotion()` branch — confirms Step 4 didn't bypass it).

- [ ] **Step 7: Commit**

```bash
git add content/schemas/home-page.ts content/pages/home.json src/app/\[locale\]/page.tsx src/components/sections/home/featured-technology.tsx
git commit -m "feat: animate Featured Technology facts via StatCounter"
```

---

### Task 2: Stagger the homepage hero entrance

**Files:**
- Modify: `src/components/sections/home/hero.tsx`
- Test: manual (no logic change, pure motion timing)

**Interfaces:**
- Consumes: `Reveal` from `src/components/motion/reveal.tsx` — `<Reveal delay?={number}>` (already exists, unchanged, same component already used elsewhere in this file).
- Produces: no new exports; `Hero`'s props (`eyebrow`, `headline`, `subhead`, `imageAlt`) are unchanged.

- [ ] **Step 1: Split the single Reveal into staggered Reveals**

In `src/components/sections/home/hero.tsx`, the left column is currently one `<Reveal>` wrapping eyebrow + headline + subhead + buttons (lines 24-40):

```tsx
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            {subhead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/solutions" />}>
              {t("cta.exploreSolutions")}
            </Button>
            <DemoRequestModal size="lg" variant="outline" />
          </div>
        </Reveal>
```

Replace with three separately-delayed `Reveal`s inside the same wrapping `<div>` (so layout/spacing classes stay on the children exactly as before — only the `Reveal` boundaries move):

```tsx
        <div>
          <Reveal>
            <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              {subhead}
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" render={<Link href="/solutions" />}>
                {t("cta.exploreSolutions")}
              </Button>
              <DemoRequestModal size="lg" variant="outline" />
            </div>
          </Reveal>
        </div>
```

The existing hero image `<Reveal delay={0.1}>` (lines 41-52) is unchanged — leave it exactly as-is; the new button-row delay (`0.16`) intentionally lands after it so the CTAs are the last thing to settle in, not competing with the image.

- [ ] **Step 2: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both clean — this step only moves JSX, no new types or props.

- [ ] **Step 3: Manual visual verification**

Start the dev server, load `/en` (hard refresh to replay the entrance animation), and confirm: eyebrow+headline appear first, subhead a beat later, then the button row — a visible stagger instead of everything fading in as one block. Repeat on `/ar` to confirm RTL layout is unaffected (this task doesn't touch direction-sensitive classes). Then enable "reduce motion" and hard-refresh again — all three groups should appear instantly with no stagger (existing `Reveal` behavior, unchanged).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/home/hero.tsx
git commit -m "feat: stagger homepage hero entrance to match sitewide reveal pattern"
```

---

### Task 3: Add icon badges to the Solutions mega-menu

**Files:**
- Modify: `src/lib/nav.ts`
- Modify: `src/components/layout/desktop-nav.tsx`
- Test: manual + `npx tsc --noEmit`

**Interfaces:**
- Consumes: `DynamicIcon` from `src/components/ui/dynamic-icon.tsx` — `<DynamicIcon name={string} className?={string} aria-hidden?={boolean} />` (already exists, unchanged, same component `SolutionCard` already uses).
- Produces: `src/lib/nav.ts` exports a new constant `solutionIcons: Record<string, string>` (slug → Lucide icon name) — **Task 4 imports this exact export**, so the name and shape must match precisely.

- [ ] **Step 1: Add an optional icon field to NavItem, populate solutionsMenu**

In `src/lib/nav.ts`, change the `NavItem` type (currently lines 5-8) to make `icon` optional:

```ts
export type NavItem = {
  labelKey: string;
  href: string;
  icon?: string;
};
```

Update `solutionsMenu.items` (currently lines 19-26) to add the icon for each entry — these are the exact Lucide names already used by the matching solution's `icon` field in `content/solutions/*.json`:

```ts
export const solutionsMenu: MegaMenuGroup = {
  labelKey: "nav.solutions",
  href: "/solutions",
  items: [
    { labelKey: "nav.solutionsMenu.airwayManagement", href: "/solutions/airway-management", icon: "Wind" },
    { labelKey: "nav.solutionsMenu.anesthesia", href: "/solutions/anesthesia", icon: "Syringe" },
    { labelKey: "nav.solutionsMenu.criticalCare", href: "/solutions/critical-care", icon: "HeartPulse" },
    { labelKey: "nav.solutionsMenu.respiratoryCare", href: "/solutions/respiratory-care", icon: "Activity" },
    { labelKey: "nav.solutionsMenu.orthopedics", href: "/solutions/orthopedics", icon: "Bone" },
    { labelKey: "nav.solutionsMenu.infectionControl", href: "/solutions/infection-control", icon: "ShieldCheck" },
  ],
};
```

Leave `partnersMenu` and `primaryNav` untouched — they don't get icons (see spec's "Explicitly ruled out" reasoning: partners aren't icon-representable categories, and `Partner` has no `icon` field).

- [ ] **Step 2: Export a slug→icon lookup map for Task 4 to reuse**

Still in `src/lib/nav.ts`, add this export after `solutionsMenu` (Task 4 imports it by this exact name):

```ts
// Reused by ProductCard (src/components/sections/product-card.tsx) to badge
// a product with its clinical specialty's icon — same source of truth as
// the mega-menu above, keyed by solution slug (the last path segment of
// each item's href).
export const solutionIcons: Record<string, string> = Object.fromEntries(
  solutionsMenu.items.map((item) => [item.href.split("/").pop()!, item.icon!]),
);
```

- [ ] **Step 3: Render the icon in the mega-menu**

In `src/components/layout/desktop-nav.tsx`, the `MegaMenuItem` function currently renders each item as (lines 75-81):

```tsx
          {group.items.map((item) => (
            <li key={item.href}>
              <NavigationMenuLink render={<Link href={item.href} />}>
                {t(item.labelKey)}
              </NavigationMenuLink>
            </li>
          ))}
```

Add the icon import at the top of the file: `import { DynamicIcon } from "@/components/ui/dynamic-icon";`

Then replace the block above with:

```tsx
          {group.items.map((item) => (
            <li key={item.href}>
              <NavigationMenuLink render={<Link href={item.href} />}>
                {item.icon && (
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-emc-teal-100 text-emc-purple-700">
                    <DynamicIcon name={item.icon} className="size-4" aria-hidden="true" />
                  </span>
                )}
                {t(item.labelKey)}
              </NavigationMenuLink>
            </li>
          ))}
```

(`NavigationMenuLink`'s existing classes already include `flex items-center gap-2` — see `src/components/ui/navigation-menu.tsx` — so the icon and label lay out side-by-side automatically with no extra flex/gap classes needed here. The `item.icon &&` guard is what makes this safe for `partnersMenu`, which reuses the same `MegaMenuItem` component but has no `icon` on its items.)

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean. If it errors on `item.icon!` in Step 2's `solutionIcons` export, it means an item is missing its `icon` field from Step 1 — double check all 6 `solutionsMenu.items` entries got the edit.

- [ ] **Step 5: Manual visual verification**

Start the dev server, hover/click "Solutions" in the header nav on `/en`, confirm each of the 6 items shows a small teal icon badge to the left of its label, matching the icon each solution shows on its own card (compare against the homepage's Solutions grid). Confirm "Partners" mega-menu still renders correctly with no icons (unchanged). Repeat on `/ar` and confirm the icon sits correctly for RTL (it should mirror automatically since `NavigationMenuLink`'s `gap-2 flex items-center` has no explicit `flex-row`/direction override).

- [ ] **Step 6: Commit**

```bash
git add src/lib/nav.ts src/components/layout/desktop-nav.tsx
git commit -m "feat: add icon badges to Solutions mega-menu"
```

---

### Task 4: Add matching icon badges to Product cards

**Files:**
- Modify: `src/components/sections/product-card.tsx`
- Test: manual + `npx tsc --noEmit`

**Interfaces:**
- Consumes: `solutionIcons` from `src/lib/nav.ts` (produced in Task 3, Step 2 — `Record<string, string>` keyed by solution slug), `DynamicIcon` from `src/components/ui/dynamic-icon.tsx`.
- Produces: no new exports; `ProductCard`'s props (`product`, `manufacturer`) are unchanged, so all 4 existing call sites (`product-catalog.tsx`, `solutions/[slug]/page.tsx`, `products/[slug]/page.tsx`, `partners/[slug]/page.tsx`) need no changes.

- [ ] **Step 1: Add the icon badge to ProductCard**

In `src/components/sections/product-card.tsx`, add the imports:

```tsx
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { solutionIcons } from "@/lib/nav";
```

The component currently renders (full current body):

```tsx
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {manufacturer && (
        <span className="text-xs font-semibold tracking-wide text-emc-teal-700 uppercase">
          {manufacturer.name}
        </span>
      )}
      <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
        {product.name}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">
        {pickLocale(product.shortDescription, locale)}
      </p>
      <span className="mt-4 text-sm font-medium text-emc-teal-700 group-hover:underline">
        {t("common.learnMore")}
      </span>
    </Link>
  );
```

Replace with (adds an icon badge above the manufacturer/title, matching `SolutionCard`'s badge exactly, only rendered when the product's primary clinical specialty maps to a known icon):

```tsx
  const iconName = solutionIcons[product.clinicalSpecialty[0]];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {iconName && (
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-emc-teal-100 text-emc-purple-700">
          <DynamicIcon name={iconName} className="size-5" aria-hidden="true" />
        </span>
      )}
      {manufacturer && (
        <span className="text-xs font-semibold tracking-wide text-emc-teal-700 uppercase">
          {manufacturer.name}
        </span>
      )}
      <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
        {product.name}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">
        {pickLocale(product.shortDescription, locale)}
      </p>
      <span className="mt-4 text-sm font-medium text-emc-teal-700 group-hover:underline">
        {t("common.learnMore")}
      </span>
    </Link>
  );
```

(`mb-3` on the badge, not `mt-4`/`mt-1` like `SolutionCard`'s badge row, because `ProductCard` has no separate badge/status row to space against — it sits directly above the manufacturer label. `SolutionCard`'s badge is `size-11`/`rounded-xl`/`bg-emc-teal-100`/`text-emc-purple-700` with a `size-5` icon inside — this reuses those exact values, not new ones.)

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean. `product.clinicalSpecialty[0]` is safe to index — the `Product` type (`content/schemas/product.ts`) defaults `clinicalSpecialty` to `[]`, so `[0]` can be `undefined`, which is exactly what makes `solutionIcons[undefined]` correctly resolve to `undefined` and skip the badge — no runtime error, no extra guard needed.

- [ ] **Step 3: Manual visual verification**

Start the dev server, visit `/en/products` (index — all 3 seeded products have `clinicalSpecialty: ["airway-management", ...]`) and confirm every card now shows the same "Wind" icon badge used on the Airway Management solution card. Visit `/en/solutions/airway-management` and `/en/partners/ue-medical` (both render `ProductCard` grids) and confirm the same badge appears there too. Repeat on `/ar`.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/product-card.tsx
git commit -m "feat: add icon badges to Product cards, matching Solution cards"
```

---

### Task 5: Full verification pass

**Files:** none (verification only)

**Interfaces:** none — this task runs the project's existing build/lint/test/accessibility tooling exactly as `PROGRESS.md` describes doing after every phase.

- [ ] **Step 1: Clean build**

Run: `npm run lint && npx tsc --noEmit && npm run build`
Expected: all three succeed with zero errors/warnings. This is the same bar every prior phase in `PROGRESS.md` was held to.

- [ ] **Step 2: Run the existing Playwright/axe suite**

Run: `npm run test:e2e`
Expected: all existing tests still pass (navigation, language-switch, demo-form, accessibility). None of Tasks 1-4 touch focus order, ARIA roles, or landmark structure, so this is a regression check, not expected to need new tests — but if any test fails, treat it as a real regression to fix, not a test to delete or skip.

- [ ] **Step 3: grep for fabrication-risk words (this repo's own established practice)**

Run: `grep -rniE "years of experience|certified|award|exclusive" content/ src/`
Expected: only the same pre-existing hits `PROGRESS.md` already documents as clean (the ISO 13485 certification and the stats placeholder label) — nothing new introduced by this plan's content edits (Task 1 only changed number formatting, not claims).

- [ ] **Step 4: Manual bilingual QA sweep**

With `npm run dev` running, walk through in both `/en` and `/ar`:
- Homepage: hero stagger, Featured Technology counters animating on scroll, Solutions mega-menu icons.
- `/products`: product card icons.
- One solution detail page (`/solutions/airway-management`): related-products grid icons.
- One partner detail page (`/partners/ue-medical`): featured-products grid icons.
- Toggle OS "reduce motion" and reload the homepage: hero and counters should show final state instantly, no animation.

- [ ] **Step 5: Push**

```bash
git push origin main
```

(Confirm with the user before this step if any manual QA in Step 4 turned up something unexpected — this plan assumes each prior task's own commit already went through Steps 1-4 of its own verification, so this final push is the cumulative "ship it" for the whole pass, not a first check.)
