import { products } from "@/lib/products";

interface PhonesSoldChartProps {
  soldBySlug: Record<string, number>;
}

export default function PhonesSoldChart({ soldBySlug }: PhonesSoldChartProps) {
  const max = Math.max(...products.map((p) => soldBySlug[p.slug] ?? 0), 1);

  return (
    <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-foreground mb-5">Units Sold by Model</h2>
      <div className="space-y-4">
        {products.map((product) => {
          const count = soldBySlug[product.slug] ?? 0;
          const pct = Math.round((count / max) * 100);
          return (
            <div key={product.slug}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{product.name}</span>
                <span className="text-sm font-semibold text-foreground">{count}</span>
              </div>
              <div className="h-2 rounded-full bg-[#F1F3F4] overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
