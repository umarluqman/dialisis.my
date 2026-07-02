import { buildWhatsAppUrlWithMessage, getPrimaryCenterPhoneNumber } from "@/lib/center-phone-numbers";
import { sendEmail } from "@/lib/email";
import { createIntakeLeadEmail } from "@/lib/intake-lead-email";
import { prisma } from "@/lib/db";
import { uploadFileToS3 } from "@/lib/s3";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_LAB_RESULT_SIZE = 10 * 1024 * 1024;
const ALLOWED_LAB_RESULT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const intakeLeadSchema = z.object({
  centerId: z.string().min(1),
  fullName: z.string().trim().min(2).max(120),
  myKadNumber: z
    .string()
    .transform((value) => value.replace(/[^\d]/g, ""))
    .refine((value) => /^\d{12}$/.test(value), {
      message: "No kad pengenalan tidak sah",
    }),
  homeAddress: z.string().trim().min(10).max(1000),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => value >= getMalaysiaDateString(), {
      message: "Tarikh pilihan tidak boleh sebelum hari ini",
    }),
  preferredSession: z.enum([
    "Pagi",
    "Tengah hari",
    "Petang",
    "Malam",
    "Fleksibel",
  ]),
  phoneNumber: z
    .string()
    .trim()
    .min(9)
    .max(30)
    .refine((value) => /^\+?[\d\s()-]+$/.test(value), {
      message: "No telefon tidak sah",
    }),
  additionalNotes: z.string().trim().max(1000).optional(),
  consent: z.literal("true"),
  website: z.string().max(0).optional(),
});

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

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

function getRequestIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getBaseUrl(request: NextRequest) {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (configuredBaseUrl) return configuredBaseUrl.replace(/\/$/, "");

  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : "https://dialisis.my";
}

function formatMyKad(myKadNumber: string) {
  return myKadNumber.replace(/^(\d{6})(\d{2})(\d{4})$/, "$1-$2-$3");
}

function formatDateForMessage(dateValue: string) {
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

function normalizeEmail(email: string | null | undefined) {
  const value = email?.trim().toLowerCase();
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null;
}

function buildPatientHandoffMessage({
  centerName,
  leadId,
  leadUrl,
  values,
  hasLabResult,
}: {
  centerName: string;
  leadId: string;
  leadUrl: string;
  values: z.infer<typeof intakeLeadSchema>;
  hasLabResult: boolean;
}) {
  return [
    "Assalamualaikum/Salam sejahtera.",
    "",
    "Saya ingin membuat permohonan/temujanji dialisis melalui Dialisis.my.",
    "",
    `Pusat: ${centerName}`,
    `Nama penuh: ${values.fullName}`,
    `No. MyKad: ${formatMyKad(values.myKadNumber)}`,
    `Alamat kediaman: ${values.homeAddress}`,
    `Tarikh pilihan: ${formatDateForMessage(values.preferredDate)}`,
    `Sesi: ${values.preferredSession}`,
    `No. telefon: ${values.phoneNumber}`,
    `Keputusan makmal: ${hasLabResult ? "Dimuat naik" : "Tiada"}`,
    values.additionalNotes ? `Catatan: ${values.additionalNotes}` : null,
    "",
    `Rekod rujukan: ${leadUrl}`,
    `ID permohonan: ${leadId}`,
    "",
    "Terima kasih.",
  ]
    .filter(Boolean)
    .join("\n");
}

function isFileUpload(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "size" in value &&
    "type" in value &&
    "name" in value
  );
}

async function uploadLabResult(
  formData: FormData,
  centerId: string,
  accessToken: string
) {
  const labResult = formData.get("labResult");
  if (!isFileUpload(labResult) || labResult.size === 0) return null;

  if (labResult.size > MAX_LAB_RESULT_SIZE) {
    throw new Error("Saiz fail keputusan makmal melebihi 10MB");
  }

  if (!ALLOWED_LAB_RESULT_TYPES.has(labResult.type)) {
    throw new Error("Format keputusan makmal mesti PDF atau imej");
  }

  const arrayBuffer = await labResult.arrayBuffer();
  const uploadResult = await uploadFileToS3({
    file: {
      buffer: Buffer.from(arrayBuffer),
      mimetype: labResult.type,
      originalName: labResult.name,
    },
    folder: `intake-leads/${centerId}/${accessToken}`,
  });

  return {
    url: uploadResult.url,
    s3Key: uploadResult.key,
    originalName: labResult.name,
  };
}

