function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-muted motion-reduce:animate-none ${className}`}
    />
  );
}

export default function AccountLoading() {
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
      <main className="min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl" role="status" aria-label="Loading account">
          <span className="sr-only">Loading your account and order history</span>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-5 h-10 w-48" />
          <Skeleton className="mb-8 mt-3 h-4 w-72 max-w-full" />
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-4 h-6 w-48" />
            <Skeleton className="mt-3 h-4 w-60 max-w-full" />
          </section>
          {['Recent orders', 'Reservations'].map((section) => (
            <section key={section} className="mt-8">
              <Skeleton className="mb-4 h-6 w-40" />
              {[0, 1].map((item) => (
                <article
                  key={item}
                  className="mb-3 rounded-2xl border border-border bg-card p-5"
                  aria-hidden="true"
                >
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-40 max-w-full" />
                      <Skeleton className="mt-3 h-3 w-32" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="mt-5 h-4 w-3/4" />
                </article>
              ))}
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
