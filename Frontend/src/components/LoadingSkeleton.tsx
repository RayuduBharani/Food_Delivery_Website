/**
 * LoadingSkeleton — Shimmer loading placeholders using Shadcn tokens.
 */

function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

export function RestaurantCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <SkeletonPulse className="h-44 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <SkeletonPulse className="h-5 w-3/4" />
        <div className="flex gap-2">
          <SkeletonPulse className="h-5 w-16 rounded-full" />
          <SkeletonPulse className="h-5 w-16 rounded-full" />
        </div>
        <SkeletonPulse className="h-4 w-24" />
      </div>
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <SkeletonPulse className="h-24 w-24 flex-shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-32" />
          <SkeletonPulse className="h-3 w-48" />
        </div>
        <div className="flex items-center justify-between">
          <SkeletonPulse className="h-5 w-14" />
          <SkeletonPulse className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-32" />
        <SkeletonPulse className="h-6 w-20 rounded-full" />
      </div>
      <SkeletonPulse className="h-3 w-40" />
      <div className="space-y-2">
        <SkeletonPulse className="h-3 w-full" />
        <SkeletonPulse className="h-3 w-3/4" />
      </div>
      <div className="flex justify-end">
        <SkeletonPulse className="h-5 w-20" />
      </div>
    </div>
  );
}
