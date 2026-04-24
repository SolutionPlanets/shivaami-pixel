"use client";

import { useState } from "react";
import {
  RETAIL_PRICES,
  CORPORATE_PRICING_NOTE,
  formatInr,
} from "@/lib/marketplace";
import { useInView } from "@/hooks/useInView";

const MODELS = [
  { slug: "pixel-10a", label: "Pixel 10a" },
  { slug: "pixel-10", label: "Pixel 10" },
  { slug: "pixel-10-pro-xl", label: "Pixel 10 Pro XL" },
  { slug: "pixel-10-pro-fold", label: "Pixel 10 Pro Fold" },
];

const DEFAULT_QTYS: Record<string, number> = {
  "pixel-10a": 5,
  "pixel-10": 5,
  "pixel-10-pro-xl": 3,
  "pixel-10-pro-fold": 2,
};

const SMB_BENEFITS = [
  {
    title: "Corporate Pricing",
    description:
      "All prices are inclusive of 18% GST with full input tax credit — reducing your effective cost.",
    icon: "🏢",
  },
  {
    title: "2-Year Protection Plan",
    description:
      "Covers accidental & liquid damage. Includes free pan-India pickup and drop for repairs in Year 1.",
    icon: "🛡️",
  },
  {
    title: "1-Year Extended Warranty",
    description:
      "Total 2 years of manufacturer warranty coverage — double the standard period.",
    icon: "✅",
  },
  {
    title: "Exclusive AI Workshops & Support",
    description:
      "Training and ongoing support by Google and Shivaami — Gemini Live, Call Assist, Camera Coach, and more.",
    icon: "🎓",
  },
];

export default function SavingsCalculator() {
  const { ref, isVisible } = useInView(0.1);

  const [qtys, setQtys] = useState<Record<string, number>>(DEFAULT_QTYS);

  const totalQty = MODELS.reduce((s, m) => s + qtys[m.slug], 0);
  const totalPrice = MODELS.reduce(
    (s, m) => s + qtys[m.slug] * RETAIL_PRICES[m.slug],
    0
  );

  function changeQty(slug: string, delta: number) {
    setQtys((prev) => ({
      ...prev,
      [slug]: Math.max(0, prev[slug] + delta),
    }));
  }

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
            SMB Pricing Calculator
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Calculate Your Corporate Price
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Adjust quantities to see the total — all prices include 18% GST
          </p>
        </div>

        <div
          className={`bg-white rounded-3xl shadow-sm border border-border/60 overflow-hidden reveal delay-200 ${isVisible ? "visible" : ""}`}
        >
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60">
            {/* LEFT — quantity inputs */}
            <div className="p-8">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-6">
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
                        {formatInr(RETAIL_PRICES[model.slug])} incl. GST
                      </p>
                    </div>
                    {/* Stepper */}
                    <div className="flex items-center gap-0 rounded-full border border-border/80 overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => changeQty(model.slug, -1)}
                        disabled={qtys[model.slug] === 0}
                        className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-light"
                        aria-label={`Decrease ${model.label}`}
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-foreground tabular-nums">
                        {qtys[model.slug]}
                      </span>
                      <button
                        onClick={() => changeQty(model.slug, 1)}
                        className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-lg font-light"
                        aria-label={`Increase ${model.label}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-8 pt-6 border-t border-border/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">
                    Total devices
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-base font-bold tabular-nums px-4 py-1.5 rounded-full border border-emerald-200">
                    {totalQty}
                  </span>
                </div>
                {totalQty > 0 && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      Total amount
                    </span>
                    <span className="bg-emerald-100 text-emerald-700 font-bold text-base tabular-nums px-4 py-1.5 rounded-full border border-emerald-200">
                      {formatInr(totalPrice)}
                    </span>
                  </div>
                )}
                <p className="text-xs text-primary font-medium mt-3">
                  {CORPORATE_PRICING_NOTE}
                </p>
              </div>
            </div>

            {/* RIGHT — SMB Benefits */}
            <div className="p-8 flex flex-col">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-6">
                SMB Benefits included
              </h3>

              <div className="flex flex-col gap-4 flex-1">
                {SMB_BENEFITS.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-2xl shrink-0 mt-0.5">
                      {benefit.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() =>
                  document
                    .getElementById("order-grid")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full mt-6 bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-[#1A73E8] transition-colors text-sm flex items-center justify-center gap-2"
              >
                Build Your Order →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
