export function Skeleton({ className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-night-200/80 dark:bg-night-700/40 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white dark:bg-night-850 border border-black/5 dark:border-white/5 p-2.5 shadow-card dark:shadow-card-dark">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="space-y-2 px-1 pt-3 pb-1">
        <Skeleton className="h-3 w-3/4 rounded-full" />
        <Skeleton className="h-3 w-1/2 rounded-full" />
      </div>
    </div>
  )
}
