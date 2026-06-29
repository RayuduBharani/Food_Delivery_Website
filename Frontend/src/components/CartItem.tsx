import { Plus, Minus, Trash2 } from "lucide-react";
import { useCart, type CartItem as CartItemType } from "@/context/CartContext";

interface Props {
  item: CartItemType;
}

/**
 * CartItem — Cart list item using Shadcn tokens.
 */
export default function CartItem({ item }: Props) {
  const { increment, decrement, removeItem } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20">
      {item.image && (
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="flex-1">
        <h4 className="text-sm font-semibold text-card-foreground">{item.name}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">₹{item.price} each</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-1 py-0.5">
        <button onClick={() => decrement(item._id)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Minus size={14} />
        </button>
        <span className="min-w-[1.5rem] text-center text-sm font-bold text-foreground">{item.quantity}</span>
        <button onClick={() => increment(item._id)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Plus size={14} />
        </button>
      </div>

      <span className="min-w-[4rem] text-right text-sm font-bold text-foreground">₹{lineTotal}</span>

      <button
        onClick={() => removeItem(item._id)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
