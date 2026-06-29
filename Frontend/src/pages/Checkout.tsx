import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { placeOrder } from "@/api/orders";

/**
 * Checkout Page — Delivery form + order summary using Shadcn tokens.
 */
export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, total, restaurantName, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    customerName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="mb-4 text-muted-foreground">Your cart is empty.</p>
        <Link to="/" className="text-primary hover:underline">← Browse Restaurants</Link>
      </div>
    );
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[0-9]{7,15}$/.test(form.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Delivery address is required";
    else if (form.address.trim().length < 10) e.address = "Please enter a complete address";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await placeOrder({
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        items: items.map((i) => ({ menuItem: i._id, quantity: i.quantity })),
        paymentMethod: "cod",
      });
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-success/${res.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const u = { ...prev }; delete u[field]; return u; });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link to="/cart" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 className="mb-6 text-xl font-bold text-foreground">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={handleSubmit} className="space-y-5" id="checkout-form" noValidate>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Delivery Details</h3>

            {/* Name */}
            <div className="mb-4">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><User size={13} />Full Name</label>
              <input type="text" value={form.customerName} onChange={(e) => handleChange("customerName", e.target.value)} placeholder="John Doe"
                className={`w-full rounded-lg border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-1 ${errors.customerName ? "border-destructive focus:ring-destructive" : "border-border focus:border-ring focus:ring-ring"}`} />
              {errors.customerName && <p className="mt-1 text-xs text-destructive">{errors.customerName}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Phone size={13} />Phone Number</label>
              <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+91 98765 43210"
                className={`w-full rounded-lg border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-1 ${errors.phone ? "border-destructive focus:ring-destructive" : "border-border focus:border-ring focus:ring-ring"}`} />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><MapPin size={13} />Delivery Address</label>
              <textarea value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="123 Main St, Apartment 4B, Bangalore 560001" rows={3}
                className={`w-full resize-none rounded-lg border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-1 ${errors.address ? "border-destructive focus:ring-destructive" : "border-border focus:border-ring focus:ring-ring"}`} />
              {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Payment Method</h3>
            <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Cash on Delivery</span>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 lg:hidden">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Placing Order..." : `Place Order · ₹${total}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Order Summary</h3>
            <p className="mb-3 text-xs text-muted-foreground">From <span className="font-medium text-foreground/80">{restaurantName}</span></p>

            <div className="mb-4 space-y-2 border-b border-border pb-4">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-xs text-muted-foreground">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between text-base font-bold text-foreground"><span>Total</span><span>₹{total}</span></div>
              </div>
            </div>

            <button type="submit" form="checkout-form" disabled={loading}
              className="mt-5 hidden w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 lg:flex">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Placing Order..." : `Place Order · ₹${total}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
