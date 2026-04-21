"use client";

import { useState, useEffect, useRef } from "react";
import {
  RETAIL_PRICES,
  BENEFIT_VALUES,
  PRO_SLUGS,
  calcSavings,
  formatInr,
  getTierLabel,
} from "@/lib/marketplace";
import { useInView } from "@/hooks/useInView";

const MODELS = [
  { slug: "pixel-10a", label: "Pixel 10a", defaultQty: 5 },
  { slug: "pixel-10", label: "Pixel 10", defaultQty: 5 },
  { slug: "pixel-10-pro", label: "Pixel 10 Pro XL", defaultQty: 3 },
  { slug: "pixel-10-pro-max", label: "Pixel 10 Pro Fold", defaultQty: 2 },
];

const BENEFITS = [
  { key: "protection_plan", label: "2-Year Protection Plan", value: BENEFIT_VALUES.protection_plan, proOnly: false },
  { key: "zero_touch_deployment", label: "Zero-Touch Deployment", value: BENEFIT_VALUES.zero_touch_deployment, proOnly: false },
  { key: "cloud_storage", label: "Free Google Cloud Storage", value: BENEFIT_VALUES.cloud_storage, proOnly: false },
  { key: "ai_workshops", label: "AI Productivity Workshops", value: BENEFIT_VALUES.ai_workshops, proOnly: false },
  { key: "dedicated_support", label: "Dedicated Business Support", value: BENEFIT_VALUES.dedicated_support, proOnly: false },
  { key: "google_ai_pro", label: "Google AI Pro", value: BENEFIT_VALUES.google_ai_pro, proOnly: true },
] as const;

export default function SavingsCalculator() {
  const { ref, isVisible } = useInView(0.1);

  const [qtys, setQtys] = useState<Record<string, number>>(
    Object.fromEntries(MODELS.map((m) => [m.slug, m.defaultQty]))
  );

  const items = MODELS.map((m) => ({
    slug: m.slug,
    quantity: qtys[m.slug],
    unitPriceInr: RETAIL_PRICES[m.slug],
  }));

  const summary = calcSavings(items);

  // Animated counter for grand total savings
  const [displayedSavings, setDisplayedSavings] = useState(summary.grandTotalSavings);
  const animFrameRef = useRef<number>(0);
  const prevSavingsRef = useRef(summary.grandTotalSavings);

  useEffect(() => {
    const start = prevSavingsRef.current;
    const target = summary.grandTotalSavings;
    prevSavingsRef.current = target;
    if (start === target) return;

    const duration = 600;
    const startTime = performance.now();

    function step(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedSavings(Math.round(start + (target - start) * eased));
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    }

    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [summary.grandTotalSavings]);

  function changeQty(slug: string, delta: number) {
    setQtys((prev) => ({
      ...prev,
      [slug]: Math.max(0, prev[slug] + delta),
    }));
  }

  const proQty = (qtys["pixel-10-pro"] ?? 0) + (qtys["pixel-10-pro-max"] ?? 0);
  const nonProQty = (qtys["pixel-10a"] ?? 0) + (qtys["pixel-10"] ?? 0);
  const savingsPct =
    summary.retailTotal > 0
      ? Math.round(
          (summary.grandTotalSavings /
            (summary.retailTotal + summary.benefitsValue)) *
            100
        )
      : 0;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="bg-[#F0F4FF] py-16 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div
          className={`text-center mb-10 reveal delay-100 ${isVisible ? "visible" : ""}`}
        >
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full border border-primary/20 mb-4 tracking-wide uppercase">
            Interactive Savings Calculator
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            See How Much Your Business Saves
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Adjust quantities below — watch your total savings update instantly
          </p>
        </div>

        <div
          className={`bg-white rounded-3xl shadow-sm border border-border/60 overflow-hidden reveal delay-200 ${isVisible ? "visible" : ""}`}
        >
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60">
            {/* LEFT — quantity inputs */}
            <div className="p-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">
                How many devices?
              </h3>

              <div className="flex flex-col gap-5">
                {MODELS.map((model) => (
                  <div
                    key={model.slug}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {model.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        MRP {formatInr(RETAIL_PRICES[model.slug])}
                        {PRO_SLUGS.has(model.slug) && (
                          <span className="ml-1.5 text-primary font-medium">
                            + AI Pro
                          </span>
                        )}
                      </p>
                    </div>
                    {/* Stepper */}
                    <div className="flex items-center gap-0 rounded-full border border-border/80 overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => changeQty(model.slug, -1)}
                        disabled={qtys[model.slug] === 0}
                        className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-light"
                        aria-label={`Decrease ${model.label} quantity`}
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-foreground tabular-nums">
                        {qtys[model.slug]}
                      </span>
                      <button
                        onClick={() => changeQty(model.slug, 1)}
                        className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-lg font-light"
                        aria-label={`Increase ${model.label} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total device count */}
              <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total devices
                </span>
                <span className="text-2xl font-bold text-foreground tabular-nums">
                  {summary.totalQty}
                </span>
              </div>

              {/* Tier info */}
              {summary.totalQty > 0 && (
                <p className="mt-3 text-xs text-primary font-medium">
                  {getTierLabel(summary.totalQty)}
                </p>
              )}
            </div>

            {/* RIGHT — savings breakdown */}
            <div className="p-8 flex flex-col">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">
                Your savings breakdown
              </h3>

              {/* Retail vs effective price */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retail total (MRP)</span>
                  <span className="line-through text-muted-foreground tabular-nums">
                    {formatInr(summary.retailTotal)}
                  </span>
                </div>
                {summary.discountPct > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 font-medium">
                      Bulk discount ({summary.discountPct}%)
                    </span>
                    <span className="text-emerald-600 font-semibold tabular-nums">
                      −{formatInr(summary.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold border-t border-border/60 pt-2 mt-1">
                  <span className="text-foreground">You pay</span>
                  <span className="text-foreground tabular-nums">
                    {formatInr(summary.effectivePrice)}
                  </span>
                </div>
              </div>

              {/* Benefits breakdown */}
              <div className="bg-muted/30 rounded-2xl p-4 mb-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Bundled B2B benefits value
                </p>
                <div className="flex flex-col gap-2">
                  {BENEFITS.map((benefit) => {
                    const qty = benefit.proOnly ? proQty : summary.totalQty;
                    if (qty === 0) return null;
                    const total = benefit.value * qty;
                    return (
                      <div
                        key={benefit.key}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="text-emerald-500">✓</span>
                          {benefit.label}
                          {benefit.proOnly && (
                            <span className="text-primary text-[10px] font-medium">
                              (Pro/Fold)
                            </span>
                          )}
                        </span>
                        <span className="font-medium text-foreground tabular-nums">
                          +{formatInr(total)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grand total savings — animated */}
              <div className="bg-accent rounded-2xl p-5 text-center mb-6">
                <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-1">
                  Total Value You Get
                </p>
                <p className="text-4xl font-bold text-foreground tabular-nums leading-tight">
                  {formatInr(displayedSavings)}
                </p>
                <p className="text-sm text-foreground/60 mt-1">
                  vs buying retail with no business benefits
                </p>
              </div>

              {/* Progress bar */}
              {summary.totalQty > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Savings vs retail</span>
                    <span className="font-semibold text-foreground">
                      {savingsPct}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(savingsPct, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() =>
                  document
                    .getElementById("order-grid")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-[#1A73E8] transition-colors text-sm flex items-center justify-center gap-2 mt-auto"
              >
                Get This Deal
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
