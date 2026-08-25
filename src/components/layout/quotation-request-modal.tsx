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
  quotationRequestSchema,
  type QuotationRequestPayload,
} from "@/lib/validations/leads";

const PROCUREMENT_TYPES = ["tender", "direct"] as const;

/** Section 11: Request Quotation, reused from CtaBand across the site. */
export function QuotationRequestModal({
  defaultProduct,
  variant = "default",
  size = "xl",
  className,
}: {
  defaultProduct?: string;
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
  } = useForm<QuotationRequestPayload>({
    resolver: zodResolver(quotationRequestSchema),
    defaultValues: {
      product: defaultProduct ?? "",
      procurementType: "direct",
      quantity: 1,
    },
  });

  const onSubmit = async (data: QuotationRequestPayload) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads/quote-request", {
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
          product: defaultProduct ?? "",
          procurementType: "direct",
          quantity: 1,
        });
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant={variant} size={size} className={className} />}>
        {t("cta.requestQuotation")}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("cta.requestQuotation")}</DialogTitle>
          {!submitted && (
            <DialogDescription>{t("forms.quoteRequestIntro")}</DialogDescription>
          )}
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-10 text-emc-teal-600" aria-hidden="true" />
            <p className="font-medium text-foreground">{t("forms.successTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("forms.successBody")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
            <FormField label={t("forms.organization")} htmlFor="organization" required error={errors.organization?.message}>
              <Input id="organization" {...register("organization")} />
            </FormField>
            <FormField label={t("forms.contactPerson")} htmlFor="contactPerson" required error={errors.contactPerson?.message}>
              <Input id="contactPerson" {...register("contactPerson")} />
            </FormField>
            <FormField label={t("forms.department")} htmlFor="department" required error={errors.department?.message}>
              <Input id="department" {...register("department")} />
            </FormField>
            <FormField label={t("forms.city")} htmlFor="city" required error={errors.city?.message}>
              <Input id="city" {...register("city")} />
            </FormField>
            <FormField label={t("forms.product")} htmlFor="product" required error={errors.product?.message}>
              <Input id="product" {...register("product")} />
            </FormField>
            <FormField label={t("forms.quantity")} htmlFor="quantity" required error={errors.quantity?.message}>
              <Input id="quantity" type="number" min={1} {...register("quantity", { valueAsNumber: true })} />
            </FormField>
            <FormField
              label={t("forms.procurementType")}
              htmlFor="procurementType"
              required
              error={errors.procurementType?.message}
              className="sm:col-span-2"
            >
              <Controller
                control={control}
                name="procurementType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => field.onChange(v ?? "direct")}>
                    <SelectTrigger
                      id="procurementType"
                      className="w-full"
                      aria-invalid={!!errors.procurementType}
                      aria-describedby={errors.procurementType ? "procurementType-error" : undefined}
                    >
                      <SelectValue>
                        {(value: string | null) =>
                          value ? t(`forms.procurementTypes.${value}`) : ""
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {PROCUREMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`forms.procurementTypes.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField
              label={t("forms.message")}
              htmlFor="message"
              error={errors.message?.message}
              className="sm:col-span-2"
            >
              <Textarea id="message" rows={3} {...register("message")} />
            </FormField>

            {submitError && (
              <p role="alert" className="text-sm text-destructive sm:col-span-2">
                {submitError}
              </p>
            )}

            <Button type="submit" loading={isSubmitting} className="sm:col-span-2">
              {t("cta.requestQuotation")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
