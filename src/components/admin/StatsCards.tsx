import { ShoppingBag, IndianRupee, Smartphone, Clock } from "lucide-react";

interface Stats {
  totalOrders: number;
  totalRevenuePaise: number;
  unitsSold: number;
  pendingOrders: number;
}

function fmt(paise: number) {
  const rupees = paise / 100;
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(1)}K`;
  return `₹${rupees.toFixed(0)}`;
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      bg: "#D2E3FC",
      iconColor: "#1A73E8",
    },
    {
      label: "Total Revenue",
      value: fmt(stats.totalRevenuePaise),
      icon: IndianRupee,
      bg: "#CEEAD6",
      iconColor: "#1E8E3E",
    },
    {
      label: "Units Sold",
      value: stats.unitsSold.toString(),
      icon: Smartphone,
      bg: "#E8D5FF",
      iconColor: "#7C3AED",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      bg: "#FDE8C8",
      iconColor: "#E37400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-border/60 p-5 flex items-start gap-4 shadow-sm"
          >
            <div
              className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
              style={{ background: card.bg }}
            >
              <Icon className="w-5 h-5" style={{ color: card.iconColor }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
