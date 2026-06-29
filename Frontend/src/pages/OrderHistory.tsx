import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, RefreshCw } from "lucide-react";
import { getOrders, type Order } from "@/api/orders";
import OrderCard from "@/components/OrderCard";
import { OrderCardSkeleton } from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

/**
 * OrderHistory Page
 *
 * Fetches orders for the logged-in user.
 * The backend identifies the user from the JWT token (Authorization header),
 * so no userId param is needed — the axios interceptor sends the token automatically.
 */
export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    setError(false);
    try {
      const res = await getOrders(); // Token sent via axios interceptor
      setOrders(res.data);           // res = { success, count, data: Order[] }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">My Orders</h1>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="mb-3 text-sm text-muted-foreground">Failed to load orders.</p>
          <button onClick={fetchOrders} className="text-sm font-medium text-primary hover:underline">
            Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package size={48} />}
          title="No orders yet"
          description="Your order history will appear here after you place your first order."
          action={
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110"
            >
              Browse Restaurants <ArrowRight size={16} />
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => <OrderCard key={order._id} order={order} />)}
        </div>
      )}
    </div>
  );
}
