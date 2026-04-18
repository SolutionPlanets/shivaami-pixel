export interface CustomerRow {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  orderCount: number;
  joinedAt: string;
}

export default function CustomersTable({ customers }: { customers: CustomerRow[] }) {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border/60 p-8 text-center shadow-sm">
        <p className="text-muted-foreground">No customers yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/60">
        <h2 className="text-base font-semibold text-foreground">Customers</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-[#FAFAFA]">
              {["Name", "Company", "Email", "Phone", "Orders", "Joined"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, i) => (
              <tr
                key={customer.id}
                className={`border-b border-border/30 hover:bg-[#FAFAFA] transition-colors ${i % 2 === 0 ? "" : "bg-[#FAFAFA]/50"}`}
              >
                <td className="px-4 py-3 font-medium text-foreground">{customer.fullName || "—"}</td>
                <td className="px-4 py-3 text-foreground">{customer.companyName || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{customer.phone || "—"}</td>
                <td className="px-4 py-3">
                  <span className="inline-block text-xs font-semibold bg-primary/10 text-primary rounded-full px-2.5 py-1">
                    {customer.orderCount}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(customer.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
