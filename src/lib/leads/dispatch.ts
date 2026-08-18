import "server-only";
import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Resend } from "resend";

export type LeadType =
  | "demo-request"
  | "quote-request"
  | "contact"
  | "careers-apply";

const LEADS_DIR = path.join(process.cwd(), "data", "leads");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// EMC's one verified inbox (Section 2.1). Override via env once EMC
// confirms a dedicated sales/leads address.
const LEADS_TO_EMAIL = process.env.LEADS_TO_EMAIL || "info@tamiozmed.com";

// Resend's own sandbox sender — works with no domain setup, for testing.
// Replace with a verified sending address on EMC's domain before launch.
const LEADS_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "EMC Website <onboarding@resend.dev>";

type SubmitLeadInput = {
  type: LeadType;
  payload: Record<string, unknown>;
  /** Plain-text summary of the payload, used in the internal notification email. */
  summary: string;
  /** Submitter's email, if the payload has one — used for the confirmation email. */
  submitterEmail?: string;
  submitterName?: string;
};

/**
 * Section 11 / 8.8: fans a lead out to (1) durable local storage so nothing
 * is lost if email fails, (2) a notification email to EMC's inbox, and
 * (3) a confirmation email to the submitter. Each step is independent and
 * best-effort — a failed email never causes a failed submission, since the
 * local record is already durable by the time email is attempted.
 *
 * Phase 2 CRM/Odoo webhook extension point: add a third fan-out branch here
 * (e.g. `await dispatchToOdooWebhook(type, payload)`) once EMC supplies an
 * endpoint. Nothing else in the codebase needs to change — every lead form
 * already funnels through this single function.
 */
export async function submitLead({
  type,
  payload,
  summary,
  submitterEmail,
  submitterName,
}: SubmitLeadInput): Promise<{ stored: boolean; emailed: boolean }> {
  const record = {
    id: randomUUID(),
    type,
    submittedAt: new Date().toISOString(),
    payload,
  };

  const stored = await storeLead(type, record);
  const emailed = await emailLead({ type, summary, submitterEmail, submitterName });

  return { stored, emailed };
}

async function storeLead(type: LeadType, record: unknown): Promise<boolean> {
  try {
    await mkdir(LEADS_DIR, { recursive: true });
    const filePath = path.join(LEADS_DIR, `${type}.jsonl`);
    await appendFile(filePath, `${JSON.stringify(record)}\n`, "utf-8");
    return true;
  } catch (error) {
    console.error(`[leads] failed to store ${type} lead locally`, error);
    return false;
  }
}

async function emailLead({
  type,
  summary,
  submitterEmail,
  submitterName,
}: {
  type: LeadType;
  summary: string;
  submitterEmail?: string;
  submitterName?: string;
}): Promise<boolean> {
  if (!resend) {
    console.warn(
      "[leads] RESEND_API_KEY is not set — skipping email delivery. The lead was still stored locally.",
    );
    return false;
  }

  const subjectByType: Record<LeadType, string> = {
    "demo-request": "New demo request",
    "quote-request": "New quotation request",
    contact: "New contact form submission",
    "careers-apply": "New careers application",
  };

  let notified = false;
  try {
    await resend.emails.send({
      from: LEADS_FROM_EMAIL,
      to: LEADS_TO_EMAIL,
      subject: `[EMC Website] ${subjectByType[type]}`,
      text: summary,
    });
    notified = true;
  } catch (error) {
    console.error(`[leads] failed to send internal notification for ${type}`, error);
  }

  if (submitterEmail) {
    try {
      await resend.emails.send({
        from: LEADS_FROM_EMAIL,
        to: submitterEmail,
        subject: "We received your request — Excellence Medical Care",
        text: `Hello${submitterName ? ` ${submitterName}` : ""},\n\nThank you for reaching out to Excellence Medical Care. Our team has received your request and will be in touch shortly.\n\n— EMC`,
      });
    } catch (error) {
      console.error(`[leads] failed to send confirmation email for ${type}`, error);
    }
  }

  return notified;
}
