const UNAVAILABLE_HEPATITIS_REGEX = /\b(?:not available|n\/a|none|tiada|no hep)\b/i;
const AVAILABLE_HEPATITIS_REGEX = /\bhep(?:atitis)?\s*[bc]\b/i;

export function getAvailableHepatitisOptions(value?: string | null): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((option) => option.trim())
    .filter(
      (option) =>
        !UNAVAILABLE_HEPATITIS_REGEX.test(option) &&
        AVAILABLE_HEPATITIS_REGEX.test(option)
    );
}
