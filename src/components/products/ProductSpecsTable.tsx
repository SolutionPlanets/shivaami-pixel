"use client";

import { useInView } from "@/hooks/useInView";
import type { ProductSpec } from "@/lib/products";

interface ProductSpecsTableProps {
  specs: ProductSpec[];
  productName: string;
}

export default function ProductSpecsTable({ specs, productName }: ProductSpecsTableProps) {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`reveal ${isVisible ? "visible" : ""}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3">
              {productName} <span className="text-primary">tech specs</span>
            </h2>
            <p className="text-muted-foreground">Full technical specifications for business evaluation.</p>
          </div>

          <div className="rounded-3xl border border-border/60 overflow-hidden bg-white shadow-sm">
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-6 py-4 ${
                  i % 2 === 0 ? "bg-[#FAFAFA]" : "bg-white"
                } ${i < specs.length - 1 ? "border-b border-border/40" : ""}`}
              >
                <p className="text-sm font-semibold text-foreground sm:w-40 shrink-0">{spec.label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
