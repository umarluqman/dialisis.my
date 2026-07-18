import { Button } from "@/components/ui/button";
import { buildWhatsAppUrlWithMessage } from "@/lib/center-phone-numbers";
import { prisma } from "@/lib/db";
import { createPicWhatsAppMessage } from "@/lib/intake-lead-email";
import { getSignedFileUrl } from "@/lib/s3";
import { Download, Phone } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    token: string;
  };
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ms-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("ms-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMyKad(myKadNumber: string) {
  return myKadNumber.replace(/^(\d{6})(\d{2})(\d{4})$/, "$1-$2-$3");
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div className="border-b border-border/70 py-3 last:border-b-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-base font-medium">
        {value}
      </dd>
    </div>
  );
}

async function getLabResultUrl(lead: {
  labResultS3Key: string | null;
  labResultUrl: string | null;
}) {
  if (!lead.labResultS3Key) return lead.labResultUrl;

  try {
    return await getSignedFileUrl(lead.labResultS3Key, 15 * 60);
  } catch {
    return lead.labResultUrl;
  }
}

export default async function IntakeLeadPage({ params }: Props) {
  const lead = await prisma.intakeLead.findUnique({
    where: { accessToken: params.token },
    include: {
      dialysisCenter: {
        select: {
          dialysisCenterName: true,
        },
      },
    },
  });

  if (!lead) {
    notFound();
  }

  const isExpired = lead.accessExpiresAt.getTime() < Date.now();

  if (isExpired) {
    return (
      <main className="min-h-screen bg-background px-4 py-12">
        <section className="mx-auto max-w-2xl border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Pautan telah tamat tempoh</h1>
          <p className="mt-3 text-muted-foreground">
            Pautan permohonan ini aktif selama 48 jam sahaja.
          </p>
        </section>
      </main>
    );
  }

  if (!lead.viewedAt) {
    await prisma.intakeLead.update({
      where: { id: lead.id },
      data: { viewedAt: new Date() },
    });
  }

  const labResultUrl = await getLabResultUrl(lead);
  const patientWhatsAppUrl = buildWhatsAppUrlWithMessage(
    lead.phoneNumber,
    createPicWhatsAppMessage({
      centerName: lead.dialysisCenter.dialysisCenterName,
      fullName: lead.fullName,
    })
  );

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:py-12">
      <article className="mx-auto max-w-4xl">
        <header className="border-b pb-6">
          <p className="text-sm text-muted-foreground">
            Permohonan Dialisis.my
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            {lead.dialysisCenter.dialysisCenterName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Dihantar {formatDateTime(lead.createdAt)} · Tamat tempoh{" "}
            {formatDateTime(lead.accessExpiresAt)}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <a href={`tel:${lead.phoneNumber}`}>
                <Phone className="h-4 w-4" />
                Hubungi pesakit
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={patientWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp pesakit
              </a>
            </Button>
            {labResultUrl && (
              <Button variant="outline" asChild>
                <a
                  href={labResultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Keputusan makmal
                </a>
              </Button>
            )}
          </div>
        </header>

        <div className="grid gap-8 py-8 md:grid-cols-2">
          <section>
            <h2 className="text-xl font-semibold">Maklumat peribadi</h2>
            <dl className="mt-3 border-t">
              <DetailRow label="Nama penuh" value={lead.fullName} />
              <DetailRow
                label="No kad pengenalan"
                value={formatMyKad(lead.myKadNumber)}
              />
              <DetailRow label="No telefon" value={lead.phoneNumber} />
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Temujanji</h2>
            <dl className="mt-3 border-t">
              <DetailRow
                label="Tarikh pilihan"
                value={formatDate(lead.preferredDate)}
              />
              <DetailRow label="Sesi" value={lead.preferredSession} />
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Alamat kediaman</h2>
            <dl className="mt-3 border-t">
              <DetailRow label="Alamat penuh" value={lead.homeAddress} />
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Keputusan makmal</h2>
            <dl className="mt-3 border-t">
              <DetailRow
                label="Fail"
                value={
                  lead.labResultOriginalName
                    ? lead.labResultOriginalName
                    : "Tiada fail dimuat naik"
                }
              />
              <DetailRow
                label="Catatan tambahan"
                value={lead.additionalNotes || "Tiada catatan"}
              />
            </dl>
          </section>
        </div>
      </article>
    </main>
  );
}
