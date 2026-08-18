import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/leads";
import { submitLead } from "@/lib/leads/dispatch";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const summary = [
    `Inquiry type: ${data.inquiryType}`,
    `Name: ${data.name}`,
    data.organization ? `Organization: ${data.organization}` : null,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Message: ${data.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const { stored } = await submitLead({
    type: "contact",
    payload: data,
    summary,
    submitterEmail: data.email,
    submitterName: data.name,
  });

  if (!stored) {
    return NextResponse.json(
      { error: "Could not save your message. Please try again or contact us directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
