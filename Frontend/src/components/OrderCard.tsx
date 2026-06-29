import type { Order } from "@/api/orders";
import StatusBadge from "./StatusBadge";

interface Props {
  order: Order;
}

/**
 * OrderCard — Order history card using Shadcn tokens.
 */
export default function OrderCard({ order }: Props) {
  const date = new Date(order.createdAt);
  const formattedDate = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const formattedTime = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className="mt-0.5 text-xs text-muted-foreground/70">{formattedDate} at {formattedTime}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items */}
      <div className="mb-3 space-y-1.5 border-t border-border pt-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
            <span className="text-muted-foreground">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="text-xs text-muted-foreground">
          {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
        </div>
        <div className="text-right">
          {order.deliveryFee > 0 && <p className="text-[10px] text-muted-foreground">+ ₹{order.deliveryFee} delivery</p>}
          <p className="text-sm font-bold text-foreground">₹{order.total}</p>
        </div>
      </div>
    </div>
  );
}
