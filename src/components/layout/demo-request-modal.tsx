"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  demoRequestSchema,
  type DemoRequestPayload,
} from "@/lib/validations/leads";

const CONTACT_METHODS = ["email", "phone", "whatsapp"] as const;

/** Section 11: Request Demo modal, reachable from the header on every page. */
export function DemoRequestModal({
  defaultInterest,
  variant = "default",
  size = "xl",
  className,
}: {
  defaultInterest?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DemoRequestPayload>({
    resolver: zodResolver(demoRequestSchema),
    defaultValues: {
      productOrSolutionOfInterest: defaultInterest ?? "",
      preferredContactMethod: "email",
    },
  });

  const onSubmit = async (data: DemoRequestPayload) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");
      setSubmitted(true);
    } catch {
      setSubmitError(t("forms.genericError"));
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        setSubmitted(false);
        setSubmitError(null);
        reset({
          productOrSolutionOfInterest: defaultInterest ?? "",
          preferredContactMethod: "email",
        });
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant={variant} size={size} className={className} />}>
        {t("cta.requestDemo")}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("cta.requestDemo")}</DialogTitle>
          {!submitted && (
            <DialogDescription>{t("forms.demoRequestIntro")}</DialogDescription>
          )}
        </DialogHeader>

        {submitted ? (
          <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-10 text-emc-teal-600" aria-hidden="true" />
            <p className="font-medium text-foreground">{t("forms.successTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("forms.successBody")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
            <FormField label={t("forms.fullName")} htmlFor="fullName" required error={errors.fullName?.message}>
              <Input id="fullName" {...register("fullName")} />
            </FormField>
            <FormField label={t("forms.organization")} htmlFor="organization" required error={errors.organization?.message}>
              <Input id="organization" {...register("organization")} />
            </FormField>
            <FormField label={t("forms.email")} htmlFor="email" required error={errors.email?.message}>
              <Input id="email" type="email" {...register("email")} />
            </FormField>
            <FormField label={t("forms.mobile")} htmlFor="mobile" required error={errors.mobile?.message}>
              <Input id="mobile" type="tel" {...register("mobile")} />
            </FormField>
            <FormField
              label={t("forms.preferredContactMethod")}
              htmlFor="preferredContactMethod"
              required
              error={errors.preferredContactMethod?.message}
            >
              <Controller
                control={control}
                name="preferredContactMethod"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => field.onChange(v ?? "email")}>
                    <SelectTrigger
                      id="preferredContactMethod"
                      className="w-full"
                      aria-invalid={!!errors.preferredContactMethod}
                      aria-describedby={
                        errors.preferredContactMethod ? "preferredContactMethod-error" : undefined
                      }
                    >
                      <SelectValue>
                        {(value: string | null) =>
                          value ? t(`forms.contactMethods.${value}`) : ""
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {CONTACT_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {t(`forms.contactMethods.${method}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField
              label={t("forms.productOrSolutionOfInterest")}
              htmlFor="productOrSolutionOfInterest"
              required
              error={errors.productOrSolutionOfInterest?.message}
              className="sm:col-span-2"
            >
              <Input id="productOrSolutionOfInterest" {...register("productOrSolutionOfInterest")} />
            </FormField>
            <FormField
              label={t("forms.message")}
              htmlFor="message"
              error={errors.message?.message}
              className="sm:col-span-2"
            >
              <Textarea id="message" rows={3} {...register("message")} />
            </FormField>

            <details className="sm:col-span-2 group">
              <summary className="cursor-pointer text-sm font-medium text-emc-teal-700 hover:underline [&::-webkit-details-marker]:hidden">
                {t("forms.moreDetailsOptional")}
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FormField label={t("forms.jobTitle")} htmlFor="jobTitle" error={errors.jobTitle?.message}>
                  <Input id="jobTitle" {...register("jobTitle")} />
                </FormField>
                <FormField label={t("forms.department")} htmlFor="department" error={errors.department?.message}>
                  <Input id="department" {...register("department")} />
                </FormField>
                <FormField label={t("forms.city")} htmlFor="city" error={errors.city?.message}>
                  <Input id="city" {...register("city")} />
                </FormField>
              </div>
            </details>

            {submitError && (
              <p role="alert" className="text-sm text-destructive sm:col-span-2">
                {submitError}
              </p>
            )}

            <Button type="submit" loading={isSubmitting} className="sm:col-span-2">
              {t("cta.requestDemo")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
