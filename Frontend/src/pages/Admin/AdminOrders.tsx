import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { getAdminOrders, updateOrderStatus, type AdminOrder } from "@/api/admin";
import StatusBadge from "@/components/StatusBadge";

const STATUSES = ["", "placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
const STATUS_LABELS: Record<string, string> = {
  "": "All",
  placed: "Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const NEXT_STATUS: Record<string, string> = {
  placed: "confirmed",
  confirmed: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await getAdminOrders({ status: filter || undefined, limit: 50 });
      setOrders(res.data.data);
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchOrders(); }, [filter]);

  async function handleStatusChange(orderId: string, status: string) {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order → ${STATUS_LABELS[status]}`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch { toast.error("Failed to update order status"); }
    finally { setUpdating(null); }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{orders.length} orders found</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Status Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              filter === s
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-secondary text-muted-foreground hover:bg-accent"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="space-y-px">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-border px-5 py-4">
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-60 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
                <div className="h-8 w-28 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No orders found</div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <div key={order._id} className="flex flex-wrap items-start gap-4 px-5 py-4 transition-colors hover:bg-accent/30 sm:items-center">
                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
                    <span className="font-mono text-[10px] text-muted-foreground">#{order._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {order.restaurantName} · {order.items.length} items · ₹{order.total}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Items summary */}
                <div className="hidden lg:block text-xs text-muted-foreground max-w-[200px]">
                  {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                </div>

                <StatusBadge status={order.status} />

                {/* Action */}
                <div className="flex items-center gap-2">
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => handleStatusChange(order._id, NEXT_STATUS[order.status])}
                      disabled={updating === order._id}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow transition-all hover:brightness-110 disabled:opacity-60"
                    >
                      {updating === order._id ? "..." : `→ ${STATUS_LABELS[NEXT_STATUS[order.status]]}`}
                    </button>
                  )}
                  {order.status !== "cancelled" && order.status !== "delivered" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "cancelled")}
                      disabled={updating === order._id}
                      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-all hover:bg-destructive/20 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
