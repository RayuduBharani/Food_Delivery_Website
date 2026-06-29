import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Props {
  onSearch: (query: string) => void;
  onCuisineFilter: (cuisine: string) => void;
  activeCuisine: string;
}

const cuisines = ["All", "North Indian", "Chinese", "Italian", "Biryani", "Pizza", "Thai", "Mughlai", "Pasta", "Asian"];

/**
 * SearchBar — Search + cuisine chips using Shadcn tokens.
 */
export default function SearchBar({ onSearch, onCuisineFilter, activeCuisine }: Props) {
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(query.trim()), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search restaurants..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-input py-3 pl-11 pr-10 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:border-ring focus:ring-1 focus:ring-ring"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {cuisines.map((c) => (
          <button
            key={c}
            onClick={() => onCuisineFilter(c === "All" ? "" : c)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              (c === "All" && !activeCuisine) || activeCuisine === c
                ? "bg-primary text-primary-foreground shadow-lg"
                : "border border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
