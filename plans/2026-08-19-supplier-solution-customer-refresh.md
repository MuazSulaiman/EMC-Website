# Sprint Plan — Supplier, Solutions & Customer Logo Refresh

Status: **Awaiting approval — do not implement until Muaz checks this off**
Source material: `Manual Content Handover/` (EMC_Solutions_Content.docx, AMECO.pdf, FRESTEMS Ergomy brochure, Customers List.png)
Governing rules: `PROJECT_SPEC.md` Section 18 (never invent facts/logos/claims) and Section 8 (content models) still apply to everything below.

Each step is numbered so it can be referenced in conversation (e.g. "redo step 14") and checked off as it's completed. Steps are grouped into phases; phases are meant to be done in order because later phases depend on slugs/files created in earlier ones.

---

## Decisions already confirmed with Muaz

- The current 6 solutions are fully **disregarded**. The 5 solutions in `EMC_Solutions_Content.docx` are the new and only solution set.
- Orthopedics and Infection Control (and their content) are **removed entirely**, not redirected/archived.
- AMECO Technology is attributed to **both** "Anesthesia & Airway Management" (breathing circuits) and "Nursing & General Consumables" (oxygen/aerosol therapy, tubing, disposables), even though the docx's "Featured brands" lines don't name AMECO explicitly — this is my inference from AMECO's actual product catalog, not a claim sourced from the docx text itself. Flag this distinction in the solution copy (see step 15) so it doesn't read as if the docx said it.
- Customer logos: source real, official logos via web search and download the actual image files (not just render hospital names as text).

---

## Phase A — New suppliers (partners)

