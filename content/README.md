# Content layer

Every page component reads content through the typed getters in `src/lib/content.ts` (`getSolutions()`, `getPartner(slug)`, etc.) — never inline copy in JSX. Each getter reads the matching `content/<collection>/*.json` directory, parses every file, and validates it against the Zod schema in `content/schemas/`. An invalid file throws at build/request time rather than silently rendering bad data.

## Why local JSON instead of a hosted CMS (Section 4.1)

A hosted headless CMS (Sanity is the recommended target) is the right long-term answer for non-developer content editing, but it requires EMC to create an account and hand back API credentials before the build can start. Instead, the schemas here are *deliberately shaped to match what the Sanity schema would look like*.

**Migration path:** when Sanity is connected, only the functions in `src/lib/content.ts` change (swap the `fs`-based readers for Sanity client queries that return the same shapes). Routing, components, and the Zod-derived TypeScript types are untouched.

## Collections

| Directory | Schema | Notes |
|---|---|---|
| `solutions/` | `content/schemas/solution.ts` | 6 clinical categories (Section 7). `status: "expanding"` marks the ones without EMC-supplied products yet (Section 9.3). |
| `partners/` | `content/schemas/partner.ts` | The 5 verified manufacturer partners (Section 2.1). |
| `products/` | `content/schemas/product.ts` | Seeded starting in Phase 4 with UE Medical's actual line. |
| `news/` | `content/schemas/news.ts` | Single collection for the whole Knowledge Center — article / case-study / white-paper / news / event / workshop are all just `type` values on the same schema, per Section 9.8. (Section 5's folder tree lists a separate `case-studies/` directory; that's superseded by the unified model in Section 8.4/9.8 — see DECISIONS.md.) |
| `jobs/` | `content/schemas/job.ts` | Empty until EMC supplies open roles; Careers page renders a "join our Talent Network" empty state. |
| `testimonials/` | `content/schemas/testimonial.ts` | **Stays empty** until EMC supplies real, attributable quotes. Never seed with placeholder names (Section 2.2, 18). |
| `stats.json` | `content/schemas/stats.ts` | Single file, not a directory. Every entry ships `verified: false` until EMC confirms a real number — `getVerifiedStats()` is the only getter page components should call. |

| `pages/*.json` | `content/schemas/home-page.ts`, `about-page.ts` | One-off page-body copy for pages that aren't Section-8 collections (Home hero/bands, About Us prose including the Why EMC pillars). Single file per page, same pattern as `stats.json`, read via `getHomePageContent()` etc. — added in Phase 2, see DECISIONS.md. Why EMC was originally its own page; its 8 pillars were later merged into About Us's Core Values section and the standalone route removed — see DECISIONS.md. |

A `team/` collection (for About Us leadership bios beyond the verified CEO) isn't defined yet — Section 8 doesn't specify its shape, and About Us is Phase 2, not Phase 1. It'll be added when that page is built.
