import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, X, Loader2 } from "lucide-react";
import {
  getAdminRestaurants, createRestaurant, updateRestaurant, deleteRestaurant,
  getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem,
  type AdminRestaurant, type AdminMenuItem,
} from "@/api/admin";

// ─── Restaurant Form ────────────────────────────────────────────────────────
const emptyRestaurant = { name: "", image: "", cuisine: [""], rating: 4.0, deliveryTime: 30, address: "", isOpen: true };

function RestaurantForm({ initial, onSave, onCancel }: {
  initial: Partial<typeof emptyRestaurant>;
  onSave: (data: typeof emptyRestaurant) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...emptyRestaurant, ...initial });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  }

  const inputClass = "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input required placeholder="Restaurant name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        <input required placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClass} />
        <input required placeholder="Cuisines (comma-separated)" value={form.cuisine.join(", ")} onChange={(e) => setForm({ ...form, cuisine: e.target.value.split(",").map((c) => c.trim()) })} className={inputClass} />
        <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
        <input required type="number" placeholder="Delivery time (mins)" value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: Number(e.target.value) })} className={inputClass} />
        <input type="number" step="0.1" min="1" max="5" placeholder="Rating (1-5)" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={inputClass} />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={form.isOpen} onChange={(e) => setForm({ ...form, isOpen: e.target.checked })} className="accent-primary" />
        Open for orders
      </label>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
          {saving && <Loader2 size={13} className="animate-spin" />}
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent">Cancel</button>
      </div>
    </form>
  );
}

// ─── Menu Item Form ─────────────────────────────────────────────────────────
const emptyItem = { name: "", description: "", price: 0, category: "", image: "", isAvailable: true };

