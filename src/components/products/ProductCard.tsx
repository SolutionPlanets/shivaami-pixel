"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { ref, isVisible } = useInView(0.1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const delays = ["delay-100", "delay-200", "delay-300", "delay-400"];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${delays[index] ?? ""} ${isVisible ? "visible" : ""} flex flex-col bg-white rounded-3xl border border-border/60 overflow-hidden hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1.5 hover:border-primary/30 transition-all duration-300 group`}
    >
      {/* Device visual */}
      <div
        className="relative h-48 overflow-hidden"
        style={{ background: product.accentBg }}
      >
        <video
          ref={videoRef}
          src={product.video}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          loop
        />
        {/* Badge */}
        <span className={`absolute top-3 left-3 z-10 text-xs font-semibold px-2.5 py-1 rounded-full ${product.badgeColor}`}>
          {product.badge}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-bold text-lg text-foreground mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-snug">{product.tagline}</p>

        {/* Highlights */}
        <ul className="flex flex-col gap-1.5 mb-5">
          {product.highlights.slice(0, 3).map((h) => (
            <li key={h} className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0 mt-1.5" />
              {h}
            </li>
          ))}
        </ul>

        {/* Colors */}
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2">Colors</p>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <div
                key={color.name}
                title={color.name}
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-border/40"
                style={{ background: color.hex }}
              />
            ))}
          </div>
        </div>

        {/* Price */}
        <p className="text-xs text-muted-foreground mb-4">
          <span className="font-medium text-foreground">Price:</span> {product.priceFrom}
        </p>

        {/* CTAs */}
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "rounded-full w-full justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white"
            )}
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/marketplace"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full w-full justify-center border-primary/30 text-primary hover:bg-primary/5"
            )}
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
