export default function AdminDashboardLoading() {
  return (
    <div role="status" aria-label="Loading dashboard" className="space-y-8">
      <span className="sr-only">Loading dashboard overview</span>
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-2xl border border-border bg-card p-4 motion-reduce:animate-none"
          >
            <div className="h-8 w-8 rounded-xl bg-muted" />
            <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
            <div className="mt-2 h-6 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-2" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-2xl border border-border bg-card p-5 motion-reduce:animate-none"
          >
            <div className="h-5 w-40 rounded bg-muted" />
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="mt-6 h-8 rounded bg-muted" />
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