### A1. Frestems (Finland)
Facts verified from `FRESTEMS -ERGOMY_Series-brochure_net (ID 9688).pdf` (nothing here is invented):
- Legal name on brochure: **Frestems Oy**
- Address: Ahertajankatu 16, FI-38250 Sastamala, Finland
- Website: www.frestems.fi
- Product lines: **Ergomy Series** (civilian ambulance stretcher/loading systems — Ergomy BASIC, Ergomy TOTAL loading system, Ergomy CARBON stretcher) and **ProMIL Series** (military stretcher systems — ProMIL 245, ProMIL 360, ProMIL Wheels), designed for interoperability between civilian and military patient transport.
- Ergomy CARBON: ~30 kg, converts to a chair, extendable handles, large 200mm wheels, no batteries required, lowers to floor level for lying-position loading.
- Ergomy TOTAL: electric loading, laser height indicator, sideways slide, over-extension, automatic locks. Combined weight with CARBON stretcher: 130 kg, compatible with 3.5-ton ambulances.
- Certification: **EN 1865 CE marked** (this is what the brochure states — note the solutions docx separately says "crash-tested to EN 1789:2020" for the Ergomy Carbon in the Emergency & Accidental section; EN 1789 and EN 1865 are different standards (vehicle equipment vs. stretcher/handling equipment) — keep both claims as-is since each comes from a distinct verified source, don't merge or "correct" one into the other).

1. [ ] Create `content/partners/frestems.json` per `content/schemas/partner.ts`: slug `frestems`, name "Frestems", country "Finland", `clinicalAreas: ["critical-care", "emergency-accidental"]`, summary/technologyExpertise drawn only from the facts above, `externalWebsite: "https://www.frestems.fi"`.
2. [ ] Source Frestems' logo from `frestems.fi` (official site) via web search — download the real logo file, do not redraw/recreate it. Save to `public/media/partners/frestems-logo.png` (or `.svg` if available).
3. [ ] Wire the logo into the partner JSON via the `mediaImageSchema` `logo` field (`src`, bilingual `alt` describing "Frestems logo").

### A2. AMECO Technology (Egypt)
Facts verified from `AMECO.pdf` (nothing here is invented):
- Legal name: **Ameco Technology Limited Partnership** (trading as "AMECO Technology for Medical Industries")
- Established 2006, Egypt (10th of Ramadan City, Zone C3 and Zone B2, Egypt); representative office in Augsburg, Germany.
- Website: www.amecotechnology.com
- Product categories: Anesthesia Breathing Systems, Ventilation Breathing Systems, Oxygen Therapy Systems, Aerosol Therapy Systems, Tubing and Accessories — all disposable/single-use.
- Certifications: **ISO 13485** (TÜV SÜD Germany-assessed) and **CE** certified; also references SFDA and GMP marks on the certificate/seal page. OEM/ODM and contract-manufacturing partnership model.

4. [ ] Create `content/partners/ameco-technology.json`: slug `ameco-technology`, name "AMECO Technology", country "Egypt", foundedYear `2006`, `clinicalAreas: ["anesthesia-airway-management", "nursing-general-consumables"]`, summary/technologyExpertise drawn only from the facts above, `externalWebsite: "https://www.amecotechnology.com"`.
5. [ ] Source AMECO's logo from `amecotechnology.com` (official site) — download the real logo file. Save to `public/media/partners/ameco-technology-logo.png` (or `.svg`).
6. [ ] Wire the logo into the partner JSON via `logo`.

### A3. Nav & menu wiring for new partners
7. [ ] `src/lib/nav.ts` → `partnersMenu.items`: add `frestems` and `ameco-technology` entries (new `labelKey`s, e.g. `nav.partnersMenu.frestems` / `nav.partnersMenu.ameco`).
8. [ ] `messages/en.json` and `messages/ar.json` → add the two new `nav.partnersMenu.*` keys (English label + native Arabic label, not machine-translated — "Frestems" stays Latin-script like other partner names per the existing `Partner.country` precedent; "AMECO Technology" likewise).

---

## Phase B — Remove Benecare Medical, Ortholand, OXY'PHARM

9. [ ] Delete `content/partners/benecare-medical.json`, `content/partners/ortholand.json`, `content/partners/oxy-pharm.json`.
10. [ ] `src/lib/nav.ts` → `partnersMenu.items`: remove the `beneCareMedical`, `ortholand`, `oxyPharm` entries.
11. [ ] `messages/en.json` / `messages/ar.json` → remove the corresponding `nav.partnersMenu.beneCareMedical` / `.ortholand` / `.oxyPharm` keys.
12. [ ] Confirm no other file references these three partner slugs (already checked — only `nav.ts` and the partner JSON files themselves reference them; the two solutions that referenced them, Orthopedics and Infection Control, are removed in Phase C so no dangling reference survives).
13. [ ] Final partner roster after Phase A+B: **UE Medical, Long Life Surgical Industries, Frestems, AMECO Technology** (4 partners, down from 5). Note this changes the partner count referenced in copy — see step 20.

---

## Phase C — Replace the 6 solutions with the 5 from the Word doc

Content below is transcribed directly from `EMC_Solutions_Content.docx` (brief + long description, featured brands, product families) — nothing added beyond what's written there, except the AMECO attribution flagged in the "Decisions already confirmed" section above.

New slugs (old solution files are deleted, not migrated):
| New slug | Replaces | Status |
|---|---|---|
| `anesthesia-airway-management` | `airway-management` + `anesthesia` (merged) | active |
| `respiratory-care` | `respiratory-care` (content fully rewritten) | active (was `expanding`) |
| `critical-care` | `critical-care` (content fully rewritten) | active (was `expanding`) |
| `emergency-accidental` | — new | active |
| `nursing-general-consumables` | — new | active |

14. [ ] Delete `content/solutions/airway-management.json`, `anesthesia.json`, `orthopedics.json`, `infection-control.json`, `critical-care.json`, `respiratory-care.json` (all 6 current files).
15. [ ] Create `content/solutions/anesthesia-airway-management.json`: name "Anesthesia & Airway Management", shortDescription = docx brief description, clinicalOverview = docx long description (native Arabic translation, not machine-translated), `relatedPartnerSlugs: ["ue-medical", "long-life-surgical-industries", "ameco-technology"]`, `relatedProductSlugs: ["uescope-video-laryngoscope", "sacovlm-video-laryngeal-mask", "flexible-bronchoscope"]` (existing UE Medical products now file under the merged solution), icon reused from old `airway-management.json` (`Wind`), `status: "active"`.
16. [ ] Create `content/solutions/respiratory-care.json`: rewrite per docx (brief + long description), `relatedPartnerSlugs: ["ue-medical"]`, `relatedProductSlugs: ["flexible-bronchoscope"]`, icon `Activity`, `status: "active"`.
17. [ ] Create `content/solutions/critical-care.json`: rewrite per docx, `relatedPartnerSlugs: ["ue-medical", "frestems"]`, `relatedProductSlugs: []` (no confirmed EMC product slug yet for Frestems stretchers — see Phase F non-goals), icon `HeartPulse`, `status: "active"`.
18. [ ] Create `content/solutions/emergency-accidental.json` (new): name "Emergency & Accidental", content per docx, `relatedPartnerSlugs: ["frestems", "ue-medical"]`, icon — pick an unused Lucide icon appropriate to emergency/ambulance care (e.g. `Siren` or `Ambulance` — confirm it exists in the installed `lucide-react` version before using it, per the DECISIONS.md note that this repo's lucide-react build dropped some exports).
19. [ ] Create `content/solutions/nursing-general-consumables.json` (new): name "Nursing & General Consumables", content per docx, `relatedPartnerSlugs: ["ue-medical", "long-life-surgical-industries", "ameco-technology"]`, icon — pick an appropriate unused icon (e.g. `Package` or `ClipboardList`).
20. [ ] Update `content/products/uescope-video-laryngoscope.json`, `sacovlm-video-laryngeal-mask.json`, `flexible-bronchoscope.json`: change `clinicalSpecialty` from `["airway-management", "anesthesia"]` to `["anesthesia-airway-management"]` on all three (confirmed identical on all 3 files during exploration).

### Nav & menu wiring for new solutions
21. [ ] `src/lib/nav.ts` → replace `solutionsMenu.items` with the 5 new slugs/labels/icons (matching whatever icons are finalized in steps 15–19).
22. [ ] `messages/en.json` / `messages/ar.json` → replace the `nav.solutionsMenu.*` key set (6 keys → 5 keys: drop `orthopedics`/`infectionControl`, merge `airwayManagement`+`anesthesia` into one `anesthesiaAirwayManagement` key, add `emergencyAccidental` and `nursingGeneralConsumables`, native Arabic labels for the two new ones).

---

## Phase D — Cross-references in existing copy

These are places that reference the *old* solution names, the *old* partner count, or the *old* clinical domain list and would now read as wrong/stale if left alone.

23. [ ] `content/pages/home.json` → `partnersBand.body`: currently says "EMC represents five specialist manufacturers spanning airway management, orthopedics, and infection control." Rewrite to reflect 4 partners and the new 5-solution domain list (both `en` and `ar`).
24. [ ] `content/pages/index-pages.json` → `partnersIndex.body`: "EMC represents five specialist manufacturers..." → four. `solutionsIndex.body`: "Six clinical categories..." → five.
25. [ ] `content/pages/about.json` → `ourStory.body`: "...partnerships with specialist manufacturers across airway management, anesthesia, orthopedics, and infection control..." → rewrite to name the new 5 clinical domains.
26. [ ] `content/pages/services.json` → the Hands-on Workshops description references "orthopedic devices" — reword to reference a domain that still exists post-refresh (e.g. airway/emergency devices).
27. [ ] `src/app/[locale]/partners/page.tsx` → the partner index grid is tuned `xl:grid-cols-5` for the old 5-partner count (per `DECISIONS.md`'s Phase-7-polish note). With 4 partners, drop back to `lg:grid-cols-4` (no `xl:` override needed) so the grid doesn't leave an awkward gap.
28. [ ] Grep the repo once more for the removed partner/solution slugs and English names (`benecare`, `ortholand`, `oxy-pharm`/`OXY'PHARM`, `orthopedics`, `infection-control`) after all edits above, to catch anything missed (e.g. `content/README.md`'s "6 clinical categories" / "5 verified manufacturer partners" descriptive text, `content/partners/README.md`, `content/solutions/README.md`).

---

## Phase E — Customer logos (home page "Our Customers" band)

The current `content/schemas/customer.ts` only has `slug`/`name` — no logo field — and `CustomerTile` renders plain text. This needs a small schema/component change before any logos can show, then the 20 real customers from `Customers List.png` replace the 8 placeholder files.

29. [ ] `content/schemas/customer.ts` → add `logo: mediaImageSchema.optional()`, following the exact same optional-logo-with-text-fallback precedent as `partner.ts`/`PartnerTile`.
30. [ ] `src/components/sections/customer-tile.tsx` → update to render `customer.logo` via `next/image` when present, falling back to the current text-wordmark treatment when absent (mirror `PartnerTile`'s structure).
31. [ ] Delete the 8 `content/customers/placeholder-customer-*.json` files.
32. [ ] For each of the 20 hospitals/entities in `Customers List.png`, research the **real/official organization name** (the list holds EMC's internal shorthand, which may not match the entity's actual public-facing name) and its **official logo**, via web search against each hospital's own site or Saudi MOH/NUPCO sources — do not fabricate or guess a name/logo. List:
    1. Makkah Maternity & Children Hospital
    2. Prince Mohammed bin Abdulaziz National Guard Hospital – Madinah
    3. Hira General Hospital — Makkah
    4. Al-hada Armed Forces Hospital
    5. Al-Noor Specialist Hospital — Makkah
    6. King Fahad Specialist Hospital – Dammam
    7. Imam Abdulrahman Al-Faisal for National Guard Hospital – Dammam
    8. Security Forces Hospital – Dammam
    9. King Fahad Military Medical Complex – Dhahran
    10. Prince Sultan Military Medical City – Riyadh
    11. Riyadh Care Hospital – Riyadh
    12. King Saud University Medical City – Riyadh
    13. Buraydah General Hospital – Qassim
    14. Bright Specialist Clinics – Khobar
    15. Sulaiman Al Habib Hospital – Riyadh
    16. Dallah Hospitals
    17. Al-Mana Hospitals
    18. Red Crescent – Riyadh
    19. Mouwasat Hospitals
    20. Almaarefa University
    21. King Saud Medical City
    22. National Unified Procurement Company (Nupco)

    (Note: the image lists 20 rows — recount during execution; the numbering above may be off by one, verify against the actual PNG rather than this transcription.)
33. [ ] Download each confirmed logo into `public/media/customers/<slug>-logo.<ext>` and create `content/customers/<slug>.json` for each, with bilingual alt text describing the organization.
34. [ ] Where a confident, verifiable official logo genuinely cannot be found for a given entity (e.g. a generic clinic with no public brand assets), fall back to the existing text-tile treatment for that one entry rather than guessing — this is exactly what the optional `logo` field in step 29 is for.
35. [ ] Add a note to `content/customers/README.md` (replacing the current placeholder-focused text) recording that these logos were sourced from each organization's public website via web search, and — mirroring `PROJECT_SPEC.md` Section 2.1's existing precedent for the old site's client-logo grid — flag that **EMC must confirm permission to display each logo before go-live**; this is a compliance flag, not a blocker to building the feature.

---

## Phase F — Non-goals for this sprint (explicitly out of scope unless you say otherwise)

36. [ ] **Not** building full `content/products/*.json` catalog entries for every AMECO SKU (the brochure lists 50+ part numbers) or Frestems SKU — there's no confirmed subset of "featured" products EMC wants highlighted, and Section 8.3's product model expects per-product imagery/specs that don't exist yet for these lines. Partners and solutions link to these two new suppliers with `relatedProductSlugs: []` (empty, same "coming soon" treatment the codebase already uses elsewhere) until you tell me which specific SKUs should get product pages.
37. [ ] Flag for your review only, not acted on automatically: the Ergomy CARBON/TOTAL stretcher combo has enough real, verified content (from the Frestems brochure) to support 1–2 actual product pages if you want them built now instead of later — tell me if you want this pulled into this sprint or left for a future one.

---

## Phase G — Verification

38. [ ] `npx tsc --noEmit` — confirm the schema change (customer logo field) and all new/edited JSON still typecheck against Zod schemas.
39. [ ] Run `next dev`, visually check: home page Partners band (4 tiles) and Customers band (logos where found, text fallback elsewhere), Solutions index (5 cards) and each of the 5 new solution detail pages, Partners index (4 tiles, no layout gap) and the 2 new partner detail pages, both `/en` and `/ar`.
40. [ ] Grep for the words the spec's Definition of Done already asks to grep for ("years of experience," "certified," "award," "exclusive") on every new/edited file from this sprint, to make sure nothing fabricated slipped into the new supplier/solution copy.
41. [ ] Update `DECISIONS.md` with a new dated section logging: the solution-slug renaming/merge, the AMECO dual-solution attribution (docx doesn't name AMECO explicitly), the EN1789-vs-EN1865 dual-standard note for Frestems, the customer-logo sourcing/permission-confirmation flag, and the Phase F non-goals.

---

## Open items I could not resolve from the source material alone

- A couple of hospital names in `Customers List.png` (e.g. "Dallah Hospitals," "Al-Mana Hospitals," "Bright Specialist Clinics") are generic enough that I may find multiple similarly-named entities during logo research — I'll pick the most obviously matching official Saudi healthcare entity and flag any I'm not confident about rather than guess silently.
- If AMECO or Frestems' official sites don't expose a clean downloadable logo asset (e.g. only embedded in a raster hero image), I'll say so per-partner rather than crop a lower-quality version out of the PDF brochures.
