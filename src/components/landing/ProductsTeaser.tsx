"use client";

import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

const products = [
  {
    name: "Pixel 10a",
    tagline: "Smart choice for every team member",
    badge: "Most Affordable",
    badgeColor: "bg-[#CEEAD6] text-[#1E8E3E]",
    colors: ["#1F1F1F", "#F8F9FA", "#C8A2C8"],
    colorNames: ["Obsidian", "Porcelain", "Lavender"],
    accentBg: "#CEEAD6",
    features: ["Gemini Built-in", "6.1\" display", "Long battery life"],
    slug: "pixel-10a",
  },
  {
    name: "Pixel 10",
    tagline: "The perfect business everyday driver",
    badge: "Best Seller",
    badgeColor: "bg-[#D2E3FC] text-[#1A73E8]",
    colors: ["#1F1F1F", "#E8F0FE", "#C8A2C8"],
    colorNames: ["Obsidian", "Porcelain", "Lavender"],
    accentBg: "#D2E3FC",
    features: ["Gemini Live", "Call Assist", "Camera Coach"],
    slug: "pixel-10",
  },
  {
    name: "Pixel 10 Pro",
    tagline: "Pro performance for power users",
    badge: "Popular",
    badgeColor: "bg-[#E8D5FF] text-[#7C3AED]",
    colors: ["#1F1F1F", "#C0C0C0", "#E8D5FF"],
    colorNames: ["Obsidian", "Sterling", "Lavender"],
    accentBg: "#E8D5FF",
    features: ["Pro camera system", "Magic Cue", "7 years updates"],
    slug: "pixel-10-pro",
  },
  {
    name: "Pixel 10 Pro XL",
    tagline: "The ultimate flagship experience",
    badge: "Flagship",
    badgeColor: "bg-[#FCE8E6] text-[#D93025]",
    colors: ["#1F1F1F", "#C0C0C0", "#E8D5FF"],
    colorNames: ["Obsidian", "Sterling", "Lavender"],
    accentBg: "#FEF0CD",
    features: ["6.9\" Pro Display", "Titan chip", "All AI features"],
    slug: "pixel-10-pro-max",
  },
];

export default function ProductsTeaser() {
  const { ref: headerRef, isVisible: headerVisible } = useInView(0.1);

  return (
    <section id="products" className="py-28 bg-[#F0F4FF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 reveal ${headerVisible ? "visible" : ""}`}
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Pixel 10 Series
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
            Four phones.{" "}
            <span className="text-primary">One business plan.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Every Pixel in the lineup comes with the full Shivaami business
            package — pick the right model for each role in your team.
          </p>
        </div>

        {/* Big Portrait Hero Banner */}
        <HeroBanner />

        {/* Product Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/marketplace"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-8 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white gap-2 inline-flex items-center shadow-lg shadow-primary/20"
            )}
          >
            Order for Your Business
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HeroBanner() {
  const { ref, isVisible } = useInView(0.1);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${isVisible ? "visible" : ""} relative rounded-3xl overflow-hidden bg-[#DDE5FF] mb-4`}
    >
      <div className="flex flex-col md:flex-row items-center">
        {/* Text side */}
        <div className="flex-1 px-8 py-10 md:py-14 md:px-12 z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary animate-float" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              New · H1 2026
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-3 leading-tight">
            Google Pixel 10
            <br />
            <span className="text-primary">with Gemini</span>
          </h3>
          <p className="text-[#3d3d5c]/70 mb-6 max-w-xs leading-relaxed">
            The smartest, most protected business phone in India — available exclusively through Shivaami.
          </p>
          <Link
            href="/products"
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-full bg-primary text-white gap-1.5 inline-flex items-center hover:bg-primary/90"
            )}
          >
            Explore lineup <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {/* Image side */}
        <div className="w-full md:w-72 lg:w-80 shrink-0">
          <Image
            src="/assets/pixel-hero-portrait.png"
            alt="Google Pixel 10 Pro and 10a"
            width={400}
            height={400}
            className="w-full h-56 md:h-64 object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: (typeof products)[0];
  index: number;
}) {
  const { ref, isVisible } = useInView(0.1);
  const delays = ["delay-100", "delay-200", "delay-300", "delay-400"];

  return (
    <Link
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={`/products/${product.slug}`}
      className={`reveal ${delays[index]} ${isVisible ? "visible" : ""} group flex flex-col bg-white rounded-3xl border border-border/60 p-6 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1.5 hover:border-primary/30 transition-all duration-300`}
    >
      {/* Badge row */}
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.badgeColor}`}>
          {product.badge}
        </span>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
      </div>

      {/* Device Visual */}
      <div className="flex justify-center mb-5">
        <div
          className="w-20 h-36 rounded-[20px] flex items-center justify-center font-bold text-3xl text-foreground/20 group-hover:scale-110 transition-transform duration-300 shadow-inner"
          style={{ background: product.accentBg }}
        >
          G
        </div>
      </div>

      <h3 className="font-bold text-base text-foreground mb-1">{product.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-snug">{product.tagline}</p>

      {/* Features */}
      <div className="flex flex-col gap-1.5 mb-5">
        {product.features.map((f) => (
          <span key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary inline-block shrink-0" />
            {f}
          </span>
        ))}
      </div>

      {/* Color swatches */}
      <div className="mt-auto">
        <p className="text-xs text-muted-foreground mb-2">Colors</p>
        <div className="flex gap-2">
          {product.colors.map((color, i) => (
            <div
              key={color}
              title={product.colorNames[i]}
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-border/40"
              style={{ background: color }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
