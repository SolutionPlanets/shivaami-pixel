"use client";

import { useCart } from "@/context/CartContext";
import { calcSavings, formatInr, getTierLabel, RETAIL_PRICES } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  onCheckout: () => void;
}

export default function OrderSummary({ onCheckout }: OrderSummaryProps) {
  const { items, removeItem, updateQuantity, totalQuantity } = useCart();

  const calcItems = items.map((i) => ({
    slug: i.productSlug,
    quantity: i.quantity,
    unitPriceInr: i.unitPriceInr,
  }));
  const summary = calcSavings(calcItems);

  return (
    <div className="bg-white rounded-3xl border border-border/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
        <h3 className="font-bold text-foreground">Your Order</h3>
        {totalQuantity > 0 && (
          <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
            {totalQuantity}
          </span>
        )}
      </div>

      {/* Items list */}
      <div className="px-6 py-4 flex flex-col gap-4 min-h-[120px]">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Add devices above to build your order
          </p>
        ) : (
          items.map((item) => (
            <div key={item.productSlug} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.productName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-3 h-3 rounded-full border border-border/60 shrink-0"
                      style={{ background: item.color.hex }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.color.name}
                    </span>
                  </div>
                </div>
                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.productSlug)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0 text-xs"
                  aria-label={`Remove ${item.productName}`}
                >
                  ✕
                </button>
              </div>

              {/* Qty stepper + subtotal */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0 rounded-full border border-border/80 overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() =>
                      updateQuantity(item.productSlug, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base font-light"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-foreground tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productSlug, item.quantity + 1)
                    }
                    className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-base font-light"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs font-medium text-foreground tabular-nums">
                  {formatInr(item.unitPriceInr * item.quantity)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      {items.length > 0 && (
        <div className="px-6 pb-4 border-t border-border/60 pt-4 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Retail total</span>
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
          <div className="flex justify-between font-bold text-base pt-1 border-t border-border/60 mt-1">
            <span>You Pay</span>
            <span className="tabular-nums">{formatInr(summary.effectivePrice)}</span>
          </div>
          {summary.benefitsValue > 0 && (
            <p className="text-xs text-muted-foreground">
              + {formatInr(summary.benefitsValue)} in B2B benefits included
            </p>
          )}

          {/* Tier hint */}
          {summary.totalQty > 0 && summary.totalQty < 50 && (
            <p className="text-xs text-primary mt-1">
              {getTierLabel(summary.totalQty)}
            </p>
          )}
        </div>
      )}

      {/* Checkout button */}
      <div className="px-6 pb-6">
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className={cn(
            "w-full py-3 px-5 rounded-full font-semibold text-sm transition-all duration-200",
            items.length === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-white hover:bg-[#1A73E8]"
          )}
        >
          Proceed to Order →
        </button>

        {summary.totalQty >= 50 && (
          <p className="text-xs text-center text-muted-foreground mt-3">
            50+ devices? Our team will contact you for a custom quote.
          </p>
        )}
      </div>
    </div>
  );
}

// Mobile floating cart bar
export function MobileCartBar({ onCheckout }: { onCheckout: () => void }) {
  const { items, totalQuantity } = useCart();

  const calcItems = items.map((i) => ({
    slug: i.productSlug,
    quantity: i.quantity,
    unitPriceInr: RETAIL_PRICES[i.productSlug] ?? i.unitPriceInr,
  }));
  const summary = calcSavings(calcItems);

  if (totalQuantity === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent">
      <button
        onClick={onCheckout}
        className="w-full bg-primary text-white rounded-full py-4 px-6 font-bold shadow-lg flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span className="bg-white text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalQuantity}
          </span>
          Review Order
        </span>
        <span className="tabular-nums text-sm font-semibold">
          {formatInr(summary.effectivePrice)}
        </span>
      </button>
    </div>
  );
}
