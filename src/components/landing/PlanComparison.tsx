"use client";

import { useInView } from "@/hooks/useInView";
import { Check, X, BadgePercent, Shield, Rocket, Star, Sparkles } from "lucide-react";

const rows = [
  { feature: "2-Year Protection (water + theft)", business: true, retail: false },
  { feature: "1-Year Extended Warranty", business: true, retail: false },
  { feature: "Zero-Touch Deployment", business: true, retail: false },
  { feature: "Corporate / SMB Pricing", business: true, retail: false },
  { feature: "AI Productivity Workshops", business: true, retail: false },
  { feature: "Free Google Cloud Storage", business: true, retail: false },
  { feature: "Dedicated Account Manager", business: true, retail: false },
  { feature: "Standard 1-Year Warranty", business: true, retail: true },
  { feature: "Google AI Features (Gemini)", business: true, retail: true },
  { feature: "7 Years OS + Security Updates", business: true, retail: true },
];

export default function PlanComparison() {
  const { ref, isVisible } = useInView(0.1);
  return (
    <section className="relative py-28 bg-[#FFF9F0] overflow-hidden">
      {/* Floating icons */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <BadgePercent className="absolute top-12 left-16 w-9 h-9 text-[#EA4335]/25 animate-float" style={{ animationDelay: "0.2s" }} />
        <Shield className="absolute top-28 right-16 w-8 h-8 text-[#4285F4]/30 animate-float-slow" style={{ animationDelay: "0.9s" }} />
        <Rocket className="absolute bottom-20 left-1/3 w-8 h-8 text-[#1E8E3E]/28 animate-float-reverse" style={{ animationDelay: "0.6s" }} />
        <Star className="absolute bottom-14 right-28 w-7 h-7 text-[#FBBC05]/40 animate-float" style={{ animationDelay: "1.4s" }} />
        <Sparkles className="absolute top-1/2 right-1/4 w-7 h-7 text-[#7C3AED]/25 animate-float-slow" style={{ animationDelay: "1.1s" }} />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={ref as React.RefObject<HTMLDivElement>} className={`text-center mb-16 reveal ${isVisible ? "visible" : ""}`}>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Why Choose Shivaami
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Pixel for Business vs. Regular Retail
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg">
            The Shivaami business plan gives your team far more than just a
            phone — at pricing retail can&apos;t match.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-border/60 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-3 border-b border-border">
            <div className="p-5 col-span-1" />
            <div className="p-5 text-center border-l border-border">
              <div className="inline-flex items-center gap-1.5 mb-1">
                <div className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                </div>
                <span className="font-bold text-sm text-foreground">Shivaami Business</span>
              </div>
              <p className="text-xs text-primary font-medium">via Pixel for Business</p>
            </div>
            <div className="p-5 text-center border-l border-border">
              <p className="font-semibold text-sm text-muted-foreground">Retail Purchase</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Any store</p>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 border-b border-border/50 last:border-0 ${
                i % 2 === 0 ? "bg-white" : "bg-muted/20"
              }`}
            >
              <div className="p-4 pl-5 flex items-center">
                <span className="text-sm text-foreground/80">{row.feature}</span>
              </div>
              <div className="p-4 flex items-center justify-center border-l border-border/50">
                {row.business ? (
                  <div className="w-6 h-6 rounded-full bg-[#E6F4EA] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#1E8E3E]" strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-center border-l border-border/50">
                {row.retail ? (
                  <div className="w-6 h-6 rounded-full bg-[#E6F4EA] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#1E8E3E]" strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          * Benefits subject to Shivaami business plan terms and conditions.
        </p>
      </div>
    </section>

  );
}
