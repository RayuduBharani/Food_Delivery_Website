import { Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { MenuItem } from "@/api/restaurants";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface Props {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}

/**
 * MenuItemCard — Single dish card using Shadcn tokens.
 *
 * Unauthenticated users who click ADD are redirected to /login,
 * with /restaurant/:id stored as the return destination.
 */
export default function MenuItemCard({ item, restaurantId, restaurantName }: Props) {
  const { addItem, increment, decrement, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const quantity = getItemQuantity(item._id);

  function handleAdd() {
    if (!isAuthenticated) {
      // Redirect to login; after login they'll return to this restaurant page
      navigate("/login", {
        state: { from: { pathname: `/restaurant/${restaurantId}` } },
      });
      return;
    }
    addItem(item, restaurantId, restaurantName);
  }

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/20 hover:bg-accent/50">
      {item.image && (
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-card-foreground">{item.name}</h4>
          {item.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-card-foreground">₹{item.price}</span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 active:scale-95"
            >
              <Plus size={14} />
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-1 py-0.5">
              <button
                onClick={() => decrement(item._id)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-primary transition-colors hover:bg-accent"
              >
                <Minus size={14} />
              </button>
              <span className="min-w-[1.25rem] text-center text-sm font-bold text-card-foreground">
                {quantity}
              </span>
              <button
                onClick={() => increment(item._id)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-primary transition-colors hover:bg-accent"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
