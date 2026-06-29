import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItemComponent from "@/components/CartItem";
import EmptyState from "@/components/EmptyState";

/**
 * Cart Page — using Shadcn tokens.
 */
export default function Cart() {
  const { items, restaurantName, subtotal, deliveryFee, total, itemCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          icon={<ShoppingBag size={48} />}
          title="Your cart is empty"
          description="Explore restaurants and add delicious items to your cart."
          action={
            <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110">
              Browse Restaurants <ArrowRight size={16} />
            </Link>
          }
        />
      </div>
    );
  }

  const amountToFreeDelivery = 500 - subtotal;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Your Cart</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            From <span className="font-medium text-foreground/80">{restaurantName}</span>
          </p>
        </div>
        <button onClick={clearCart} className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
          <Trash2 size={14} />
          Clear Cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {items.map((item) => <CartItemComponent key={item._id} item={item} />)}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Order Summary</h3>

            {amountToFreeDelivery > 0 && (
              <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs text-primary">
                  Add ₹{amountToFreeDelivery.toFixed(0)} more for <span className="font-bold">free delivery</span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
                </div>
              </div>
            )}

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="border-t border-border pt-2.5">
                <div className="flex justify-between text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
