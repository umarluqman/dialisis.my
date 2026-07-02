type IntakeLeadEmailInput = {
  centerName: string;
  leadId: string;
  leadUrl: string;
  whatsappHandoffUrl: string;
  fullName: string;
  myKadNumber: string;
  homeAddress: string;
  preferredDate: string;
  preferredSession: string;
  phoneNumber: string;
  hasLabResult: boolean;
  additionalNotes?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMyKad(myKadNumber: string) {
  return myKadNumber.replace(/^(\d{6})(\d{2})(\d{4})$/, "$1-$2-$3");
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 0;color:#64748b;width:160px;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;color:#0f172a;font-weight:600;">${escapeHtml(value)}</td>
    </tr>
  `;
}

export function createIntakeLeadEmail(input: IntakeLeadEmailInput) {
  const notes = input.additionalNotes?.trim();
  const html = `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
        <div style="max-width:640px;margin:0 auto;padding:24px;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
            <p style="margin:0 0 8px;color:#0f766e;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;">Permohonan temujanji baru</p>
            <h1 style="margin:0 0 8px;font-size:22px;line-height:1.3;">${escapeHtml(input.fullName)}</h1>
            <p style="margin:0 0 20px;color:#64748b;">${escapeHtml(input.centerName)}</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              ${row("Nama penuh", input.fullName)}
              ${row("No. MyKad", formatMyKad(input.myKadNumber))}
              ${row("No. telefon", input.phoneNumber)}
              ${row("Tarikh pilihan", input.preferredDate)}
              ${row("Sesi", input.preferredSession)}
              ${row("Keputusan makmal", input.hasLabResult ? "Dimuat naik" : "Tiada")}
              ${notes ? row("Catatan", notes) : ""}
              ${row("ID permohonan", input.leadId)}
            </table>
            <div style="margin-top:20px;">
              <p style="margin:0 0 6px;color:#64748b;font-size:14px;">Alamat kediaman</p>
              <p style="margin:0;color:#0f172a;font-size:14px;line-height:1.6;">${escapeHtml(input.homeAddress)}</p>
            </div>
            <div style="margin-top:24px;display:block;">
              <a href="${input.leadUrl}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;border-radius:8px;padding:12px 16px;font-weight:700;">Buka rekod permohonan</a>
              <a href="${input.whatsappHandoffUrl}" style="display:inline-block;margin-left:8px;color:#0f766e;text-decoration:none;font-weight:700;">WhatsApp pesakit</a>
            </div>
            <p style="margin:20px 0 0;color:#64748b;font-size:12px;">Link rekod akan tamat tempoh dalam 48 jam.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = [
    "Permohonan temujanji dialisis baru",
    "",
    `Pusat: ${input.centerName}`,
    `Nama penuh: ${input.fullName}`,
    `No. MyKad: ${formatMyKad(input.myKadNumber)}`,
    `No. telefon: ${input.phoneNumber}`,
    `Alamat kediaman: ${input.homeAddress}`,
    `Tarikh pilihan: ${input.preferredDate}`,
    `Sesi: ${input.preferredSession}`,
    `Keputusan makmal: ${input.hasLabResult ? "Dimuat naik" : "Tiada"}`,
    notes ? `Catatan: ${notes}` : null,
    `ID permohonan: ${input.leadId}`,
    "",
    `Rekod permohonan: ${input.leadUrl}`,
    `WhatsApp pesakit: ${input.whatsappHandoffUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}
