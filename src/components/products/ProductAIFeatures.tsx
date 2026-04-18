"use client";

import { useInView } from "@/hooks/useInView";
import type { AIFeature } from "@/lib/products";

const tagColors: Record<string, { bg: string; text: string }> = {
  AI: { bg: "#E8D5FF", text: "#7C3AED" },
  Productivity: { bg: "#D2E3FC", text: "#1A73E8" },
  Smart: { bg: "#FEF0CD", text: "#F29900" },
  Camera: { bg: "#CEEAD6", text: "#1E8E3E" },
  Security: { bg: "#FCE8E6", text: "#D93025" },
  Enterprise: { bg: "#E8F5E9", text: "#1E8E3E" },
  Hardware: { bg: "#F3F4F6", text: "#374151" },
  Safety: { bg: "#FFF3E0", text: "#E65100" },
};

interface ProductAIFeaturesProps {
  features: AIFeature[];
  productName: string;
}

export default function ProductAIFeatures({ features, productName }: ProductAIFeaturesProps) {
  const { ref: headerRef, isVisible: headerVisible } = useInView(0.1);

  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-14 reveal ${headerVisible ? "visible" : ""}`}
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3">
            How AI makes{" "}
            <span className="text-primary">{productName} more helpful</span>
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            Google AI built in from the ground up — not bolted on. Every feature designed to make your team more productive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.name} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: AIFeature; index: number }) {
  const { ref, isVisible } = useInView(0.1);
  const delays = ["delay-100", "delay-200", "delay-300", "delay-100", "delay-200", "delay-300"];
  const tagStyle = tagColors[feature.tag] ?? { bg: "#F3F4F6", text: "#374151" };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${delays[index] ?? ""} ${isVisible ? "visible" : ""} bg-white rounded-3xl border border-border/60 p-6 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{feature.icon}</span>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: tagStyle.bg, color: tagStyle.text }}
        >
          {feature.tag}
        </span>
      </div>
      <h3 className="font-bold text-base text-foreground mb-2">{feature.name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
    </div>
  );
}