async function getLeadNotificationEmails(centerId: string, centerEmail?: string | null) {
  try {
    const assignedUsers = await prisma.$queryRaw<{ email: string | null }[]>`
      SELECT DISTINCT "user"."email"
      FROM "user"
      INNER JOIN "user_center_access"
        ON "user_center_access"."user_id" = "user"."id"
      WHERE "user_center_access"."dialysis_center_id" = ${centerId}
    `;
    const assignedEmails = assignedUsers
      .map((user) => normalizeEmail(user.email))
      .filter((email): email is string => Boolean(email));

    if (assignedEmails.length > 0) return Array.from(new Set(assignedEmails));
  } catch (error) {
    console.warn("Unable to load assigned PIC emails:", error);
  }

  const fallbackEmail = normalizeEmail(centerEmail);
  return fallbackEmail ? [fallbackEmail] : [];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const values = intakeLeadSchema.parse({
      centerId: getFormValue(formData, "centerId"),
      fullName: getFormValue(formData, "fullName"),
      myKadNumber: getFormValue(formData, "myKadNumber"),
      homeAddress: getFormValue(formData, "homeAddress"),
      preferredDate: getFormValue(formData, "preferredDate"),
      preferredSession: getFormValue(formData, "preferredSession"),
      phoneNumber: getFormValue(formData, "phoneNumber"),
      additionalNotes: getFormValue(formData, "additionalNotes") || undefined,
      consent: getFormValue(formData, "consent"),
      website: getFormValue(formData, "website"),
    });

    const center = await prisma.dialysisCenter.findUnique({
      where: { id: values.centerId },
      select: {
        id: true,
        dialysisCenterName: true,
        email: true,
        phoneNumber: true,
        tel: true,
        whatsappPicName: true,
        whatsappPicPhoneNumber: true,
      },
    });

    if (!center) {
      return NextResponse.json(
        { error: "Pusat dialisis tidak dijumpai" },
        { status: 404 }
      );
    }

    const accessToken = randomBytes(32).toString("hex");
    const accessExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const leadUrl = `${getBaseUrl(request)}/intake-leads/${accessToken}`;
    const handoffTarget =
      center.whatsappPicPhoneNumber || getPrimaryCenterPhoneNumber(center);

    if (!handoffTarget) {
      return NextResponse.json(
        { error: "Nombor WhatsApp pusat belum tersedia" },
        { status: 400 }
      );
    }

    const labResult = await uploadLabResult(formData, center.id, accessToken);

    const lead = await prisma.intakeLead.create({
      data: {
        dialysisCenterId: center.id,
        fullName: values.fullName,
        myKadNumber: values.myKadNumber,
        homeAddress: values.homeAddress,
        preferredDate: new Date(`${values.preferredDate}T00:00:00.000+08:00`),
        preferredSession: values.preferredSession,
        phoneNumber: values.phoneNumber,
        labResultUrl: labResult?.url ?? null,
        labResultS3Key: labResult?.s3Key ?? null,
        labResultOriginalName: labResult?.originalName ?? null,
        additionalNotes: values.additionalNotes || null,
        consentAt: new Date(),
        ipAddress: getRequestIp(request),
        userAgent: request.headers.get("user-agent"),
        whatsappHandoffUrl: "",
        accessToken,
        accessExpiresAt,
      },
    });

    const whatsappHandoffUrl = buildWhatsAppUrlWithMessage(
      handoffTarget,
      buildPatientHandoffMessage({
        centerName: center.dialysisCenterName,
        leadId: lead.id,
        leadUrl,
        values,
        hasLabResult: !!labResult,
      })
    );

    let notificationResult:
      | { status: "sent"; messageId: string | null; error?: never }
      | { status: "skipped_no_email" | "failed"; messageId?: never; error: string };

    const notificationEmails = await getLeadNotificationEmails(center.id, center.email);

    if (notificationEmails.length === 0) {
      notificationResult = {
        status: "skipped_no_email",
        error: "No assigned PIC or center email is configured",
      };
    } else {
      try {
        const email = createIntakeLeadEmail({
          centerName: center.dialysisCenterName,
          leadId: lead.id,
          leadUrl,
          whatsappHandoffUrl,
          fullName: values.fullName,
          myKadNumber: values.myKadNumber,
          homeAddress: values.homeAddress,
          preferredDate: formatDateForMessage(values.preferredDate),
          preferredSession: values.preferredSession,
          phoneNumber: values.phoneNumber,
          hasLabResult: !!labResult,
          additionalNotes: values.additionalNotes,
        });
        const result = await sendEmail({
          to: notificationEmails,
          subject: `Permohonan temujanji baru - ${center.dialysisCenterName}`,
          html: email.html,
          text: email.text,
        });

        notificationResult = {
          status: "sent",
          messageId: result.messageId,
        };
      } catch (error) {
        notificationResult = {
          status: "failed",
          error:
            error instanceof Error
              ? error.message
              : "Failed to send intake lead email",
        };
      }
    }

    await prisma.intakeLead.update({
      where: { id: lead.id },
      data: {
        whatsappHandoffUrl,
        picNotificationStatus: notificationResult.status,
        picNotificationMessageId:
          notificationResult.status === "sent"
            ? notificationResult.messageId
            : null,
        picNotificationError:
          notificationResult.status === "sent"
            ? null
            : notificationResult.error,
      },
    });

    return NextResponse.json({
      leadId: lead.id,
      whatsappHandoffUrl,
      picNotificationStatus: notificationResult.status,
      accessExpiresAt: accessExpiresAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Maklumat tidak lengkap" },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Ralat semasa menghantar permohonan";

    console.error("Error creating intake lead:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
