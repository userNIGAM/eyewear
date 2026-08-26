export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-zinc-950 min-h-screen">
      {/* Header Skeleton */}
      <div className="animate-pulse space-y-4 max-w-3xl mb-12">
        <div className="h-4 w-28 bg-zinc-900/60 rounded-full" />
        <div className="h-10 w-80 bg-zinc-900/60 rounded-lg" />
        <div className="h-6 w-96 bg-zinc-900/60 rounded-lg" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-900/10 p-4 space-y-4 h-[420px]"
          >
            <div className="space-y-4">
              <div className="aspect-square w-full bg-zinc-900/40 rounded-xl" />
              <div className="space-y-2">
                <div className="h-6 w-16 bg-zinc-900/40 rounded" />
                <div className="h-5 w-32 bg-zinc-900/40 rounded" />
                <div className="h-4 w-full bg-zinc-900/40 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-9 flex-1 bg-zinc-900/40 rounded-xl" />
              <div className="h-9 w-9 bg-zinc-900/40 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
