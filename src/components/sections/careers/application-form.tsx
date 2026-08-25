"use client";

import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import {
  careersApplicationSchema,
  type CareersApplicationPayload,
} from "@/lib/validations/leads";

/** Section 9.9: Talent Network application, backed by /api/careers/apply (multipart, for the CV file). */
export function ApplicationForm({ defaultPosition }: { defaultPosition?: string }) {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CareersApplicationPayload>({
    resolver: zodResolver(careersApplicationSchema),
    defaultValues: { position: defaultPosition ?? "" },
  });

  const onSubmit = async (data: CareersApplicationPayload, event?: BaseSyntheticEvent) => {
    setSubmitError(null);
    try {
      const formEl = event?.target as HTMLFormElement | undefined;
      const formData = new FormData(formEl);
      // react-hook-form validated the text fields; FormData already carries
      // the file input (name="cv") plus every registered text field.
      if (!formData.get("position") && data.position) {
        formData.set("position", data.position);
      }
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
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
      <FormField label={t("forms.name")} htmlFor="name" required error={errors.name?.message}>
        <Input id="name" {...register("name")} />
      </FormField>
      <FormField label={t("forms.email")} htmlFor="email" required error={errors.email?.message}>
        <Input id="email" type="email" {...register("email")} />
      </FormField>
      <FormField label={t("forms.phone")} htmlFor="phone" required error={errors.phone?.message}>
        <Input id="phone" type="tel" {...register("phone")} />
      </FormField>
      <FormField label={t("careers.position")} htmlFor="position" error={errors.position?.message}>
        <Input id="position" placeholder={t("careers.positionPlaceholder")} {...register("position")} />
      </FormField>
      <FormField
        label={t("careers.linkedinUrl")}
        htmlFor="linkedinUrl"
        error={errors.linkedinUrl?.message}
        className="sm:col-span-2"
      >
        <Input id="linkedinUrl" type="url" placeholder="https://linkedin.com/in/…" {...register("linkedinUrl")} />
      </FormField>
      <FormField label={t("careers.cv")} htmlFor="cv" className="sm:col-span-2">
        <Input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          className="pt-1.5"
        />
        <p className="text-xs text-muted-foreground">{t("careers.cvHelp")}</p>
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
