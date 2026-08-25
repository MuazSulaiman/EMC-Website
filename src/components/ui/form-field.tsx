import { cloneElement, isValidElement, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Minimal field wrapper for react-hook-form usage (shadcn's own `form.tsx`
 * generator isn't available in this registry — see DECISIONS.md). Pairs a
 * label, the input, and an accessible error message.
 *
 * Section 13: form errors must be announced to screen readers. `role="alert"`
 * covers the announcement when the error first appears; `aria-invalid` +
 * `aria-describedby` (cloned onto the single child input) also cover a user
 * tabbing back into an already-invalid field, which `role="alert"` alone
 * would miss since it only fires on change.
 */
export function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const errorId = `${htmlFor}-error`;
  const cloneProps: Record<string, unknown> = {};
  if (required) {
    cloneProps.required = true;
    cloneProps["aria-required"] = true;
  }
  if (error) {
    cloneProps["aria-invalid"] = true;
    cloneProps["aria-describedby"] = errorId;
  }
  const field =
    isValidElement(children) && Object.keys(cloneProps).length > 0
      ? cloneElement(children as React.ReactElement<Record<string, unknown>>, cloneProps)
      : children;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {field}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
