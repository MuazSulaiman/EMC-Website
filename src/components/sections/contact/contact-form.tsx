"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  contactSchema,
  contactInquiryTypeSchema,
  type ContactPayload,
} from "@/lib/validations/leads";

const INQUIRY_TYPES = contactInquiryTypeSchema.options;

export function ContactForm({
  initialInquiryType,
}: {
  initialInquiryType?: (typeof INQUIRY_TYPES)[number];
}) {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiryType: initialInquiryType ?? "general" },
  });

  const onSubmit = async (data: ContactPayload) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads/contact", {
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

  if (submitted) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="size-10 text-emc-teal-600" aria-hidden="true" />
        <p className="font-medium text-foreground">{t("forms.successTitle")}</p>
        <p className="text-sm text-muted-foreground">{t("forms.successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
      <FormField
        label={t("forms.inquiryType")}
        htmlFor="inquiryType"
        required
        error={errors.inquiryType?.message}
        className="sm:col-span-2"
      >
        <Controller
          control={control}
          name="inquiryType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(v) => field.onChange(v ?? "general")}>
              <SelectTrigger
                id="inquiryType"
                className="w-full sm:w-64"
                aria-invalid={!!errors.inquiryType}
                aria-describedby={errors.inquiryType ? "inquiryType-error" : undefined}
              >
                <SelectValue>
                  {(value: string | null) =>
                    value ? t(`forms.inquiryTypes.${value}`) : ""
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {INQUIRY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`forms.inquiryTypes.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField label={t("forms.name")} htmlFor="name" required error={errors.name?.message}>
        <Input id="name" {...register("name")} />
      </FormField>
      <FormField label={t("forms.organization")} htmlFor="organization" error={errors.organization?.message}>
        <Input id="organization" {...register("organization")} />
      </FormField>
      <FormField label={t("forms.email")} htmlFor="email" required error={errors.email?.message}>
        <Input id="email" type="email" {...register("email")} />
      </FormField>
      <FormField label={t("forms.phone")} htmlFor="phone" required error={errors.phone?.message}>
        <Input id="phone" type="tel" {...register("phone")} />
      </FormField>
      <FormField
        label={t("forms.message")}
        htmlFor="message"
        required
        error={errors.message?.message}
        className="sm:col-span-2"
      >
        <Textarea id="message" rows={4} {...register("message")} />
      </FormField>

      {submitError && (
        <p role="alert" className="text-sm text-destructive sm:col-span-2">
          {submitError}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} className="sm:col-span-2">
        {t("forms.submit")}
      </Button>
    </form>
  );
}
