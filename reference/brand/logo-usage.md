# EMC logo — usage guideline (Section 6.5)

Source of truth: `emc-logo-original.png` (raster, 356×349px, transparent background). Do not redraw, re-letter, or distort the mark. All favicon/app-icon exports are generated from this file via `scripts/generate-icons.mjs` — never hand-edited.

- **Clear space:** leave clear space around the badge equal to the badge's own radius (≈178px at source resolution) on all sides before placing other elements (text, other logos, edges of the viewport).
- **Minimum display size:** 40px height. Below this the Arabic wordmark inside the badge stops being legible.
- **Color variants:** only the original full-color raster exists today. Do not generate a white/reversed or monochrome version by manipulating this raster — it degrades badly at small sizes and the internal wordmark contrast breaks. Those variants require the vector (AI/EPS/SVG) source file from EMC's brand owner. Flagged as a follow-up in `DECISIONS.md`.
- **Backgrounds:** the badge already carries its own purple/teal fill and a transparent surround, so it reads correctly on white, `--emc-gray-50`, and `--emc-navy-900` footer backgrounds without modification. Avoid placing it on busy photography without a solid-color safe area behind it.
