export const RETAIL_PRICES: Record<string, number> = {
  "pixel-10a": 49_999,
  "pixel-10": 79_999,
  "pixel-10-pro": 1_09_999,
  "pixel-10-pro-max": 1_79_999,
};

export const BULK_TIERS = [
  { min: 1, max: 4, discountPct: 5 },
  { min: 5, max: 9, discountPct: 8 },
  { min: 10, max: 19, discountPct: 12 },
  { min: 20, max: 49, discountPct: 15 },
  { min: 50, max: Infinity, discountPct: 18 },
] as const;

export const BENEFIT_VALUES = {
  protection_plan: 4_499,
  zero_touch_deployment: 999,
  cloud_storage: 2_400,
  ai_workshops: 5_000,
  dedicated_support: 1_200,
  google_ai_pro: 23_400,
} as const;

export const PRO_SLUGS = new Set(["pixel-10-pro", "pixel-10-pro-max"]);

export function getDiscountPct(totalQty: number): number {
  return (
    [...BULK_TIERS].reverse().find((t) => totalQty >= t.min)?.discountPct ?? 0
  );
}

export function getTierLabel(totalQty: number): string {
  if (totalQty === 0) return "Add devices to see your discount";
  const pct = getDiscountPct(totalQty);
  const next = BULK_TIERS.find((t) => t.min > totalQty);
  if (!next) return `${pct}% corporate discount (maximum tier)`;
  return `${pct}% corporate discount — add ${next.min - totalQty} more for ${next.discountPct}%`;
}

export function calcItemBenefitValue(slug: string): number {
  const base =
    BENEFIT_VALUES.protection_plan +
    BENEFIT_VALUES.zero_touch_deployment +
    BENEFIT_VALUES.cloud_storage +
    BENEFIT_VALUES.ai_workshops +
    BENEFIT_VALUES.dedicated_support;
  return PRO_SLUGS.has(slug) ? base + BENEFIT_VALUES.google_ai_pro : base;
}

export interface SavingsSummary {
  retailTotal: number;
  discountPct: number;
  discountAmount: number;
  benefitsValue: number;
  grandTotalSavings: number;
  effectivePrice: number;
  totalQty: number;
}

export function calcSavings(
  items: Array<{ slug: string; quantity: number; unitPriceInr: number }>
): SavingsSummary {
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const retailTotal = items.reduce(
    (s, i) => s + i.quantity * i.unitPriceInr,
    0
  );
  const discountPct = getDiscountPct(totalQty);
  const discountAmount = Math.round(retailTotal * (discountPct / 100));
  const benefitsValue = items.reduce(
    (s, i) => s + i.quantity * calcItemBenefitValue(i.slug),
    0
  );
  return {
    retailTotal,
    discountPct,
    discountAmount,
    benefitsValue,
    grandTotalSavings: discountAmount + benefitsValue,
    effectivePrice: retailTotal - discountAmount,
    totalQty,
  };
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
