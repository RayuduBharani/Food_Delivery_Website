import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, MapPin, ArrowLeft, ShoppingCart } from "lucide-react";
import { getRestaurantById, type Restaurant, type MenuItem } from "@/api/restaurants";
import MenuItemCard from "@/components/MenuItemCard";
import { MenuItemSkeleton } from "@/components/LoadingSkeleton";
import { useCart } from "@/context/CartContext";

/**
 * RestaurantDetail — Restaurant info + menu using Shadcn tokens.
 */
export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { itemCount, total } = useCart();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getRestaurantById(id);
        setRestaurant(res.data.restaurant);
        setMenuItems(res.data.menuItems);
      } catch (err) { console.error("Failed to fetch restaurant:", err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [id]);

  const grouped = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 h-56 animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <MenuItemSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-muted-foreground">
        <p className="text-lg">Restaurant not found</p>
        <Link to="/" className="mt-4 text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <div className="relative h-56 overflow-hidden sm:h-72">
        <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <Link to="/" className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-all hover:bg-background/80">
          <ArrowLeft size={14} />
          Back
        </Link>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{restaurant.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {restaurant.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1"><Clock size={14} />{restaurant.deliveryTime} mins</span>
              {restaurant.address && <span className="flex items-center gap-1"><MapPin size={14} />{restaurant.address}</span>}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {restaurant.cuisine.map((c) => (
                <span key={c} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground backdrop-blur-sm">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">Menu</h2>

        {Object.keys(grouped).length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No menu items available.</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="mb-3 border-b border-border pb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{category}</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <MenuItemCard key={item._id} item={item} restaurantId={restaurant._id} restaurantName={restaurant.name} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{itemCount}</span>{" "}
              {itemCount === 1 ? "item" : "items"} · ₹{total}
            </div>
            <Link to="/cart" className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110">
              <ShoppingCart size={16} />
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
