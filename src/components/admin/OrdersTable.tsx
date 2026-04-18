const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export interface OrderRow {
  id: string;
  customerName: string;
  customerEmail: string;
  products: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function OrdersTable({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border/60 p-8 text-center shadow-sm">
        <p className="text-muted-foreground">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/60">
        <h2 className="text-base font-semibold text-foreground">Recent Orders</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-[#FAFAFA]">
              {["Order ID", "Customer", "Product(s)", "Qty", "Amount", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.id}
                className={`border-b border-border/30 hover:bg-[#FAFAFA] transition-colors ${i % 2 === 0 ? "" : "bg-[#FAFAFA]/50"}`}
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{order.id.slice(0, 8)}…</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-foreground">{order.products}</td>
                <td className="px-4 py-3 text-center text-foreground">{order.quantity}</td>
                <td className="px-4 py-3 text-foreground font-medium">
                  ₹{(order.totalAmount / 100).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-50 text-gray-700 border-gray-200"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
