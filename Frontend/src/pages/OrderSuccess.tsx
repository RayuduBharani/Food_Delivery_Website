import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { getOrderById, type Order } from "@/api/orders";

/**
 * OrderSuccess Page — Shadcn tokens.
 */
export default function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      try { const res = await getOrderById(id); setOrder(res.data); }
      catch (err) { console.error("Failed to fetch order:", err); }
    }
    fetchOrder();
  }, [id]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle size={44} className="text-emerald-400" strokeWidth={1.5} />
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-foreground">Order Placed!</h1>
      <p className="mb-6 text-sm text-muted-foreground">Your order has been placed successfully. We'll prepare it right away!</p>

      {order && (
        <div className="mb-8 w-full rounded-2xl border border-border bg-card p-5 text-left">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Order ID</span>
            <span className="font-mono text-xs font-bold text-foreground">#{order._id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="space-y-1.5 border-t border-border pt-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-bold text-foreground">
            <span>Total</span><span>₹{order.total}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
            <Package size={14} />
            Status: {order.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/orders" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:bg-accent">
          <Package size={16} /> View Order History
        </Link>
        <Link to="/" className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110">
          Continue Ordering <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
