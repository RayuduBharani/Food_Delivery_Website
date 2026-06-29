import { useState, useEffect, useCallback } from "react";
import { getRestaurants, type Restaurant } from "@/api/restaurants";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import { RestaurantCardSkeleton } from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { UtensilsCrossed } from "lucide-react";

/**
 * Home Page — Landing page with hero, search, and restaurant grid.
 * Uses only Shadcn color tokens.
 */
export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (cuisine) params.cuisine = cuisine;
      const res = await getRestaurants(params);
      setRestaurants(res.data);
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
    } finally {
      setLoading(false);
    }
  }, [search, cuisine]);

  useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card py-16 sm:py-20">
        {/* Decorative blurs */}
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-ring/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-block text-5xl">🍕</span>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Delicious food,{" "}
            <span className="text-primary">delivered fast</span>
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-base text-muted-foreground sm:text-lg">
            Order from your favourite restaurants and get meals delivered to your doorstep in minutes.
          </p>
          <div className="mx-auto max-w-xl">
            <SearchBar onSearch={setSearch} onCuisineFilter={setCuisine} activeCuisine={cuisine} />
          </div>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-foreground">
          {search || cuisine ? "Search Results" : "Popular Restaurants"}
        </h2>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
          </div>
        ) : restaurants.length === 0 ? (
          <EmptyState
            icon={<UtensilsCrossed size={48} />}
            title="No restaurants found"
            description="Try a different search term or remove the cuisine filter."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => <RestaurantCard key={r._id} restaurant={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}
