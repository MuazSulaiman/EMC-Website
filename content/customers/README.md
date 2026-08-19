# Customers content

One JSON file per customer, validated against `content/schemas/customer.ts`, feeding the "Our Customers" band on the home page (`CustomersBand` renders nothing if this folder is empty — same empty-state pattern as `TestimonialsSection`).

```json
{
  "slug": "kebab-case-slug",
  "name": "Real Customer Name",
  "logo": {
    "src": "/media/customers/example-logo.png",
    "alt": { "en": "Example logo", "ar": "شعار Example" }
  }
}
```

`logo` is optional — `CustomerTile` falls back to a text wordmark when it's absent.

## Sourcing (2026-08-19 refresh)

The 22 entries here replace the original 8 `placeholder-customer-*.json` files. Names and logos were sourced by researching each entity's own official website (or, where that failed, a verified official social/LinkedIn profile) against the internal shorthand list EMC supplied (`Manual Content Handover/Customers List.png`) — see `DECISIONS.md` for the full method and per-entry confidence notes.

Two things to flag before this goes live:

1. **Permission.** Mirroring `PROJECT_SPEC.md` Section 2.1's existing precedent for the old site's client-logo grid: **EMC must confirm permission to display each of these logos before go-live.** Sourcing a logo from a public website is not the same as having permission to feature it as a client endorsement.
2. **Shared-authority logos.** Several Ministry of Health / National Guard / military facilities don't maintain their own distinct public logo — they're branded under a shared parent authority (Makkah Health Cluster covers 3 of these entries; National Guard Health Affairs covers 2, though its logo couldn't be fetched from this environment and those 2 currently ship as text-only). Where that's the case, the same shared logo file is reused across multiple entries — this is accurate to how those hospitals actually present themselves publicly, not a mistake.

8 of the 22 entries ship without a `logo` (text-wordmark fallback) because no confidently-verified official logo asset could be found or safely downloaded — see `DECISIONS.md` for which ones and why. Do not fill these in with a guessed or unofficial (e.g. third-party directory, fan-made) logo.
