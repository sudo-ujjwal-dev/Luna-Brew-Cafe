'use client';

import { useEffect, useState } from 'react';

type RevenuePeriod = 'today' | '7d' | '30d' | 'month';

interface RevenueData {
  period: RevenuePeriod;
  revenue: number;
  orderCount: number;
  averageOrder: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  totalCompletedRevenue: number;
  totalCompletedOrders: number;
  trend: Array<{ date: string; total: number }>;
}

const periods: Array<{ value: RevenuePeriod; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'month', label: 'This month' },
];

const currency = (value: number) =>
  `Rs. ${value.toLocaleString('en-NP', { maximumFractionDigits: 2 })}`;

function displayDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-NP', {
    timeZone: 'Asia/Kathmandu',
    day: 'numeric',
    month: 'short',
  });
}

export default function RevenuePanel() {
  const [period, setPeriod] = useState<RevenuePeriod>('today');
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setData(null);
    setError('');
    fetch(`/api/admin/dashboard/revenue?period=${period}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(async (response) => {
        const result = (await response.json()) as RevenueData & { error?: string };
        if (!response.ok) throw new Error(result.error || 'Unable to load revenue data.');
        setData(result);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error ? requestError.message : 'Revenue data is unavailable.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [period]);

  const max = Math.max(1, ...(data?.trend.map((point) => point.total) ?? [0]));
  const pointList =
    data?.trend.map((point, index) => {
      const x = data.trend.length <= 1 ? 300 : (index / (data.trend.length - 1)) * 600;
      const y = 156 - (point.total / max) * 140;
      return `${x},${y}`;
    }) ?? [];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-700 text-foreground">Completed-order revenue</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Calculated from orders marked completed; no payment is implied.
          </p>
        </div>
        <label className="text-xs font-600 text-muted-foreground">
          Revenue period
          <select
            value={period}
            onChange={(event) => {
              const selected = periods.find((item) => item.value === event.target.value);
              if (selected) setPeriod(selected.value);
            }}
            className="mt-1 block w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground sm:w-40"
          >
            {periods.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-danger-bg p-3 text-sm text-danger">
          {error}
        </p>
      )}
      {loading && !data ? (
        <div role="status" aria-label="Loading completed-order revenue" className="mt-5">
          <span className="sr-only">Loading revenue totals and trend</span>
          <div aria-hidden="true" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl bg-secondary/60 p-3 motion-reduce:animate-none"
              >
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="mt-3 h-6 w-28 max-w-full rounded bg-muted" />
              </div>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="mt-5 h-48 animate-pulse rounded-xl bg-secondary/60 motion-reduce:animate-none"
          >
            <div className="px-4 pt-4">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="mt-5 h-28 rounded-lg bg-muted/70" />
            </div>
          </div>
        </div>
      ) : data ? (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[
              { label: 'Selected period', value: currency(data.revenue) },
              { label: 'Completed orders', value: String(data.orderCount) },
              { label: 'Average order', value: currency(data.averageOrder) },
              { label: 'This week', value: currency(data.thisWeekRevenue) },
              { label: 'This month', value: currency(data.thisMonthRevenue) },
              {
                label: 'Total completed',
                value: currency(data.totalCompletedRevenue),
                note: `${data.totalCompletedOrders} orders overall`,
              },
            ].map((metric) => (
              <div key={metric.label} className="rounded-xl bg-secondary/60 p-3">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="mt-1 break-words text-lg font-700 text-foreground">{metric.value}</p>
                {'note' in metric && metric.note && (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{metric.note}</p>
                )}
              </div>
            ))}
          </div>

          {data.orderCount > 0 ? (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-600 text-foreground">Revenue trend</h3>
                <p className="text-xs text-muted-foreground">
                  {data.totalCompletedOrders} completed orders overall
                </p>
              </div>
              <div className="overflow-x-auto">
                <svg
                  role="img"
                  aria-label={`Completed-order revenue trend, ${periods.find((item) => item.value === period)?.label}`}
                  viewBox="0 0 600 180"
                  className="h-44 min-w-[480px] w-full"
                  preserveAspectRatio="none"
                >
                  <line x1="0" y1="156" x2="600" y2="156" stroke="currentColor" opacity="0.15" />
                  <polyline
                    points={pointList.join(' ')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="text-primary"
                  />
                  {data.trend.length === 1 && (
                    <circle
                      cx="300"
                      cy={156 - (data.trend[0].total / max) * 140}
                      r="4"
                      fill="currentColor"
                      className="text-primary"
                    />
                  )}
                </svg>
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{displayDate(data.trend[0].date)}</span>
                <span>{displayDate(data.trend[data.trend.length - 1].date)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-5 rounded-xl bg-secondary/50 p-5 text-center text-sm text-muted-foreground">
              No completed orders in this period yet. Pending, cancelled, and delivery-issue orders
              are not counted as revenue.
            </p>
          )}
        </>
      ) : null}
    </section>
  );
}
