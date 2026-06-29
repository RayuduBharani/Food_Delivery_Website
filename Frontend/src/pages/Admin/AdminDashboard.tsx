import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag, UtensilsCrossed, Users, IndianRupee,
  Clock, CheckCircle, Truck, XCircle, ChefHat,
} from "lucide-react";
import { getAdminStats, type AdminStats } from "@/api/admin";
import StatusBadge from "@/components/StatusBadge";

const statCards = [
  { key: "totalOrders", label: "Total Orders", icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-500/10" },
  { key: "totalRevenue", label: "Total Revenue", icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10", prefix: "₹" },
  { key: "totalRestaurants", label: "Restaurants", icon: UtensilsCrossed, color: "text-primary", bg: "bg-primary/10" },
  { key: "totalUsers", label: "Customers", icon: Users, color: "text-violet-400", bg: "bg-violet-500/10" },
];

const statusIcons: Record<string, { icon: typeof Clock; color: string }> = {
  placed:           { icon: Clock,         color: "text-blue-400" },
  confirmed:        { icon: CheckCircle,   color: "text-violet-400" },
  preparing:        { icon: ChefHat,       color: "text-yellow-400" },
  out_for_delivery: { icon: Truck,         color: "text-primary" },
  delivered:        { icon: CheckCircle,   color: "text-emerald-400" },
  cancelled:        { icon: XCircle,       color: "text-destructive" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back, Admin 👋</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color, bg, prefix }) => (
          <div key={key} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <div className={`rounded-lg ${bg} p-2`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            {loading ? (
              <div className="h-7 w-24 animate-pulse rounded-md bg-muted" />
            ) : (
              <p className="text-2xl font-bold text-foreground">
                {prefix}{stats ? stats[key as keyof AdminStats]?.toLocaleString("en-IN") : 0}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Recent Orders */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-border">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div className="space-y-1.5">
                      <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                  </div>
                ))
              : stats?.recentOrders.map((o) => (
                  <div key={o._id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        ₹{o.total} · {new Date(o.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                ))}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Orders by Status</h2>
          </div>
          <div className="space-y-2 p-5">
            {Object.entries(statusIcons).map(([status, { icon: Icon, color }]) => {
              const count = stats?.ordersByStatus[status] || 0;
              const total = stats?.totalOrders || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className={`flex items-center gap-1.5 font-medium capitalize ${color}`}>
                      <Icon size={12} />
                      {status.replace(/_/g, " ")}
                    </span>
                    <span className="text-muted-foreground">{loading ? "—" : `${count} (${pct}%)`}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${color.replace("text-", "bg-")}`}
                      style={{ width: loading ? "0%" : `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
