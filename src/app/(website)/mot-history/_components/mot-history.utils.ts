import type { MotTest } from "./mot-history.types";

export const FALLBACK_VALUE = "N/A";

export function formatRegistrationNumber(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.replace(/\s+/g, "").toUpperCase();
}

export function formatValue(value?: string | number | null) {
  if (value === undefined || value === null) {
    return FALLBACK_VALUE;
  }

  const normalized = String(value).trim();
  return normalized || FALLBACK_VALUE;
}

export function formatDate(value?: string | null) {
  if (!value) {
    return FALLBACK_VALUE;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatMileage(
  value?: string | number | null,
  unit?: string | null,
  odometerResultType?: string | null,
) {
  if (odometerResultType === "UNREADABLE") {
    return "Unreadable";
  }

  if (value === undefined || value === null || value === "") {
    return FALLBACK_VALUE;
  }

  const numberValue = typeof value === "number" ? value : Number(value);
  const mileage = Number.isNaN(numberValue)
    ? String(value)
    : new Intl.NumberFormat("en-GB").format(numberValue);

  return unit ? `${mileage} ${unit}` : mileage;
}

export function getResultTone(result?: string | null) {
  const normalized = result?.toUpperCase();

  if (normalized === "PASSED") {
    return {
      labelClassName: "bg-[#E8FBF0] text-[#16A34A]",
      borderClassName: "border-[#B7E7C8]",
      accentClassName: "bg-[#22C55E]",
      cardClassName: "border-[#D9F6E2] shadow-[0_18px_38px_rgba(34,197,94,0.08)]",
    };
  }

  if (normalized === "FAILED") {
    return {
      labelClassName: "bg-[#FFF4D8] text-[#C27A00]",
      borderClassName: "border-[#F4D27B]",
      accentClassName: "bg-[#F59E0B]",
      cardClassName: "border-[#F8E3AA] shadow-[0_18px_38px_rgba(245,158,11,0.10)]",
    };
  }

  return {
    labelClassName: "bg-[#EEF2FF] text-[#4F46E5]",
    borderClassName: "border-[#CBD5E1]",
    accentClassName: "bg-[#94A3B8]",
    cardClassName: "border-[#E2E8F0] shadow-[0_18px_38px_rgba(148,163,184,0.08)]",
  };
}

export function getLatestTest(tests?: MotTest[] | null) {
  if (!tests?.length) {
    return null;
  }

  return tests[0];
}
