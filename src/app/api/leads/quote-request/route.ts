import { NextResponse } from "next/server";
import { quotationRequestSchema } from "@/lib/validations/leads";
import { submitLead } from "@/lib/leads/dispatch";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = quotationRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const summary = [
    `Organization: ${data.organization}`,
    `Contact person: ${data.contactPerson}`,
    `Department: ${data.department}`,
    `Product: ${data.product}`,
    `Quantity: ${data.quantity}`,
    `City: ${data.city}`,
    `Procurement type: ${data.procurementType}`,
    data.message ? `Message: ${data.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const { stored } = await submitLead({
    type: "quote-request",
    payload: data,
    summary,
  });

  if (!stored) {
    return NextResponse.json(
      { error: "Could not save your request. Please try again or contact us directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
