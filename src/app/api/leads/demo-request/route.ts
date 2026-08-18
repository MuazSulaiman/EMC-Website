import { NextResponse } from "next/server";
import { demoRequestSchema } from "@/lib/validations/leads";
import { submitLead } from "@/lib/leads/dispatch";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = demoRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const summary = [
    `Full name: ${data.fullName}`,
    `Organization: ${data.organization}`,
    `Job title: ${data.jobTitle}`,
    `Department: ${data.department}`,
    `City: ${data.city}`,
    `Email: ${data.email}`,
    `Mobile: ${data.mobile}`,
    `Product/solution of interest: ${data.productOrSolutionOfInterest}`,
    `Preferred contact method: ${data.preferredContactMethod}`,
    data.message ? `Message: ${data.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const { stored } = await submitLead({
    type: "demo-request",
    payload: data,
    summary,
    submitterEmail: data.email,
    submitterName: data.fullName,
  });

  if (!stored) {
    return NextResponse.json(
      { error: "Could not save your request. Please try again or contact us directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
