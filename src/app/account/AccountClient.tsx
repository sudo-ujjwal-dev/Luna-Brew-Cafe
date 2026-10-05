'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AccountData {
  customer: { id: string; name: string; email: string } | null;
  orders: Array<{
    id: string;
    orderNumber: string;
    type: string;
    status: string;
    total: number;
    createdAt: string;
    items: Array<{ itemName: string; quantity: number }>;
  }>;
  reservations: Array<{
    id: string;
    date: string;
    time: string;
    guestCount: number;
    status: string;
  }>;
}

export default function AccountClient() {
  const router = useRouter();
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadAccount() {
      try {
        const sessionResponse = await fetch('/api/account/session', { signal: controller.signal });
        const session = (await sessionResponse.json()) as {
          customer?: AccountData['customer'];
          error?: string;
        };
        if (!sessionResponse.ok) throw new Error(session.error || 'Unable to load your account.');
        if (!session.customer) {
          router.replace('/account/login');
          return;
        }
        const historyResponse = await fetch('/api/account/history', { signal: controller.signal });
        const history = (await historyResponse.json()) as Omit<AccountData, 'customer'> & {
          error?: string;
        };
        if (!historyResponse.ok)
          throw new Error(history.error || 'Unable to load account history.');
        setData({
          customer: session.customer,
          orders: history.orders,
          reservations: history.reservations,
        });
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error ? requestError.message : 'Unable to load your account.'
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadAccount();
    return () => controller.abort();
  }, [router]);

  async function logout() {
    setLoggingOut(true);
    setError('');
    try {
      const response = await fetch('/api/account/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!response.ok) throw new Error('Unable to sign out right now.');
      router.replace('/account/login');
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign out.');
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <p role="status" className="py-16 text-center text-sm text-muted-foreground">
        Loading your account…
      </p>
    );
  }
  if (error && !data) {
    return (
      <p role="alert" className="rounded-xl bg-danger-bg p-4 text-sm text-danger">
        {error}
      </p>
    );
  }
  if (!data?.customer) return null;

  return (
    <div className="space-y-8">
      {error && (
        <p role="alert" className="rounded-xl bg-danger-bg p-4 text-sm text-danger">
          {error}
        </p>
      )}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="section-label mb-2">Your account</p>
          <h2 className="text-xl font-700 text-foreground">{data.customer.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{data.customer.email}</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          disabled={loggingOut}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-600 text-foreground hover:bg-secondary disabled:opacity-60"
        >
          {loggingOut ? 'Signing out…' : 'Log out'}
        </button>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-700 text-foreground">Previous orders</h2>
          <Link href="/menu" className="text-sm font-600 text-primary hover:underline">
            Browse menu
          </Link>
        </div>
        {data.orders.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Orders placed while signed in will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {data.orders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-700 text-foreground">Order {order.orderNumber}</h3>
                    <time
                      className="mt-1 block text-xs text-muted-foreground"
                      dateTime={order.createdAt}
                    >
                      {new Date(order.createdAt).toLocaleString('en-NP', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </time>
                  </div>
                  <div className="text-right">
                    <p className="font-700 text-primary">
                      Rs. {order.total.toLocaleString('en-NP')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.status.replaceAll('_', ' ')} · {order.type.replaceAll('_', ' ')}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {order.items.map((item) => `${item.itemName} × ${item.quantity}`).join(', ')}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-700 text-foreground">Reservations</h2>
        {data.reservations.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Reservations made while signed in will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {data.reservations.map((reservation) => (
              <article
                key={reservation.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <div>
                  <h3 className="font-700 text-foreground">
                    {new Date(`${reservation.date}T12:00:00`).toLocaleDateString('en-NP', {
                      dateStyle: 'long',
                    })}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {reservation.time} · {reservation.guestCount} guests
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-600 text-foreground">
                  {reservation.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
