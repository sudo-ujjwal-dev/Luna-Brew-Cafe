function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-muted motion-reduce:animate-none ${className}`}
    />
  );
}

export default function MenuLoading() {
  return (
    <>
      <header
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border bg-card/95 md:h-20"
      >
        <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-1 h-3 w-10" />
            </div>
          </div>
          <Skeleton className="hidden h-9 w-40 rounded-xl md:block" />
        </div>
      </header>
      <main className="min-h-screen">
        <section className="bg-foreground px-4 pb-16 pt-32 text-center sm:px-6 lg:px-8">
          <Skeleton className="mx-auto h-3 w-32 bg-white/20" />
          <Skeleton className="mx-auto mt-5 h-10 w-52 bg-white/20" />
          <Skeleton className="mx-auto mt-4 h-4 w-80 max-w-full bg-white/20" />
        </section>
        <section className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div role="status" aria-label="Loading menu">
            <span className="sr-only">Loading menu categories and items</span>
            <div className="flex flex-wrap gap-3">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-9 w-24 rounded-xl" />
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                <article
                  key={item}
                  aria-hidden="true"
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <Skeleton className="h-44 rounded-none" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
