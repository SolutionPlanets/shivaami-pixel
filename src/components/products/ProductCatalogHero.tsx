"use client";

import { useInView } from "@/hooks/useInView";
import { Sparkles } from "lucide-react";

export default function ProductCatalogHero() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-br from-[#EEF2FF] via-[#F0F4FF] to-[#E8F5E9]">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#E8D5FF]/60 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`reveal ${isVisible ? "visible" : ""}`}
        >
          {/* Label */}
          <div className="inline-flex items-center gap-2 bg-white/70 border border-border/60 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Pixel for Business
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-5 leading-tight">
            Find the right Pixel
            <br />
            <span className="text-primary">for your business</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-4">
            The only phone that brings the best of Google&apos;s hardware, software, and Gemini — built with enterprise in mind.
          </p>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {[
              "🔐 #1 Security Rating (4 years)",
              "🤖 Gemini AI built-in",
              "🛡 7-year OS updates",
              "🏭 Made in India",
            ].map((pill) => (
              <span
                key={pill}
                className="text-sm text-muted-foreground bg-white/80 border border-border/50 rounded-full px-3.5 py-1.5 backdrop-blur-sm"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
