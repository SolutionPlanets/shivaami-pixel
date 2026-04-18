"use client";

import { useState } from "react";
import type { ProductColor } from "@/lib/products";

interface ProductColorSelectorProps {
  colors: ProductColor[];
  onColorChange?: (color: ProductColor, index: number) => void;
}

export default function ProductColorSelector({
  colors,
  onColorChange,
}: ProductColorSelectorProps) {
  const [selected, setSelected] = useState(0);

  function handleSelect(color: ProductColor, index: number) {
    setSelected(index);
    onColorChange?.(color, index);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-sm text-muted-foreground">Color:</p>
        <p className="text-sm font-semibold text-foreground">{colors[selected]?.name}</p>
      </div>
      <div className="flex gap-2.5">
        {colors.map((color, i) => (
          <button
            key={color.name}
            title={color.name}
            onClick={() => handleSelect(color, i)}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
              selected === i
                ? "border-primary scale-110 shadow-md shadow-primary/20"
                : "border-white ring-1 ring-border/40 hover:scale-105"
            }`}
            style={{ background: color.hex }}
            aria-label={color.name}
            aria-pressed={selected === i}
          />
        ))}
      </div>
    </div>
  );
}
