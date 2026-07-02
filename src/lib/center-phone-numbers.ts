type CenterPhoneFields = {
  phoneNumber?: string | null;
  tel?: string | null;
};

const PHONE_SEPARATOR_REGEX = /[,;/\n]+/;

function getPhoneDedupKey(phoneNumber: string): string {
  const digitsOnly = phoneNumber.replace(/[^\d]/g, "");
  if (!digitsOnly) return phoneNumber.trim().toLowerCase();

  if (digitsOnly.startsWith("60")) return digitsOnly;
  if (digitsOnly.startsWith("0")) return `60${digitsOnly.slice(1)}`;
  return digitsOnly;
}

export function getCenterPhoneNumbers({
  phoneNumber,
  tel,
}: CenterPhoneFields): string[] {
  const uniqueNumbers = new Set<string>();
  const allNumbers: string[] = [];

  for (const rawValue of [phoneNumber, tel]) {
    if (!rawValue) continue;

    const chunks = rawValue
      .split(PHONE_SEPARATOR_REGEX)
      .map((chunk) => chunk.trim())
      .filter(Boolean);

    for (const number of chunks) {
      const dedupKey = getPhoneDedupKey(number);
      if (uniqueNumbers.has(dedupKey)) continue;
      uniqueNumbers.add(dedupKey);
      allNumbers.push(number);
    }
  }

  return allNumbers;
}

export function getPrimaryCenterPhoneNumber(
  phoneFields: CenterPhoneFields
): string | null {
  return getCenterPhoneNumbers(phoneFields)[0] ?? null;
}

export function normalizeMalaysiaPhoneNumber(phoneNumber: string): string {
  const digitsOnly = phoneNumber.replace(/[^\d]/g, "");
  if (!digitsOnly) return "";

  return digitsOnly.startsWith("60")
    ? digitsOnly
    : digitsOnly.startsWith("0")
    ? `6${digitsOnly}`
    : digitsOnly;
}

export function buildWhatsAppUrl(phoneNumber: string, text?: string): string {
  const normalizedPhoneNumber = normalizeMalaysiaPhoneNumber(phoneNumber);
  if (!normalizedPhoneNumber) return "";

  const baseUrl = `https://wa.me/${normalizedPhoneNumber}`;
  return text ? `${baseUrl}?text=${text}` : baseUrl;
}

export function buildWhatsAppUrlWithMessage(
  phoneNumber: string,
  message: string
): string {
  return buildWhatsAppUrl(phoneNumber, encodeURIComponent(message));
}
