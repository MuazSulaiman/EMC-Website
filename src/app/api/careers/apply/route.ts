import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { careersApplicationSchema } from "@/lib/validations/leads";
import { submitLead } from "@/lib/leads/dispatch";

const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_CV_BYTES = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads", "cv");

/**
 * Section 9.9: Talent Network application. Uses multipart/form-data (not
 * JSON, unlike the other 3 lead routes) so it can accept a real CV file —
 * saved to the same local-storage durability layer as lead JSONL records
 * (Section 11 / DECISIONS.md), not a cloud bucket. Same Vercel-ephemeral-
 * filesystem caveat applies.
 */
export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const cvFile = formData.get("cv");
  let cvUpload: string | undefined;

  if (cvFile instanceof File && cvFile.size > 0) {
    if (!ALLOWED_CV_TYPES.includes(cvFile.type)) {
      return NextResponse.json(
        { error: "CV must be a PDF or Word document." },
        { status: 400 },
      );
    }
    if (cvFile.size > MAX_CV_BYTES) {
      return NextResponse.json(
        { error: "CV must be under 5MB." },
        { status: 400 },
      );
    }
    const ext = path.extname(cvFile.name) || "";
    const fileName = `${randomUUID()}${ext}`;
    await mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, fileName), buffer);
    cvUpload = `data/uploads/cv/${fileName}`;
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    position: formData.get("position"),
    linkedinUrl: formData.get("linkedinUrl") || undefined,
    cvUpload,
  };

  const parsed = careersApplicationSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = { ...parsed.data, position: parsed.data.position || "General interest" };
  const summary = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Position: ${data.position}`,
    data.linkedinUrl ? `LinkedIn: ${data.linkedinUrl}` : null,
    data.cvUpload ? `CV: ${data.cvUpload}` : "CV: not attached",
  ]
    .filter(Boolean)
    .join("\n");

  const { stored } = await submitLead({
    type: "careers-apply",
    payload: data,
    summary,
    submitterEmail: data.email,
    submitterName: data.name,
  });

  if (!stored) {
    return NextResponse.json(
      { error: "Could not save your application. Please try again or contact us directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