function MenuItemForm({ initial, onSave, onCancel }: {
  initial: Partial<typeof emptyItem>;
  onSave: (data: typeof emptyItem) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...emptyItem, ...initial });
  const [saving, setSaving] = useState(false);
  const inputClass = "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input required placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        <input required placeholder="Category (e.g. Starters)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} />
        <input required type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputClass} />
        <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClass} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} sm:col-span-2`} />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-primary" />
        Available
      </label>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
          {saving && <Loader2 size={13} className="animate-spin" />}
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent">Cancel</button>
      </div>
    </form>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [menuMap, setMenuMap] = useState<Record<string, AdminMenuItem[]>>({});
  const [showAddItem, setShowAddItem] = useState<string | null>(null);
  const [editItemId, setEditItemId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try { const res = await getAdminRestaurants(); setRestaurants(res.data.data); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function loadMenu(restaurantId: string) {
    if (menuMap[restaurantId]) return;
    const res = await getMenuItems(restaurantId);
    setMenuMap((prev) => ({ ...prev, [restaurantId]: res.data.data }));
  }

  function toggleExpand(id: string) {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    loadMenu(id);
  }

  async function handleCreate(data: typeof emptyRestaurant) {
    try {
      const res = await createRestaurant(data as Parameters<typeof createRestaurant>[0]);
      setRestaurants((prev) => [res.data.data, ...prev]);
      setShowAdd(false); toast.success("Restaurant created");
    } catch { toast.error("Failed to create restaurant"); }
  }

  async function handleUpdate(id: string, data: typeof emptyRestaurant) {
    try {
      const res = await updateRestaurant(id, data);
      setRestaurants((prev) => prev.map((r) => (r._id === id ? res.data.data : r)));
      setEditId(null); toast.success("Restaurant updated");
    } catch { toast.error("Failed to update restaurant"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this restaurant and all its menu items?")) return;
    try {
      await deleteRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
      toast.success("Restaurant deleted");
    } catch { toast.error("Failed to delete"); }
  }

  async function handleCreateItem(restaurantId: string, data: typeof emptyItem) {
    try {
      const res = await createMenuItem(restaurantId, data as Parameters<typeof createMenuItem>[1]);
      setMenuMap((prev) => ({ ...prev, [restaurantId]: [res.data.data, ...(prev[restaurantId] || [])] }));
      setShowAddItem(null); toast.success("Menu item added");
    } catch { toast.error("Failed to add item"); }
  }

  async function handleUpdateItem(restaurantId: string, itemId: string, data: typeof emptyItem) {
    try {
      const res = await updateMenuItem(itemId, data);
      setMenuMap((prev) => ({
        ...prev,
        [restaurantId]: prev[restaurantId].map((i) => (i._id === itemId ? res.data.data : i)),
      }));
      setEditItemId(null); toast.success("Item updated");
    } catch { toast.error("Failed to update item"); }
  }

  async function handleDeleteItem(restaurantId: string, itemId: string) {
    if (!confirm("Delete this menu item?")) return;
    try {
      await deleteMenuItem(itemId);
      setMenuMap((prev) => ({ ...prev, [restaurantId]: prev[restaurantId].filter((i) => i._id !== itemId) }));
      toast.success("Item deleted");
    } catch { toast.error("Failed to delete item"); }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Restaurants</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{restaurants.length} restaurants</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:brightness-110">
          <Plus size={15} /> Add Restaurant
        </button>
      </div>

      {showAdd && (
        <div className="mb-6">
          <RestaurantForm initial={{}} onSave={handleCreate} onCancel={() => setShowAdd(false)} />
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {restaurants.map((r) => (
            <div key={r._id} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Restaurant row */}
              <div className="flex items-center gap-4 p-4">
                <img src={r.image} alt={r.name} className="h-14 w-14 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{r.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${r.isOpen ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                      {r.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.cuisine.join(", ")} · ⭐ {r.rating} · {r.deliveryTime} mins</p>
                  <p className="text-xs text-muted-foreground/60">{r.address}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleExpand(r._id)} className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent">
                    Menu {expanded === r._id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  <button onClick={() => setEditId(editId === r._id ? null : r._id)} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(r._id)} className="rounded-lg border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Edit form */}
              {editId === r._id && (
                <div className="border-t border-border px-4 pb-4">
                  <RestaurantForm
                    initial={{ ...r, cuisine: r.cuisine }}
                    onSave={(data) => handleUpdate(r._id, data)}
                    onCancel={() => setEditId(null)}
                  />
                </div>
              )}

              {/* Menu panel */}
              {expanded === r._id && (
                <div className="border-t border-border bg-background/50 px-4 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Menu Items</p>
                    <button onClick={() => setShowAddItem(showAddItem === r._id ? null : r._id)} className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
                      <Plus size={12} /> Add Item
                    </button>
                  </div>

                  {showAddItem === r._id && (
                    <MenuItemForm initial={{}} onSave={(data) => handleCreateItem(r._id, data)} onCancel={() => setShowAddItem(null)} />
                  )}

                  <div className="mt-3 space-y-2">
                    {(menuMap[r._id] || []).map((item) => (
                      <div key={item._id} className="rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-3 p-3">
                          {item.image && <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category} · ₹{item.price}</p>
                          </div>
                          <span className={`text-[10px] font-medium ${item.isAvailable ? "text-emerald-400" : "text-muted-foreground"}`}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </span>
                          <button onClick={() => setEditItemId(editItemId === item._id ? null : item._id)} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-accent">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => handleDeleteItem(r._id, item._id)} className="rounded-lg border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10">
                            <X size={12} />
                          </button>
                        </div>
                        {editItemId === item._id && (
                          <div className="border-t border-border px-3 pb-3">
                            <MenuItemForm
                              initial={item}
                              onSave={(data) => handleUpdateItem(r._id, item._id, data)}
                              onCancel={() => setEditItemId(null)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {menuMap[r._id]?.length === 0 && (
                      <p className="py-4 text-center text-xs text-muted-foreground">No menu items yet. Add one above.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
