# Customers content

The files in this folder are **placeholder data** for the "Our Customers"
band on the home page, added so the auto-scrolling design can be previewed
before real customer names are supplied.

Per `PROJECT_SPEC.md` (never invent hospital/customer names): replace each
`placeholder-customer-*.json` with a real, verified customer entry (or
delete it) before this ships. Each file follows `content/schemas/customer.ts`:

```json
{
  "slug": "kebab-case-slug",
  "name": "Real Customer Name"
}
```

If this folder is emptied entirely, `CustomersBand` renders nothing (same
empty-state pattern as `TestimonialsSection`).
