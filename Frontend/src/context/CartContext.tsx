import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { MenuItem } from "@/api/restaurants";

// ─── Types ───────────────────────────────────────────────────────

/** A cart item is a menu item plus a quantity. */
export interface CartItem {
  _id: string;
  restaurantId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null; // Track which restaurant items belong to
  restaurantName: string;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { item: MenuItem; restaurantId: string; restaurantName: string } }
  | { type: "REMOVE_ITEM"; payload: string } // item _id
  | { type: "INCREMENT"; payload: string }
  | { type: "DECREMENT"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (itemId: string) => void;
  increment: (itemId: string) => void;
  decrement: (itemId: string) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
}

// ─── Storage Key ─────────────────────────────────────────────────
const STORAGE_KEY = "foodrush_cart";

// ─── Initial State ───────────────────────────────────────────────
const initialState: CartState = {
  items: [],
  restaurantId: null,
  restaurantName: "",
};

// ─── Reducer ─────────────────────────────────────────────────────
/**
 * Pure function that handles all cart mutations.
 * Using useReducer instead of useState because cart logic involves
 * multiple related state transitions (add, remove, quantity changes).
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, restaurantId, restaurantName } = action.payload;

      // If cart has items from a different restaurant, clear it first.
      // This mimics Swiggy/Zomato behavior: one restaurant per order.
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          items: [
            {
              _id: item._id,
              restaurantId,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: 1,
            },
          ],
          restaurantId,
          restaurantName,
        };
      }

      // Check if item already in cart → increment quantity
      const existingIndex = state.items.findIndex((i) => i._id === item._id);
      if (existingIndex !== -1) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return { ...state, items: updated };
      }

      // New item
      return {
        ...state,
        restaurantId,
        restaurantName,
        items: [
          ...state.items,
          {
            _id: item._id,
            restaurantId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
          },
        ],
      };
    }

    case "REMOVE_ITEM": {
      const filtered = state.items.filter((i) => i._id !== action.payload);
      if (filtered.length === 0) return initialState;
      return { ...state, items: filtered };
    }

    case "INCREMENT": {
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }

    case "DECREMENT": {
      return {
        ...state,
        items: state.items
          .map((i) =>
            i._id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0), // Remove if quantity reaches 0
      };
    }

    case "CLEAR_CART":
      return initialState;

    case "LOAD_CART":
      return action.payload;

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartState;
        if (parsed.items && parsed.items.length > 0) {
          dispatch({ type: "LOAD_CART", payload: parsed });
        }
      }
    } catch {
      // If localStorage is corrupted, start fresh
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // ── Computed Values ──────────────────────────────────────────
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const deliveryFee = subtotal >= 500 ? 0 : 40; // Free delivery on ₹500+
  const total = subtotal + deliveryFee;

  // ── Actions ──────────────────────────────────────────────────
  const addItem = (item: MenuItem, restaurantId: string, restaurantName: string) => {
    dispatch({ type: "ADD_ITEM", payload: { item, restaurantId, restaurantName } });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const increment = (itemId: string) => {
    dispatch({ type: "INCREMENT", payload: itemId });
  };

  const decrement = (itemId: string) => {
    dispatch({ type: "DECREMENT", payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getItemQuantity = (itemId: string): number => {
    return state.items.find((i) => i._id === itemId)?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        addItem,
        removeItem,
        increment,
        decrement,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────
/**
 * Custom hook to access the cart context.
 * Throws if used outside CartProvider — catches bugs early.
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
