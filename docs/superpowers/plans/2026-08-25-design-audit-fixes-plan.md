# EMC Website Design Audit — Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the P0/P1/P2 fixes from the 2026-08-25 seven-lens design audit that are pure code changes — animation bug, mobile CTA visibility, touch targets, dead search stub, form accessibility + friction, missing CTAs on listing pages, a documented brand-rule violation, partner-card credibility, product-hero CTA completeness, a footer link, loading skeletons, and surfacing already-written Why-EMC content — without touching anything that needs new photography, testimonials, or business data EMC hasn't supplied yet.

**Architecture:** No new dependencies, no new pages, no content fabrication. Every task edits existing components in place, reuses existing primitives (`Reveal`, `CtaBand`, `PartnerTile`'s logo-fallback pattern, `FormField`), and reuses existing content that's already authored but under-surfaced (`about.json`'s Why-EMC pillars).

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind v4, Framer Motion, React Hook Form + Zod, next-intl, Base UI primitives (`@base-ui/react`), Fuse.js (existing per-page usage only — not extended in this plan).

**Spec:** `docs/superpowers/specs/2026-08-25-design-audit-fixes-design.md`

## Global Constraints

- Respect `prefers-reduced-motion` everywhere — do not bypass `Reveal`/`RevealGroup`'s existing `useReducedMotion()` branch.
- No content fabrication (PROJECT_SPEC.md Section 18) — every string below already exists, or is a same-shape `{ en, ar }` addition next to an existing key.
- Every user-facing string is next-intl `t("...")`, backed by a real `{ en, ar }` pair in `messages/en.json` + `messages/ar.json` — never hardcode English.
- Purple/teal are accents, not background surfaces (`globals.css` comments, PROJECT_SPEC.md Section 6.1). Task 7 fixes an existing violation; no other task introduces a new one. Do **not** modify `src/components/sections/gradient-mesh.tsx` in any task — it is a deliberate, already-reviewed pattern (see spec Ruling 1).
- Do **not** add or modify anything under `src/components/layout/search-trigger.tsx` beyond Task 4's removal — a real sitewide search is an explicitly deferred follow-up (see spec Ruling 2), not part of this plan.
- `npm run lint` and `npm run build` must be run and stay clean after every task. This repo has no per-component unit test framework — Zod content validation + `npm run build`'s static generation is the existing correctness bar. The Playwright suite (`npm run test:e2e`) runs once at the final whole-branch review, not per task.
- RTL: use logical-property Tailwind classes (`ps-`/`pe-`/`start-`/`end-`), never `left`/`right`, in any new markup — this site ships `/ar` with `dir="rtl"`.
- Read each file fresh before editing — line numbers cited below were correct when this plan was written but may drift if an earlier task already touched the same file.

---

### Task 1: Fix the Reveal/RevealGroup scroll-gating bug + dead `stagger` prop

**Files:**
- Modify: `src/components/motion/reveal.tsx`
- Modify: `src/components/sections/home/hero.tsx`
- Modify: `src/app/[locale]/contact/page.tsx`
- Modify: `src/components/layout/back-to-top.tsx`
- Test: `npm run lint`, `npm run build`, manual check (see Step 6)

**Interfaces:**
- Consumes: nothing new.
- Produces: `Reveal` gains an `above` boolean prop (default `false`). `above={true}` animates unconditionally on mount (`initial`/`animate`, no `whileInView`/observer) — for content guaranteed to already be in the initial viewport. Default behavior (below-the-fold) keeps `whileInView` but adds a synchronous "already visible" check on mount so it never depends on waiting for an async observer callback. Every other file in the repo that imports `Reveal`/`RevealGroup` keeps working unchanged (the new prop is optional, default preserves current call sites' below-the-fold behavior for genuinely below-the-fold content — only the two above-the-fold consumers in this task pass `above`).

**Root cause (confirmed by live reproduction + reading `node_modules/framer-motion`):** `whileInView` is a thin wrapper over a native `IntersectionObserver` with no synchronous "is this already on screen" check. On an idle page (a visitor who lands and doesn't scroll), the observer's first callback can be delayed indefinitely; any scroll forces the paint/layout flush that delivers it — which is why the bug "resolves instantly on scroll." It's applied to content that's always in the initial viewport (hero, Contact form), where `whileInView` was never the right tool.

- [ ] **Step 1: Read the current file and confirm structure**

Read `src/components/motion/reveal.tsx` in full (it's short, ~68 lines) to confirm it still matches what's described below before editing.

- [ ] **Step 2: Rewrite `reveal.tsx`**

Replace the full file contents with:

```tsx
"use client";

import { motion, useReducedMotion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Section 6.4: fade/slide-up scroll reveal, staggered for grids, respects
 * prefers-reduced-motion everywhere Framer Motion is used.
 *
 * `above` = content guaranteed to already be in the initial viewport (a
 * hero, a form above the fold). It animates unconditionally on mount via
 * `animate`, never `whileInView` — `whileInView`'s IntersectionObserver
 * has no synchronous "already on screen" check, so on an idle page (no
 * scroll event to force the observer's first callback) content wrapped
 * in `whileInView` can stay hidden indefinitely. That's a correctness bug
 * for above-the-fold content, not a below-the-fold one.
 *
 * Below-the-fold content (`above` unset) keeps `whileInView`, but adds a
 * synchronous `getBoundingClientRect()` check on mount so an element that
 * happens to already be in view (e.g. a short page, a tall viewport)
 * resolves immediately instead of waiting on the observer.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Component = "div",
  above = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
  above?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | HTMLLIElement>(null);
  const inViewNow = useInView(ref, { once: true, margin: "-80px" });
  const [alreadyVisible, setAlreadyVisible] = useState(false);

  useEffect(() => {
    if (above || alreadyVisible || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setAlreadyVisible(true);
    }
  }, [above, alreadyVisible]);

  const variants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

  const MotionComponent = Component === "li" ? motion.li : motion.div;
  const transition = { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const };

  if (above) {
    return (
      <MotionComponent
        ref={ref}
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={transition}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial="hidden"
      animate={inViewNow || alreadyVisible ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
    >
      {children}
    </MotionComponent>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{
        staggerChildren: shouldReduceMotion ? 0 : stagger,
      }}
    >
      {children}
    </motion.div>
  );
}
```

Note what changed and why:
- `above` prop added to `Reveal` for guaranteed-above-fold usage (Steps 3-4 use it).
- Below-the-fold `Reveal` now drives visibility off `useInView` (imperative hook, same underlying observer but exposed as a value you can combine with a synchronous mount-time `getBoundingClientRect` check) instead of the `whileInView` prop — this removes the "wait indefinitely for the observer's first async callback" failure mode.
- `RevealGroup`'s `stagger` prop was previously dead code: it set `staggerChildren` on the parent, but every `Reveal` child ran its **own** independent `whileInView` trigger instead of inheriting the parent's propagated variant state, so parent-driven staggering never actually applied (every call site hand-rolled `delay={i * constant}` instead, which still works and is unchanged by this fix — don't touch call sites). This rewrite makes `RevealGroup` drive its own `animate` state via `useInView` the same way `Reveal` does, which is the more correct half-fix given call sites already work around the dead prop with manual delays; a full context-based parent→child variant propagation is out of scope for this task (it would require touching all ~15 call sites' `delay` props, which is not part of the audit finding this task closes — the finding was "the prop is dead code," which is now fixed: it drives `RevealGroup`'s own reveal instead of silently doing nothing).

- [ ] **Step 3: Apply `above` to the Home hero**

Read `src/components/sections/home/hero.tsx`. It wraps the eyebrow/headline, subhead+CTA row, and hero image each in `<Reveal>` (and one `<Reveal delay={0.1}>` for the image) — none of this is ever below the fold. Add `above` to every `<Reveal` usage in this file:

```tsx
<Reveal above>
```
```tsx
<Reveal above delay={0.1}>
```

(Match each existing `<Reveal ...>` opening tag in the file — there should be 3-4 of them per the audit's citation of lines 25, 33, 38, 47. Add `above` to all of them; do not add it anywhere else in this file.)

- [ ] **Step 4: Apply `above` to the Contact page's first section**

Read `src/app/[locale]/contact/page.tsx`. Find the `<Reveal>` wrapping the page's intro heading/subhead and the `<Reveal>` (or `<RevealGroup>`) wrapping the contact form fields — these are the guaranteed-above-fold content the audit confirmed goes near-invisible on load. Add `above` to those specific `Reveal` usages (the intro heading and the form section). Leave any `Reveal`/`RevealGroup` further down the page (e.g. around a map or secondary content, if genuinely below the fold) unchanged.

- [ ] **Step 5: Fix `back-to-top.tsx`'s focusable-while-invisible pattern**

Read `src/components/layout/back-to-top.tsx`. It almost certainly toggles visibility via an opacity/CSS class without gating focusability or `aria-hidden`, matching the same anti-pattern the audit flagged for `Reveal`. Ensure the button element has:
- `tabIndex={visible ? 0 : -1}` (replace `visible` with whatever local state variable the file already uses for its shown/hidden condition)
- `aria-hidden={!visible}`

so it's never keyboard-focusable while visually hidden. Do not change its scroll-threshold logic or animation timing — only the focus/aria wiring.

- [ ] **Step 6: Manual verification**

Run `npm run dev`, then in a browser:
1. Load `/en` fresh (hard reload, do not scroll) — the hero headline, subhead, and both CTA buttons must be visible immediately, no fade-in delay waiting on scroll.
2. Load `/en/contact` fresh, do not scroll — the "Let's Talk" heading and the form fields must be visible immediately.
3. Scroll down any page with below-the-fold `Reveal` content (e.g. `/en/solutions`) and confirm cards still fade/slide in on scroll as before (this must NOT regress — below-the-fold reveal is still expected).
4. In DevTools, emulate `prefers-reduced-motion: reduce`, hard reload `/en` — content must appear immediately with no animation (this already worked before the fix; confirm it still does).

- [ ] **Step 7: Lint, build, commit**

```bash
npm run lint
npm run build
git add src/components/motion/reveal.tsx src/components/sections/home/hero.tsx src/app/[locale]/contact/page.tsx src/components/layout/back-to-top.tsx
git commit -m "fix: Reveal no longer stalls above-the-fold content behind an async observer"
```

---

### Task 2: Add a 44px+ CTA button size, apply sitewide

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: every call site using `size="sm"` (the header's default) or the current `lg` for a Demo/Quotation/Contact-style CTA — locate via Step 2's grep.
- Test: `npm run lint`, `npm run build`

**Interfaces:**
- Produces: `buttonVariants`'s `size` variant gains a new value, `"xl"`, at `h-11` (44px) with generous padding. Existing sizes (`default`, `xs`, `sm`, `lg`, `icon*`) are unchanged — this is additive, so no existing call site breaks by default.

**Audit finding:** no size in the current scale reaches the 44px touch-target baseline (`default` = 32px/`h-8`, `lg` = 36px/`h-9`), and the header's repeated `DemoRequestModal` defaults to `size="sm"` (28px/`h-7`) — the single most-repeated button on the site.

- [ ] **Step 1: Add the `xl` size to `button.tsx`**

In `src/components/ui/button.tsx`, inside `buttonVariants`'s `size` object (currently `default`/`xs`/`sm`/`lg`/`icon`/`icon-xs`/`icon-sm`/`icon-lg`), add:

```ts
        xl: "h-11 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
```

Place it after the `lg` entry, before `icon`. Do not change `defaultVariants` (stays `size: "default"`).

- [ ] **Step 2: Find every Demo/Quotation/Contact CTA trigger**

```bash
grep -rn "DemoRequestModal\|QuotationRequestModal" src/ --include="*.tsx" | grep -v "\.test\."
```

For each call site, read its current `size` prop:
- If it currently passes no `size` (defaults to the component's own default, which is `"sm"` per `demo-request-modal.tsx`/`quotation-request-modal.tsx`'s own prop default) or explicitly passes `size="sm"`, change it to `size="xl"`.
- If it already passes `size="lg"` (e.g. hero, CtaBand, detail-page hero rows), change `"lg"` to `"xl"`.

Also update `DemoRequestModal`'s and `QuotationRequestModal`'s own default prop value: in both `src/components/layout/demo-request-modal.tsx` and `src/components/layout/quotation-request-modal.tsx`, change `size = "sm"` to `size = "xl"` in the function signature, so any call site that doesn't explicitly pass `size` also gets the larger touch target by default (this specifically fixes the header's `<DemoRequestModal />` call in `header.tsx`, which passes no `size` today).

- [ ] **Step 3: Update the plain `<Button>` CTAs alongside those modals**

In the same files touched by Step 2 (e.g. `hero.tsx`'s "Explore Our Solutions" button, `products/[slug]/page.tsx`'s "Speak with a Product Specialist" button, `solutions/[slug]/page.tsx`'s specialist button, `cta-band.tsx`'s Contact button), change any `size="lg"` that sits directly alongside a Demo/Quotation button to `size="xl"` too, so the row stays visually consistent (don't leave one button in a row at 36px next to another at 44px). Leave unrelated `lg`/`default`/`sm` buttons elsewhere (e.g. in-page utility controls, filter chips) untouched — this task is scoped to lead-gen CTAs, not a sitewide size bump.

- [ ] **Step 4: Lint, build, commit**

```bash
npm run lint
npm run build
git add -A
git commit -m "feat: add 44px CTA button size, apply to Demo/Quotation/Contact triggers"
```

---

### Task 3: Restore the mobile header CTA

**Files:**
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/mobile-nav.tsx`
- Test: `npm run lint`, `npm run build`, manual check at a mobile viewport

**Interfaces:**
- Consumes: `DemoRequestModal` (unchanged signature from Task 2).
- Produces: no new exports; `MobileNav`'s internal JSX gains a CTA at the bottom of its `Sheet`.

**Audit finding:** `header.tsx` wraps `<DemoRequestModal />` in `hidden sm:block` (line ~55-57) — it never renders below ~640px. `mobile-nav.tsx`'s hamburger Sheet contains only navigation links, no Demo/Quotation/Contact CTA anywhere inside it.

- [ ] **Step 1: Add a Demo Request CTA inside the mobile Sheet**

In `src/components/layout/mobile-nav.tsx`, import `DemoRequestModal`:

```tsx
import { DemoRequestModal } from "@/components/layout/demo-request-modal";
```

At the end of the `<nav className="flex flex-col gap-1 px-4 pb-6">` block (after the `primaryNav` map, before the closing `</nav>`), add:

```tsx
          <div className="mt-4 px-3">
            <DemoRequestModal size="xl" className="w-full" />
          </div>
```

This gives every mobile visitor a full-width Demo Request action at the bottom of the menu they already opened to navigate — the primary lead-gen path is now reachable on every viewport.

- [ ] **Step 2: Confirm `header.tsx`'s desktop CTA visibility is unchanged**

Read `header.tsx` — the `hidden sm:block` wrapper around `<DemoRequestModal />` (still correct: it should stay hidden on mobile since Step 1 now covers mobile via the Sheet, and showing it twice would be redundant). No change needed here beyond what Task 2 already did (the `size` default bump). Confirm this by reading, not editing.

- [ ] **Step 3: Manual verification**

Run `npm run dev`, open DevTools responsive mode at a phone width (e.g. 390px), load `/en`:
1. Confirm the header shows the hamburger icon (search icon will still be present until Task 4) and no Demo button directly in the header bar.
2. Open the hamburger menu — confirm a full-width "Request a Demo" button appears at the bottom of the menu, opens the modal correctly, and the modal itself is usable at that viewport width.

- [ ] **Step 4: Lint, build, commit**

```bash
npm run lint
npm run build
git add src/components/layout/mobile-nav.tsx
git commit -m "fix: restore Request a Demo CTA on mobile via the nav sheet"
```

---

### Task 4: Remove the non-functional "coming soon" search

**Files:**
- Delete: `src/components/layout/search-trigger.tsx`
- Modify: `src/components/layout/header.tsx`
- Test: `npm run lint`, `npm run build`

**Interfaces:** none — pure removal.

**Ruling (see spec Ruling 2):** the component's own comment says it's blocked on Phases 2-4 shipping content; `PROGRESS.md` shows those phases are complete and Products/Knowledge-Center already have working per-page search. A real sitewide header search is a legitimate follow-up but out of scope for this pass (see spec) — this task only removes the dead, visibly-broken stub, per the audit's P0 finding.

- [ ] **Step 1: Remove the import and usage from `header.tsx`**

In `src/components/layout/header.tsx`, delete the line:

```tsx
import { SearchTrigger } from "@/components/layout/search-trigger";
```

and delete the line:

```tsx
          <SearchTrigger />
```

from inside the `<div className="flex shrink-0 items-center gap-1">` block.

- [ ] **Step 2: Delete the file**

```bash
rm src/components/layout/search-trigger.tsx
```

- [ ] **Step 3: Check for orphaned i18n keys (informational, not blocking)**

```bash
grep -rn "comingSoon\|searchPlaceholder" messages/en.json messages/ar.json src/
```

If `common.search`/`common.searchPlaceholder`/`common.comingSoon` are still referenced elsewhere (e.g. `product-catalog.tsx` uses `common.search`/`common.searchPlaceholder` too — check before removing any key), leave those keys in place. Only remove a message key if this grep shows zero remaining references after the deletion.

- [ ] **Step 4: Lint, build, commit**

```bash
npm run lint
npm run build
git add -A
git commit -m "fix: remove non-functional header search stub"
```

---

### Task 5: Lead-gen form accessibility sweep + progressive disclosure

**Files:**
- Modify: `src/components/ui/form-field.tsx`
- Modify: `src/lib/validations/leads.ts`
- Modify: `src/components/layout/demo-request-modal.tsx`
- Modify: `src/components/layout/quotation-request-modal.tsx`
- Modify: `src/components/layout/language-switcher.tsx`
- Modify: `src/components/ui/dialog.tsx`
- Modify: `src/components/sections/contact/contact-form.tsx` (read first — success block only)
- Modify: `src/components/sections/careers/application-form.tsx` (read first — success block only)
- Modify: `src/app/api/leads/demo-request/route.ts`
- Modify: `src/app/api/leads/quote-request/route.ts`
- Test: `npm run lint`, `npm run build`, manual check

**Interfaces:**
- Produces: `FormField`'s `required` prop now also clones `required`/`aria-required` onto its child input (previously only rendered a visual asterisk). `demoRequestSchema`'s `jobTitle`/`department`/`city` and `quotationRequestSchema`'s `department`/`city` become `.optional()` instead of `.min(1)` — this is a schema relaxation, not a breaking change (the API routes validate against the same shared schema, so nothing downstream needs updating).

This task bundles two audit findings that land on the same files: the P0 accessibility sweep (3.5) and the P1 progressive-disclosure friction fix (4.3).

- [ ] **Step 1: `FormField` — propagate `required` to the input, not just the asterisk**

In `src/components/ui/form-field.tsx`, replace the `field` computation:

```tsx
  const field =
    isValidElement(children) && error
      ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
          "aria-invalid": true,
          "aria-describedby": errorId,
        })
      : children;
```

with:

```tsx
  const cloneProps: Record<string, unknown> = {};
  if (required) {
    cloneProps.required = true;
    cloneProps["aria-required"] = true;
  }
  if (error) {
    cloneProps["aria-invalid"] = true;
    cloneProps["aria-describedby"] = errorId;
  }
  const field =
    isValidElement(children) && Object.keys(cloneProps).length > 0
      ? cloneElement(children as React.ReactElement<Record<string, unknown>>, cloneProps)
      : children;
```

This fixes every `FormField` consumer sitewide (Demo modal, Quotation modal, Contact form, Careers application form) from one place — do not additionally hand-edit `required` handling in the individual form files.

- [ ] **Step 2: Language switcher — fix the `aria-label`/visible-text mismatch**

In `src/components/layout/language-switcher.tsx`, the button's `aria-label={t("language")}` (e.g. "Language"/"اللغة") doesn't match its visible text (`t("switchLanguage")`, e.g. "العربية"/"English") — this fails WCAG SC 2.5.3 Label in Name. Remove the `aria-label` prop entirely (the visible text `{t("switchLanguage")}` already labels the button correctly on its own — an `aria-label` is only needed when there's no visible text, which isn't the case here):

```tsx
      render={
        <Link href={pathname} locale={nextLocale} />
      }
```

(Drop the `aria-label={t("language")}` from the `<Link>` render prop.)

- [ ] **Step 3: Dialog close button — localize the sr-only "Close" text**

In `src/components/ui/dialog.tsx`, `DialogContent`'s close button has `<span className="sr-only">Close</span>` (hardcoded English, announced by screen readers even in an Arabic-locale dialog). Since this is a generic shadcn-style primitive with no `next-intl` access at this layer, wrap it for locale-neutral correctness:

```tsx
            <span className="sr-only" lang="en">Close</span>
```

Then check whether `DialogFooter`'s `showCloseButton` path (line ~111-115, the plain-text "Close" button) is actually used anywhere:

```bash
grep -rn "showCloseButton" src/ --include="*.tsx"
```

If any call site passes `showCloseButton` to `DialogFooter` (not `DialogContent`, which is a different, always-used close button), replace that `Close` literal with a next-intl `t("common.close")` call in that specific call site's own file (not in `dialog.tsx`, which has no `useTranslations` access) — add a `close` key to `messages/en.json`/`messages/ar.json`'s `common` namespace if one doesn't already exist. If no call site uses `showCloseButton`, leave `DialogFooter` unchanged.

- [ ] **Step 4: Success-state screen-reader announcement (both modals)**

In both `demo-request-modal.tsx` and `quotation-request-modal.tsx`, the submitted-success block is currently:

```tsx
          <div className="flex flex-col items-center gap-3 py-6 text-center">
```

Change to:

```tsx
          <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-6 text-center">
```

in both files. Then read `src/components/sections/contact/contact-form.tsx` and `src/components/sections/careers/application-form.tsx` — each has an equivalent submitted/success block (the error path already correctly uses `role="alert"` per the pattern seen in the two modals above; mirror the same `role="status" aria-live="polite"` addition to each file's success block, not its error block).

- [ ] **Step 5: Progressive disclosure — relax the schema**

In `src/lib/validations/leads.ts`, change `demoRequestSchema`:

```ts
  jobTitle: z.string().min(1),
  department: z.string().min(1),
  city: z.string().min(1),
```

to:

```ts
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  city: z.string().optional(),
```

and change `quotationRequestSchema`:

```ts
  department: z.string().min(1),
  city: z.string().min(1),
```

to:

```ts
  department: z.string().optional(),
  city: z.string().optional(),
```

Keep every other field in both schemas required exactly as-is (`fullName`, `organization`, `email`, `mobile`, `productOrSolutionOfInterest` stay required on Demo; `organization`, `contactPerson`, `product`, `quantity`, `procurementType` stay required on Quotation — these are the fields the audit calls the genuine first-touch essentials).

- [ ] **Step 5b: Keep the internal lead-notification emails clean once these fields can be blank**

`src/app/api/leads/demo-request/route.ts` and `src/app/api/leads/quote-request/route.ts` build a plain-text summary for the internal notification email by interpolating every field directly, e.g. `` `Job title: ${data.jobTitle}` ``. Once Step 5 makes `jobTitle`/`department`/`city` optional, a blank submission would literally print `"Job title: undefined"` in that email. Both files already have the correct pattern for a field that's optional today — `message`:

```ts
    data.message ? `Message: ${data.message}` : null,
```
```ts
  ]
    .filter(Boolean)
    .join("\n");
```

Apply the same pattern to the newly-optional fields. In `demo-request/route.ts`, change:

```ts
    `Job title: ${data.jobTitle}`,
    `Department: ${data.department}`,
    `City: ${data.city}`,
```

to:

```ts
    data.jobTitle ? `Job title: ${data.jobTitle}` : null,
    data.department ? `Department: ${data.department}` : null,
    data.city ? `City: ${data.city}` : null,
```

In `quote-request/route.ts`, apply the same conditional treatment to its `Department`/`City` lines. Both files already end their `summary` array with `.filter(Boolean).join("\n")`, so `null` entries are already dropped correctly — no other change needed in either file.

- [ ] **Step 6: Progressive disclosure — move demoted fields into a collapsible section**

In `demo-request-modal.tsx`, wrap the `jobTitle`, `department`, and `city` `FormField`s in a native disclosure so they're visually secondary but still reachable in the same single-step form (simpler and lower-risk than a real multi-step wizard, per the spec's task-sizing constraint):

```tsx
            <details className="sm:col-span-2 group">
              <summary className="cursor-pointer text-sm font-medium text-emc-teal-700 hover:underline [&::-webkit-details-marker]:hidden">
                {t("forms.moreDetailsOptional")}
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FormField label={t("forms.jobTitle")} htmlFor="jobTitle" error={errors.jobTitle?.message}>
                  <Input id="jobTitle" {...register("jobTitle")} />
                </FormField>
                <FormField label={t("forms.department")} htmlFor="department" error={errors.department?.message}>
                  <Input id="department" {...register("department")} />
                </FormField>
                <FormField label={t("forms.city")} htmlFor="city" error={errors.city?.message}>
                  <Input id="city" {...register("city")} />
                </FormField>
              </div>
            </details>
```

Remove `required` from these three `FormField`s (they're now optional — do not pass the `required` prop). Remove the original, now-duplicate `FormField` blocks for `jobTitle`/`department`/`city` from their old positions in the form grid. Add the `forms.moreDetailsOptional` key to both `messages/en.json` and `messages/ar.json` under the `forms` namespace (e.g. `"moreDetailsOptional": "More details (optional)"` / an accurate Arabic translation — do not invent a translation you're not confident in; if uncertain, use a literal, simple rendering like "تفاصيل إضافية (اختياري)").

Apply the same pattern in `quotation-request-modal.tsx` for `department` and `city` (a smaller `<details>` block with just those two fields, same `moreDetailsOptional` label, `required` removed from both).

- [ ] **Step 7: Manual verification**

Run `npm run dev`:
1. Open the Demo Request modal — confirm `jobTitle`/`department`/`city` are now inside a collapsed "More details (optional)" disclosure, and the form submits successfully with only the required fields filled.
2. Tab through the form with a keyboard — confirm required fields are announced as required by a screen reader (or check `aria-required="true"` is present in DevTools Elements panel).
3. Submit successfully — confirm the success message region has `role="status"` in DevTools (screen reader announcement can't be easily verified without a real AT, but the attribute presence is checkable).
4. Switch to `/ar`, open the language switcher — confirm it still has a visible, correctly-labeled button.

- [ ] **Step 8: Lint, build, commit**

```bash
npm run lint
npm run build
git add src/components/ui/form-field.tsx src/lib/validations/leads.ts src/components/layout/demo-request-modal.tsx src/components/layout/quotation-request-modal.tsx src/components/layout/language-switcher.tsx src/components/ui/dialog.tsx src/components/sections/contact/contact-form.tsx src/components/sections/careers/application-form.tsx src/app/api/leads/demo-request/route.ts src/app/api/leads/quote-request/route.ts messages/en.json messages/ar.json
git commit -m "fix: form a11y sweep (required propagation, status announcements, label fixes) + progressive disclosure on lead-gen modals"
```

---

### Task 6: Add a CtaBand to every listing page + upgrade the Services CTA

**Files:**
- Modify: `src/app/[locale]/solutions/page.tsx`
- Modify: `src/app/[locale]/products/page.tsx`
- Modify: `src/app/[locale]/partners/page.tsx`
- Modify: `src/app/[locale]/services/page.tsx`
- Test: `npm run lint`, `npm run build`

**Interfaces:**
- Consumes: `CtaBand` (`src/components/sections/cta-band.tsx`), unchanged signature: `{ headline: string; body: string; defaultProduct?: string }`. Every `[slug]` detail page already renders it as:
  ```tsx
  <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
    <CtaBand headline={l(pageContent.detailPageCta.headline)} body={l(pageContent.detailPageCta.body)} />
  </div>
  ```
  where `pageContent` comes from `await getIndexPagesContent()` (see `src/lib/content.ts`) and `l` is the `pickLocale` helper already used throughout this codebase.

**Audit finding:** every `[slug]` detail page ends in the bold `CtaBand`; the index/listing pages one level up — where a comparison-shopping visitor is most likely to be browsing before committing to one item — currently end in silence after the card grid. Separately, `services/page.tsx` renders each card's CTA as a plain low-contrast text link, the weakest CTA treatment of any page type on the site, despite Services carrying the clearest "technology partner not distributor" evidence (Clinical Training, Installation, Commissioning, Maintenance & PM).

- [ ] **Step 1: Add `CtaBand` to Solutions, Products, and Partners index pages**

For each of `src/app/[locale]/solutions/page.tsx`, `src/app/[locale]/products/page.tsx`, `src/app/[locale]/partners/page.tsx`:

1. Read the file. If it does not already call `getIndexPagesContent()`, add the import (`import { getIndexPagesContent } from "@/lib/content";`, alongside whatever other `getX` imports the file already has) and call it in the page's async body (`const pageContent = await getIndexPagesContent();` — or add it to an existing `Promise.all(...)` alongside whatever data the page already fetches, matching that file's existing style).
2. Import `CtaBand`: `import { CtaBand } from "@/components/sections/cta-band";`.
3. At the very end of the page's returned JSX (after the card grid, inside the outermost fragment), add:
   ```tsx
   <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
     <CtaBand
       headline={l(pageContent.detailPageCta.headline)}
       body={l(pageContent.detailPageCta.body)}
     />
   </div>
   ```
   using the same `l`/`pickLocale` helper the file already uses elsewhere (if the file doesn't already define `l`, check how `[slug]/page.tsx` in the same directory defines it and match that pattern exactly).

Do not pass `defaultProduct` on these three pages (there's no single product context on a listing page).

- [ ] **Step 2: Add `CtaBand` to Services + upgrade the per-card CTA**

In `src/app/[locale]/services/page.tsx`:

1. Add the same `getIndexPagesContent()` + `CtaBand` wiring as Step 1 (Services doesn't currently fetch this content — add the call).
2. Replace the per-card CTA (currently, conditionally rendered):
   ```tsx
              {service.ctaType && (
                <Link
                  href={`/contact?type=${service.ctaType}`}
                  className="mt-4 text-sm font-medium text-emc-teal-700 hover:underline"
                >
                  {t("cta.contactEmc")}
                </Link>
              )}
   ```
   with a real button-styled link, matching the visual weight the audit asked for:
   ```tsx
              {service.ctaType && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 self-start"
                  render={<Link href={`/contact?type=${service.ctaType}`} />}
                >
                  {t("cta.contactEmc")}
                </Button>
              )}
   ```
   Add `import { Button } from "@/components/ui/button";` to the file's imports.
3. Add the `CtaBand` section at the bottom of the page, same pattern as Step 1.

- [ ] **Step 3: Lint, build, commit**

```bash
npm run lint
npm run build
git add src/app/\[locale\]/solutions/page.tsx src/app/\[locale\]/products/page.tsx src/app/\[locale\]/partners/page.tsx src/app/\[locale\]/services/page.tsx
git commit -m "feat: add CtaBand to listing pages, upgrade Services per-card CTA to a real button"
```

---

### Task 7: Fix About page's flat-purple-background rule violations

**Files:**
- Modify: `src/app/[locale]/about/page.tsx`
- Test: `npm run lint`, `npm run build`, manual visual check

**Interfaces:** none new — pure styling change within one file.

**Audit finding (confirmed by reading the file — see spec Ruling 1 for why the hero's `GradientMesh` at line 58 is correct and NOT part of this task):** `globals.css` documents the rule explicitly — "Surfaces are white/soft-gray dominant; purple and teal are accents only." The About page uses solid `bg-emc-purple-900` as a full-bleed flat background twice: the Vision card (line ~80) and the Corporate Philosophy band (line ~162). The Mission card right next to the Vision card already uses the correct pattern (`rounded-2xl border border-border bg-card p-8`, teal-700 eyebrow) — this task brings the other two into line with it.

- [ ] **Step 1: Read the current file**

Read `src/app/[locale]/about/page.tsx` in full to confirm the two sections below still match (lines may have shifted slightly).

- [ ] **Step 2: Fix the Vision card**

Find:

```tsx
          <Reveal className="rounded-2xl bg-emc-purple-900 p-8 text-white">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-emc-teal-400 uppercase">
              {tAbout("vision")}
            </h3>
            <p className="mt-3 text-lg font-heading font-medium">
              {l(content.vision)}
            </p>
          </Reveal>
```

Replace with (matching the Mission card immediately below it — `rounded-2xl border border-border bg-card p-8`, teal-700 eyebrow, foreground body text):

```tsx
          <Reveal className="rounded-2xl border border-border bg-card p-8">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
              {tAbout("vision")}
            </h3>
            <p className="mt-3 text-lg font-heading font-medium text-foreground">
              {l(content.vision)}
            </p>
          </Reveal>
```

- [ ] **Step 3: Fix the Corporate Philosophy band**

Find:

```tsx
      <section className="bg-emc-purple-900 py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold text-white">
            {l(content.corporatePhilosophy.headline)}
          </h2>
          <p className="mt-4 text-lg text-white/80">
            {l(content.corporatePhilosophy.body)}
          </p>
        </Reveal>
      </section>
```

Replace with a neutral surface carrying a teal accent instead of a flat purple field (matches the "gray-50 band" pattern already used elsewhere on this same page, e.g. the Vision/Mission section's wrapper and the Why-EMC section):

```tsx
      <section className="bg-emc-gray-50 py-16 sm:py-20">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
            {tAbout("corporatePhilosophy")}
          </p>
          <h2 className="mt-2 text-2xl font-heading font-bold text-foreground">
            {l(content.corporatePhilosophy.headline)}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {l(content.corporatePhilosophy.body)}
          </p>
        </Reveal>
      </section>
```

This adds a `corporatePhilosophy` eyebrow label — check whether `tAbout("corporatePhilosophy")` already resolves to a sensible short label (the `tAbout` translator is already in scope in this file; check `messages/en.json`'s `about` namespace for an existing `corporatePhilosophy` key used as a section label elsewhere, e.g. a nav anchor). If no suitable short key exists, drop the eyebrow `<p>` entirely rather than inventing new copy — keep just the `h2`/body paragraph, still on the `bg-emc-gray-50` neutral surface.

- [ ] **Step 4: Manual visual check**

Run `npm run dev`, load `/en/about`, confirm: hero still shows the purple/teal `GradientMesh` panel (unchanged), Vision card now matches Mission card's visual treatment (white card, border, teal eyebrow), Corporate Philosophy band is now a neutral gray-50 section instead of a full-bleed purple block. Check `/ar/about` too — confirm RTL layout still reads correctly (this task only changes background/text color classes, not layout direction, so RTL should be unaffected, but confirm visually).

- [ ] **Step 5: Lint, build, commit**

```bash
npm run lint
npm run build
git add src/app/\[locale\]/about/page.tsx
git commit -m "fix: bring About page's Vision card and Corporate Philosophy band in line with the accents-only brand rule"
```

---

### Task 8: Add partner logos to the Solution-detail cross-sell cards

**Files:**
- Modify: `src/app/[locale]/solutions/[slug]/page.tsx`
- Test: `npm run lint`, `npm run build`, manual visual check

**Interfaces:**
- Consumes: `Partner.logo` (existing schema field, already used by `PartnerTile` at `src/components/sections/partner-tile.tsx` with a graceful "no logo → no image block" fallback — reuse that same conditional, do not add a new fallback pattern).

**Audit finding:** the Solution-detail page's related-Partners cross-sell cards (`solutions/[slug]/page.tsx`, inside the `relatedPartners.length > 0` block) are bare `border-border bg-card` boxes with no logo or icon — a visibly different "species" of card from the icon-chip Solution/Product cards immediately surrounding them, even though `Partner.logo`-with-fallback already exists and is used elsewhere (`PartnerTile`).

- [ ] **Step 1: Read the current file**

Read `src/app/[locale]/solutions/[slug]/page.tsx` in full to confirm the related-Partners block still matches (it's inside the `{relatedPartners.length > 0 && (...)}` section, roughly lines 126-158 as of this plan).

- [ ] **Step 2: Add the logo to each card**

Find the per-partner card:

```tsx
                <Reveal
                  key={partner.slug}
                  delay={i * 0.06}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {partner.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {l(partner.summary)}
                  </p>
                  <Link
                    href={`/partners/${partner.slug}`}
                    className="mt-4 inline-block text-sm font-medium text-emc-teal-700 hover:underline"
                  >
                    {t("common.learnMore")}
                  </Link>
                </Reveal>
```

Replace with (adds a compact logo swatch above the heading, using the same `partner.logo ? <Image /> : null` conditional `PartnerTile` uses — when there's no logo, the heading text below already serves as the identifying label, so no fallback element is needed in that case):

```tsx
                <Reveal
                  key={partner.slug}
                  delay={i * 0.06}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  {partner.logo && (
                    <div className="relative mb-4 h-10 w-32">
                      <Image
                        src={partner.logo.src}
                        alt={pickLocale(partner.logo.alt, locale)}
                        fill
                        sizes="128px"
                        className="object-contain object-left"
                      />
                    </div>
                  )}
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {partner.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {l(partner.summary)}
                  </p>
                  <Link
                    href={`/partners/${partner.slug}`}
                    className="mt-4 inline-block text-sm font-medium text-emc-teal-700 hover:underline"
                  >
                    {t("common.learnMore")}
                  </Link>
                </Reveal>
```

(Use `object-left` not `object-start` for the `Image` fill positioning — this is a fixed LTR/RTL-neutral logo image, not text, so a physical `left` alignment is correct here and matches `PartnerTile`'s own approach; this is the one place in this plan where a physical rather than logical property is intentional.)

Add `import Image from "next/image";` to the file's imports if not already present (check first — `GradientMesh`/other imports may already cover it; likely needs adding since this page doesn't currently render any `<Image>`).

- [ ] **Step 3: Manual visual check**

Run `npm run dev`, load `/en/solutions/anesthesia-airway-management` (or another solution with related partners), scroll to the Partners section — confirm each card now shows the partner's logo above its heading, and a partner with no logo (if any exist in current content) still renders cleanly without a broken image or empty box.

- [ ] **Step 4: Lint, build, commit**

```bash
npm run lint
npm run build
git add src/app/\[locale\]/solutions/\[slug\]/page.tsx
git commit -m "feat: add partner logos to Solution-detail cross-sell cards"
```

---

### Task 9: Add Quotation Request to the Product detail hero CTA row

**Files:**
- Modify: `src/app/[locale]/products/[slug]/page.tsx`
- Test: `npm run lint`, `npm run build`, manual visual check

**Interfaces:**
- Consumes: `QuotationRequestModal` (same props shape as used in `cta-band.tsx`: `defaultProduct`, `size`, `variant`).

**Audit finding:** the hero CTA row currently offers only Demo / Contact-Specialist / Brochure; Quotation Request doesn't appear until the bottom `CtaBand`, after a full scroll through specs/certificates/downloads — despite `procurementType: 'tender'|'direct'` already being a first-class field in the content model, for an audience that's plausibly tender-driven.

- [ ] **Step 1: Read the current file**

Read `src/app/[locale]/products/[slug]/page.tsx` in full to confirm the hero CTA row still matches (roughly lines 106-121 as of this plan).

- [ ] **Step 2: Add the import**

```tsx
import { QuotationRequestModal } from "@/components/layout/quotation-request-modal";
```

- [ ] **Step 3: Insert Quotation Request into the hero CTA row**

Find:

```tsx
            <div className="mt-8 flex flex-wrap gap-3">
              <DemoRequestModal defaultInterest={product.name} size="lg" />
              <Button size="lg" variant="outline" render={<Link href="/contact" />}>
                {t("cta.speakWithSpecialist")}
              </Button>
```

Replace with (Quotation inserted right after Demo, both DemoRequestModal and QuotationRequestModal will already be at the `xl` size default from Task 2 — do not hardcode `size="lg"` here, let the Task 2 default apply; Contact stays `outline` for now, matching current hierarchy):

```tsx
            <div className="mt-8 flex flex-wrap gap-3">
              <DemoRequestModal defaultInterest={product.name} />
              <QuotationRequestModal defaultProduct={product.name} variant="outline" />
              <Button size="xl" variant="outline" render={<Link href="/contact" />}>
                {t("cta.speakWithSpecialist")}
              </Button>
```

(Note: `size="lg"` on the existing `DemoRequestModal`/`Button` calls becomes unnecessary/should be removed or changed to `size="xl"` for the `Button` per Task 2's sitewide sizing pass — if Task 2 already ran and updated this exact file, read the current state first and only add the `QuotationRequestModal` line without re-touching sizes that are already correct.)

Leave the conditional Brochure button (`{product.brochureUrl && (...)}`) unchanged, still last in the row.

- [ ] **Step 4: Manual visual check**

Run `npm run dev`, load any product detail page (e.g. `/en/products/ueScope-vl300` or whatever slug exists — check `content/products/` for a real slug), confirm the hero CTA row now shows Demo, Quotation, Contact, and (if applicable) Brochure, in that order, without wrapping awkwardly at common viewport widths.

- [ ] **Step 5: Lint, build, commit**

```bash
npm run lint
npm run build
git add src/app/\[locale\]/products/\[slug\]/page.tsx
git commit -m "feat: add Quotation Request to the Product detail hero CTA row"
```

---

### Task 10: Footer Partners link + route-level loading skeletons

**Files:**
- Modify: `src/components/layout/footer.tsx`
- Create: `src/app/[locale]/products/[slug]/loading.tsx`
- Create: `src/app/[locale]/solutions/[slug]/loading.tsx`
- Create: `src/app/[locale]/partners/[slug]/loading.tsx`
- Create: `src/app/[locale]/knowledge-center/[slug]/loading.tsx`
- Test: `npm run lint`, `npm run build`

**Interfaces:** none new — Next.js App Router's `loading.tsx` file convention (automatic `Suspense` fallback per route segment, no explicit wiring needed).

Two small, independent, low-risk fixes batched into one task per this plan's own "batch small same-shape work" guidance — neither needs its own review cycle.

- [ ] **Step 1: Add the Partners link to the footer**

`src/components/layout/footer.tsx` already imports `solutionsMenu` from `@/lib/nav` and manually appends it to the Quick Links list; `partnersMenu` exists in the same module (used by `mobile-nav.tsx`) but isn't imported here. Change:

```tsx
import { primaryNav, footerLegalLinks, solutionsMenu } from "@/lib/nav";
```

to:

```tsx
import { primaryNav, footerLegalLinks, solutionsMenu, partnersMenu } from "@/lib/nav";
```

Then find:

```tsx
              <li>
                <Link
                  href={solutionsMenu.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t(solutionsMenu.labelKey)}
                </Link>
              </li>
```

and add, immediately after it (same `<li>` pattern):

```tsx
              <li>
                <Link
                  href={partnersMenu.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t(partnersMenu.labelKey)}
                </Link>
              </li>
```

- [ ] **Step 2: Add a shared skeleton pattern**

For each of the four `loading.tsx` files listed above, use this same simple, dependency-free skeleton (adjust only the grid column count per page type if you check the corresponding `page.tsx` and it clearly uses a different card-grid width — default to this 3-column shape if unsure, it degrades gracefully):

```tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] animate-pulse px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-4 h-10 w-2/3 rounded bg-muted" />
      <div className="mt-4 h-5 w-full max-w-xl rounded bg-muted" />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
```

Create this exact content at each of the four paths listed in Files above (it's a Server Component by default, no `"use client"` needed, no props, no i18n — it's a content-free loading placeholder so there's nothing to localize).

- [ ] **Step 3: Lint, build, commit**

```bash
npm run lint
npm run build
git add src/components/layout/footer.tsx src/app/\[locale\]/products/\[slug\]/loading.tsx src/app/\[locale\]/solutions/\[slug\]/loading.tsx src/app/\[locale\]/partners/\[slug\]/loading.tsx src/app/\[locale\]/knowledge-center/\[slug\]/loading.tsx
git commit -m "feat: add footer Partners link + loading skeletons for dynamic detail routes"
```

---

### Task 11: Promote Why-EMC pillars into a real homepage module

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/sections/home/why-emc-teaser.tsx`
- Test: `npm run lint`, `npm run build`, manual visual check

**Interfaces:**
- Produces: `WhyEmcTeaser`'s props change from `{ eyebrow, headline, body }` to also accept a `pillars` array (reusing the same pillar shape `about/page.tsx`'s `PillarCard` already consumes — check `src/components/sections/about/pillar-card.tsx`'s prop types and match them exactly, do not invent a new shape). This has exactly one caller (`src/app/[locale]/page.tsx`), updated in this same task.

**Audit finding:** the homepage's "Why EMC" section is reduced to a single paragraph + "Learn more," even though the full substantiated pillar content (Training, Regulatory Knowledge/SFDA, Technical Support, After-Sales, etc.) already exists in `content/pages/about.json` and renders correctly on the About page (`about/page.tsx`'s `#why-emc` section) — it's gated behind a second click most first-pass visitors won't take.

- [ ] **Step 1: Read the current files**

Read `src/components/sections/home/why-emc-teaser.tsx` (already shown in full above — short file) and `src/app/[locale]/page.tsx`'s section that renders `WhyEmcTeaser`, and `src/components/sections/about/pillar-card.tsx` for the exact `PillarCard` prop shape to reuse.

- [ ] **Step 2: Update `WhyEmcTeaser` to render pillars**

Rewrite `src/components/sections/home/why-emc-teaser.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { PillarCard } from "@/components/sections/about/pillar-card";

export function WhyEmcTeaser({
  eyebrow,
  headline,
  body,
  pillars,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  pillars: { icon: string; title: string; body: string }[];
}) {
  const t = useTranslations();

  return (
    <section className="mx-auto max-w-7xl 2xl:max-w-[96rem] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-emc-teal-700 uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-heading font-bold text-foreground sm:text-4xl">
          {headline}
        </h2>
        <p className="mt-4 text-muted-foreground">{body}</p>
      </Reveal>
      <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.slice(0, 4).map((pillar, i) => (
          <PillarCard
            key={pillar.title}
            icon={pillar.icon}
            title={pillar.title}
            body={pillar.body}
            delay={i * 0.05}
          />
        ))}
      </RevealGroup>
      <div className="mt-8 text-center">
        <Button variant="outline" render={<Link href="/about#why-emc" />}>
          {t("common.learnMore")}
        </Button>
      </div>
    </section>
  );
}
```

(Match `PillarCard`'s actual prop names exactly as read in Step 1 — if they differ from `icon`/`title`/`body`/`delay` shown here, use the real names instead; this is a description of intent, not a guarantee of the exact current signature.)

Cap at 4 pillars (`pillars.slice(0, 4)`) — the homepage module is a promotion/preview, not a full duplicate of the About page's complete pillar grid (which may have more than 4); the "Learn more" button still routes to the full set on About.

- [ ] **Step 3: Update the homepage caller**

In `src/app/[locale]/page.tsx`, find the `<WhyEmcTeaser eyebrow={...} headline={...} body={...} />` call. The pillar content lives in `content/pages/about.json`'s `whyEmc.pillars` array (same content `about/page.tsx` reads via `content.whyEmc.pillars`) — check how the home page currently fetches its content (likely `getHomePageContent()`) versus how About fetches (`getAboutPageContent()` or similar). If the home page doesn't currently fetch About's content, add a second content fetch (e.g. `const aboutContent = await getAboutPageContent();` alongside whatever the home page already calls, matching this repo's existing `Promise.all(...)` pattern where multiple content sources are combined — see `solutions/[slug]/page.tsx` for an example of that pattern). Pass the first 4 pillars through, localized the same way every other pillar list in this codebase is (`l(pillar.title)`/`l(pillar.body)` using the file's existing `pickLocale` helper):

```tsx
        <WhyEmcTeaser
          eyebrow={l(content.whyEmc.eyebrow)}
          headline={l(content.whyEmc.headline)}
          body={l(content.whyEmc.body)}
          pillars={aboutContent.whyEmc.pillars.map((pillar) => ({
            icon: pillar.icon,
            title: l(pillar.title),
            body: l(pillar.body),
          }))}
        />
```

(Adjust the exact `content.whyEmc.*`/`aboutContent.whyEmc.*` paths to match whatever the real content-getter return shape is once you've read it in Step 1 — the field names `eyebrow`/`headline`/`body`/`pillars` are confirmed to exist from `about/page.tsx`'s own usage shown earlier in this plan; the home page's existing eyebrow/headline/body for this section may already come from `content/pages/home.json` rather than `about.json` — keep using whichever source the home page already uses for those three fields, only add the `pillars` array from `about.json`.)

- [ ] **Step 4: Manual visual check**

Run `npm run dev`, load `/en`, scroll to the Why EMC section — confirm it now shows up to 4 pillar cards (icon, title, body) matching the same visual treatment as the About page's pillar grid, with a "Learn more" button still linking to `/about#why-emc`. Check `/ar` too for RTL correctness.

- [ ] **Step 5: Lint, build, commit**

```bash
npm run lint
npm run build
git add src/app/\[locale\]/page.tsx src/components/sections/home/why-emc-teaser.tsx
git commit -m "feat: promote Why-EMC pillars into a real homepage module using existing about.json content"
```
