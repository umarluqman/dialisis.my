"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Send, Upload } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";

type IntakeLeadFormProps = {
  centerId: string;
  centerName: string;
  className?: string;
  hideHeader?: boolean;
};

type SubmitResult = {
  leadId: string;
  picNotificationStatus: string;
};

const LAB_RESULT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

function getMalaysiaDateString() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
    </div>
  );
}

export function IntakeLeadForm({
  centerId,
  centerName,
  className,
  hideHeader,
}: IntakeLeadFormProps) {
  const { toast } = useToast();
  const [preferredSession, setPreferredSession] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = useMemo(() => getMalaysiaDateString(), []);

  function validateLabResult(file?: File) {
    if (!file || file.size === 0) {
      setFileError("");
      return true;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("Saiz fail maksimum 10MB.");
      return false;
    }

    if (!LAB_RESULT_TYPES.includes(file.type)) {
      setFileError("Muat naik PDF atau imej sahaja.");
      return false;
    }

    setFileError("");
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const labResult = fileInputRef.current?.files?.[0];

    if (!validateLabResult(labResult)) return;

    try {
      setIsSubmitting(true);
      setSubmitResult(null);

      const formData = new FormData(form);
      formData.set("centerId", centerId);
      formData.set("preferredSession", preferredSession);
      formData.set("consent", consent ? "true" : "");

      const response = await fetch("/api/intake-leads", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Permohonan gagal dihantar");
      }

      const result = payload as SubmitResult;
      setSubmitResult(result);
      toast({
        title: "Permohonan direkodkan",
        description:
          result.picNotificationStatus === "sent"
            ? "Pusat telah dimaklumkan melalui email untuk susulan."
            : "Permohonan telah disimpan untuk susulan.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ralat",
        description:
          error instanceof Error ? error.message : "Permohonan gagal dihantar.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="borang-temujanji"
      className={cn("scroll-mt-8 border-t border-border pt-8", className)}
      data-ga-context="intake_lead_form"
      data-center-id={centerId}
      data-center-name={centerName}
    >
      {!hideHeader && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Borang temujanji dialisis</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Lengkapkan maklumat untuk dihantar kepada pusat dialisis.
          </p>
        </div>
      )}

      <form
        id={`intake-lead-form-${centerId}`}
        data-ga-start-event="lead_form_start"
        data-ga-submit-event="lead_form_submit"
        className="space-y-8"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="centerId" value={centerId} />
        <input
          className="hidden"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nama penuh" required>
            <Input name="fullName" required minLength={2} maxLength={120} />
          </Field>
          <Field label="No kad pengenalan (MyKad)" required>
            <Input
              name="myKadNumber"
              required
              inputMode="numeric"
              pattern="[0-9\-]{12,14}"
              placeholder="900101-01-1234"
            />
          </Field>
        </div>

        <Field label="Alamat penuh" required>
          <Textarea
            name="homeAddress"
            required
            minLength={10}
            maxLength={1000}
            className="min-h-28"
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Tarikh pilihan" required>
            <Input name="preferredDate" type="date" min={today} required />
          </Field>
          <Field label="Sesi" required>
            <select
              name="preferredSession"
              required
              value={preferredSession}
              onChange={(event) => setPreferredSession(event.target.value)}
              className="flex h-9 w-full rounded-none border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>
                Pilih sesi
              </option>
              <option value="Pagi">Pagi</option>
              <option value="Tengah hari">Tengah hari</option>
              <option value="Petang">Petang</option>
              <option value="Malam">Malam</option>
              <option value="Fleksibel">Fleksibel</option>
            </select>
          </Field>
          <Field label="No telefon" required>
            <Input
              name="phoneNumber"
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="012-345 6789"
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Muatnaik keputusan makmal atau gambar berkaitan rawatan">
            <div className="relative">
              <Input
                ref={fileInputRef}
                name="labResult"
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp,image/heic,image/heif"
                className="h-11 cursor-pointer pr-10 file:mr-3"
                onChange={(event) =>
                  validateLabResult(event.currentTarget.files?.[0])
                }
              />
              <Upload className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {fileError ? (
              <p className="text-sm text-destructive">{fileError}</p>
            ) : null}
          </Field>
          <Field label="Catatan tambahan">
            <Textarea name="additionalNotes" maxLength={1000} />
          </Field>
        </div>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-sm border border-primary accent-primary"
          />
          <span>
            Saya bersetuju maklumat ini dihantar kepada pusat dialisis yang
            dipilih untuk tujuan temujanji dan susulan rawatan. Saya faham
            deposit RM50 diperlukan selepas borang dihantar untuk mengesahkan
            slot, dan deposit ini akan ditolak daripada bayaran rawatan.
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            disabled={
              isSubmitting || !consent || !preferredSession || !!fileError
            }
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyediakan...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Hantar permohonan
              </>
            )}
          </Button>
        </div>

        {submitResult ? (
          <div
            role="status"
            className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                Permohonan berjaya direkodkan.
              </p>
              <p className="text-muted-foreground">
                {submitResult.picNotificationStatus === "sent"
                  ? "Pusat telah dimaklumkan melalui email."
                  : "Permohonan telah disimpan untuk susulan."}
              </p>
            </div>
          </div>
        ) : null}
      </form>
    </section>
  );
}
