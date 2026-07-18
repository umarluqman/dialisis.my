export const DEFAULT_TREATMENT_UNITS = "HD Unit";

export const TREATMENT_TO_UNIT_MAP = {
  hemodialisis: DEFAULT_TREATMENT_UNITS,
  mrrb: "MRRB Unit",
  transplant: "TX Unit",
  "peritoneal dialisis": "PD Unit",
} as const;

export function getCenterUnits(units?: string | null) {
  const normalized = units?.trim();
  return normalized ? normalized : DEFAULT_TREATMENT_UNITS;
}

export function getCenterUnitList(units?: string | null) {
  return getCenterUnits(units)
    .split(",")
    .map((unit) => unit.trim())
    .filter(Boolean);
}

export function getTreatmentLabel(unit: string) {
  const lowerUnit = unit.toLowerCase();

  if (lowerUnit.includes("hd unit")) return "Hemodialisis";
  if (lowerUnit.includes("tx unit")) return "Transplant";
  if (lowerUnit.includes("mrrb unit")) return "MRRB";

  return "Peritoneal Dialisis";
}

export function getTreatmentBadges(units?: string | null) {
  return getCenterUnitList(units).map((unit) => ({
    name: unit,
    value: getTreatmentLabel(unit),
  }));
}

export function getTreatmentUnit(treatment?: string | null) {
  if (!treatment) return undefined;

  return TREATMENT_TO_UNIT_MAP[
    treatment.toLowerCase() as keyof typeof TREATMENT_TO_UNIT_MAP
  ];
}

export function isHemodialysisTreatment(treatment?: string | null) {
  return treatment?.toLowerCase() === "hemodialisis";
}

export function buildTreatmentUnitsWhere(treatment?: string | null) {
  const unit = getTreatmentUnit(treatment);

  if (!unit) return undefined;

  if (isHemodialysisTreatment(treatment)) {
    return {
      OR: [{ units: { contains: unit } }, { units: { equals: "" } }],
    };
  }

  return {
    units: {
      contains: unit,
    },
  };
}
