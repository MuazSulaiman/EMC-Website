# EMC Website Design Audit — Fixes Design

## Context

A seven-lens specialist design audit (frontend engineering, UX, visual
taste, premium visual-brand fit, accessibility, conversion, and
Gulf-region healthcare B2B positioning fit) reviewed the live site,
screenshots, and source code, then a cross-functional panel prioritized
the findings into P0/P1/P2. Full detail: the published report and
`docs/superpowers/reference/2026-08-25-emc-design-audit-raw.json` (raw
per-lens findings, copied into this repo for implementer reference — see
"Reference material" below).

This spec scopes what that audit recommends into what this pass actually
implements, and records two rulings that override the audit's literal
text after re-checking it against this repo's own prior decisions
(`DECISIONS.md`, `PROGRESS.md`) and the earlier
`docs/superpowers/specs/2026-08-18-ui-polish-animation-design.md` /
`-plan.md`, which the audit did not have access to.

## Ruling 1: GradientMesh is not a defect — do not "fix" it

The audit's top visual/brand finding calls the `GradientMesh` placeholder
(`src/components/sections/gradient-mesh.tsx`) a critical gap versus the
brief's "large editorial photography" bar, and recommends sourcing real
photography or giving specific pages a "more resolved" interim treatment.

Two facts the audit didn't have:

1. `DECISIONS.md` (Phase 4 section): *"No product photography — same
   `GradientMesh` placeholder treatment as solutions/partners. The only
   visual asset available is the UE Medical PDF's own slide graphics,
   which are that company's internal marketing materials, not licensed
   product photography for republishing on EMC's own site."* There is no
   real photography sitting unused — the only source images are
   explicitly not licensed for this use.
2. The prior `2026-08-18-ui-polish-animation-design.md` spec already
   reviewed this exact question and explicitly ruled it out: GradientMesh
   is PROJECT_SPEC.md Section 6.1's own prescribed fallback ("use it in
   gradients, editorial color blocks, or as a duotone overlay on
   photography instead" of a flat purple fill) for exactly the "no photo
   yet" state, applied consistently across About/Solutions/Products/
   Partners/CtaBand.

**Decision: no task touches GradientMesh, and no task attempts a
"more resolved" placeholder for specific pages.** Faking a more-finished
look for a page that still has no real photography would itself be a
step toward "invented photography," which Section 6.1 explicitly rules
out. Real photography sourcing/licensing remains a business follow-up,
out of scope for a code change. This is called out again in the final
report to the user as a deliberate scope decision, not a silent drop.

## Ruling 2: header search — remove the stub now, wiring real search is a follow-up, not this pass

The audit's P0 recommends removing `search-trigger.tsx`'s permanently
disabled "coming soon" input. That's still correct for this pass. But
`PROGRESS.md` shows the condition the component's own code comment cites
as the blocker — *"the Fuse.js index has nothing to index until Phases
2-4 ship content"* — has since resolved: Phases 2-4 are marked complete,
and both `ProductCatalog` and the Knowledge Center catalog already ship
working per-page Fuse.js search today.

**Decision: this pass removes the dead stub (matches the approved P0
scope and keeps blast radius small on a component that renders in the
root layout on every page).** Wiring a real sitewide header search
(a shared Fuse index across products/solutions/partners, surfaced from a
client component in the root layout) is a legitimate, buildable follow-up
now that content exists — but it needs its own data-plumbing decision
(static search-index file vs. async layout props) and its own review
cycle, not a rider on an unrelated bug-fix pass. Flagged to the user in
the final report as a recommended next project, not implemented here.

## Scope: 11 tasks

Approved with the user before this spec was written (see conversation).
Excluded from the approved 12-item sketch discussed with the user:
the item covering "GradientMesh resolved treatment" — dropped per Ruling
1 above, discovered during this spec's grounding pass, after the user's
approval. Everything else proceeds as scoped.

1. Fix the Reveal/RevealGroup scroll-gating animation bug (root cause) +
   the dead `stagger` prop found in the same component.
2. Add a real 44px+ touch-target CTA button size; apply it to every
   Demo/Quotation/Contact trigger sitewide.
3. Restore the mobile header CTA (Demo Request is currently invisible
   below the `sm` breakpoint).
4. Remove the non-functional "coming soon" search (Ruling 2).
5. Lead-gen form accessibility sweep (success-state announcement,
   `required` propagation, language-switcher label, dialog close-button
   locale) + progressive disclosure on the Demo/Quotation modals.
6. Add a `CtaBand` to the bottom of every listing page (Solutions,
   Products, Partners, Services) + upgrade the Services per-card CTA.
7. About page: fix the two flat `bg-emc-purple-900` background
   violations (Vision card, Corporate Philosophy band) — the hero's
   `GradientMesh` usage is correct per Ruling 1 and is untouched.
8. Partner-relationship cards: add the partner's logo (reusing the
   existing logo-with-fallback data already on `Partner.logo`) to the
   Solution-detail related-Partners cross-sell cards.
9. Add Quotation Request to the Product detail hero CTA row (currently
   Demo / Contact / Brochure only).
10. Footer: add the missing Partners link + add route-level
    `loading.tsx` skeletons for the four `[slug]` dynamic routes.
11. Promote the Why-EMC pillars into a real homepage module using the
    content that already exists in `content/pages/about.json` (no new
    content, just surfacing it one level shallower than today's
    single-paragraph teaser).

## Global constraints (apply to every task)

- Respect `prefers-reduced-motion` — `Reveal`/`RevealGroup` already
  branch on `useReducedMotion()`; do not bypass it.
- No content fabrication — every string used below already exists in
  `content/` or `messages/`, or is a straightforward English+Arabic pair
  added alongside an existing key of the same shape. Do not invent
  statistics, certifications, or claims (PROJECT_SPEC.md Section 18).
- Every user-facing string is a real `{ en, ar }` pair via next-intl —
  never hardcode an English-only string into a component (Section 10).
- Preserve the documented brand rule: purple/teal are accents, not
  background surfaces (`globals.css` comments, PROJECT_SPEC.md Section
  6.1) — Task 7 enforces this rule, no other task should introduce a new
  violation of it.
- `npm run lint` and `npm run build` must stay clean after every task.
  This repo has no per-component unit test framework (Zod-validated
  content + `npm run build`'s static generation is the existing
  correctness check, per `PROGRESS.md`'s own pattern) — Playwright
  (`e2e/`) + axe-core run as the final whole-branch gate, not per task.
- RTL: this site ships `/en` and `/ar` with `dir="rtl"` on Arabic. Any
  new layout must not hardcode `left`/`right` — use the existing
  logical-property classes (`ps-`, `pe-`, `start-`, `end-`) already used
  elsewhere in the codebase (e.g. `product-catalog.tsx`'s search icon).
- Follow existing component/variant patterns exactly — do not introduce
  a new visual style for something an existing component already does
  (e.g. Task 8 reuses `Partner.logo`'s existing fallback semantics rather
  than inventing new placeholder logic).

## Reference material

The full audit (all 7 lens reports, consolidated themes, prioritized
panel output) is long — implementers should not need to read the whole
thing per task. Each task below embeds the specific finding text and
file/line evidence it's implementing. If a task's brief references
"the audit," it means this spec's own excerpt, not an external document.
