import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import type { Restaurant } from "@/api/restaurants";

interface Props {
  restaurant: Restaurant;
}

/**
 * RestaurantCard — Restaurant grid card using Shadcn tokens.
 */
export default function RestaurantCard({ restaurant }: Props) {
  const { _id, name, image, cuisine, rating, deliveryTime, isOpen } = restaurant;

  return (
    <Link
      to={`/restaurant/${_id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {!isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-destructive px-4 py-1.5 text-sm font-semibold text-primary-foreground">
              Currently Closed
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-emerald-600/90 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          {rating.toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1.5 text-base font-semibold text-card-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {cuisine.slice(0, 3).map((c) => (
            <span key={c} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {c}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={13} />
          <span>{deliveryTime} mins</span>
        </div>
      </div>
    </Link>
  );
}
