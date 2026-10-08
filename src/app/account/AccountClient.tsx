'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import InlineSpinner from '@/components/ui/InlineSpinner';

interface AccountData {
  customer: { id: string; name: string; email: string } | null;
  orders: Array<{
    id: string;
    orderNumber: string;
    type: string;
    status: string;
    total: number;
    createdAt: string;
    deliveryAddress: string | null;
    deliveryConfirmedAt: string | null;
    deliveryIssueReportedAt: string | null;
    review: { id: string; status: string } | null;
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

const orderStatusLabels: Record<string, string> = {
  PENDING: 'Order received',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Being prepared',
  READY: 'Ready',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERY_ISSUE: 'Delivery issue',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-muted motion-reduce:animate-none ${className}`}
    />
  );
}

function AccountSkeleton() {
  return (
    <div role="status" aria-label="Loading account details" className="space-y-8">
      <span className="sr-only">Loading account details</span>
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
        <SkeletonBlock className="mb-4 h-3 w-24" />
        <SkeletonBlock className="h-6 w-48" />
        <SkeletonBlock className="mt-3 h-4 w-56 max-w-full" />
      </section>
      {['Orders', 'Reservations'].map((section) => (
        <section key={section}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-700 text-foreground">{section}</h2>
            {section === 'Orders' && <SkeletonBlock className="h-4 w-24" />}
          </div>
          {[0, 1].map((item) => (
            <article
              key={item}
              className="mb-3 rounded-2xl border border-border bg-card p-5"
              aria-hidden="true"
            >
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <SkeletonBlock className="h-5 w-40 max-w-full" />
                  <SkeletonBlock className="mt-3 h-3 w-32" />
                </div>
                <SkeletonBlock className="h-5 w-20" />
              </div>
              <SkeletonBlock className="mt-5 h-4 w-3/4" />
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}

function statusLabel(status: string) {
  return orderStatusLabels[status] ?? status.toLowerCase().replaceAll('_', ' ');
}

function statusStyle(status: string) {
  if (status === 'COMPLETED' || status === 'CONFIRMED') {
    return 'bg-success-bg text-success';
  }
  if (status === 'DELIVERY_ISSUE' || status === 'CANCELLED' || status === 'REJECTED') {
    return 'bg-danger-bg text-danger';
  }
  return 'bg-secondary text-foreground';
}

export default function AccountClient({ welcome = false }: { welcome?: boolean }) {
  const router = useRouter();
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmationOrderId, setConfirmationOrderId] = useState('');
  const [reviewOrderId, setReviewOrderId] = useState('');
  const [notice, setNotice] = useState('');

  const loadAccount = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/account/history');
      const result = (await response.json()) as AccountData & { error?: string };
      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/account/login');
          return;
        }
        throw new Error(result.error || 'Unable to load your account.');
      }
      if (!result.customer) throw new Error('Your account details are unavailable.');
      setData(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to load your account.'
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

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

  async function confirmDelivery(orderId: string, received: boolean) {
    setConfirmationOrderId(orderId);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/account/orders/${orderId}/delivery-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ received }),
      });
      const result = (await response.json()) as {
        status?: string;
        confirmedAt?: string;
        error?: string;
      };
      if (!response.ok || !result.status || !result.confirmedAt) {
        throw new Error(result.error || 'Unable to save your delivery response.');
      }
      const updatedStatus = result.status;
      const occurredAt = result.confirmedAt;
      setData((current) =>
        current
          ? {
              ...current,
              orders: current.orders.map((order) =>
                order.id === orderId
                  ? {
                      ...order,
                      status: updatedStatus,
                      ...(received
                        ? { deliveryConfirmedAt: occurredAt }
                        : { deliveryIssueReportedAt: occurredAt }),
                    }
                  : order
              ),
            }
          : current
      );
      setNotice(
        received
          ? 'Thanks for confirming your delivery. You can now leave a review.'
          : 'Thanks for letting us know. The café team will review your delivery issue.'
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to save your delivery response.'
      );
    } finally {
      setConfirmationOrderId('');
    }
  }

  async function submitReview(orderId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewOrderId(orderId);
    setError('');
    setNotice('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/account/orders/${orderId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: form.get('rating'),
          comment: form.get('comment'),
          customerName: data?.customer?.name,
        }),
      });
      const result = (await response.json()) as {
        review?: { id: string; status: string };
        error?: string;
      };
      if (!response.ok || !result.review) {
        throw new Error(result.error || 'Unable to submit your review.');
      }
      setData((current) =>
        current
          ? {
              ...current,
              orders: current.orders.map((order) =>
                order.id === orderId ? { ...order, review: result.review! } : order
              ),
            }
          : current
      );
      setNotice('Thank you. Your review is saved and will appear after moderation.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to submit review.');
    } finally {
      setReviewOrderId('');
    }
  }

  if (loading) return <AccountSkeleton />;

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
        <button
          type="button"
          onClick={() => void loadAccount()}
          className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-600 text-primary-foreground"
        >
          Try again
        </button>
        <Link href="/account/login" className="ml-4 text-sm font-600 text-primary hover:underline">
          Sign in
        </Link>
      </div>
    );
  }
  if (!data?.customer) return null;

  return (
    <div className="space-y-8">
      {(error || notice || welcome) && (
        <p
          role={error ? 'alert' : 'status'}
          className={`rounded-xl p-4 text-sm ${error ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success'}`}
        >
          {error || notice || 'Your account is ready. Welcome to Luna Brew Café.'}
        </p>
      )}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="section-label mb-2">Account information</p>
          <h2 className="text-xl font-700 text-foreground">{data.customer.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{data.customer.email}</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          disabled={loggingOut}
          aria-busy={loggingOut}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-600 text-foreground hover:bg-secondary disabled:cursor-wait disabled:opacity-60"
        >
          {loggingOut && <InlineSpinner />}
          {loggingOut ? 'Signing out…' : 'Log out'}
        </button>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-700 text-foreground">Recent orders</h2>
          <Link href="/menu" className="text-sm font-600 text-primary hover:underline">
            Browse menu
          </Link>
        </div>
        {data.orders.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Your orders will appear here once you place your first order.
          </p>
        ) : (
          <div className="space-y-3">
            {data.orders.map((order) => {
              const showReview =
                order.status === 'COMPLETED' &&
                (order.type !== 'DELIVERY' || order.deliveryConfirmedAt !== null);
              const submittedReview = order.review;
              const deliveryTimeline = order.type === 'DELIVERY';
              const timelineSteps = deliveryTimeline
                ? [
                    ['PENDING', 'Received'],
                    ['CONFIRMED', 'Confirmed'],
                    ['PREPARING', 'Preparing'],
                    ['READY', 'Ready'],
                    ['OUT_FOR_DELIVERY', 'On the way'],
                    ['COMPLETED', 'Delivered'],
                  ]
                : [
                    ['PENDING', 'Received'],
                    ['CONFIRMED', 'Confirmed'],
                    ['PREPARING', 'Preparing'],
                    ['READY', 'Ready'],
                    ['COMPLETED', 'Completed'],
                  ];
              const activeStep = timelineSteps.findIndex(([status]) => status === order.status);
              return (
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
                      <span
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-600 ${statusStyle(order.status)}`}
                      >
                        {statusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {order.items.map((item) => `${item.itemName} × ${item.quantity}`).join(', ')}
                  </p>
                  <p className="mt-2 text-xs font-600 text-foreground">
                    {order.type === 'DELIVERY'
                      ? 'Delivery'
                      : order.type === 'DINE_IN'
                        ? 'Dine-in'
                        : 'Takeaway'}
                  </p>
                  {order.type === 'DELIVERY' && order.deliveryAddress && (
                    <p className="mt-1 text-xs text-muted-foreground">{order.deliveryAddress}</p>
                  )}
                  {activeStep >= 0 && (
                    <ol
                      aria-label="Order progress"
                      className={`mt-5 grid gap-2 ${deliveryTimeline ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-3 sm:grid-cols-5'}`}
                    >
                      {timelineSteps.map(([status, label], index) => (
                        <li
                          key={status}
                          aria-current={index === activeStep ? 'step' : undefined}
                          className={`flex flex-col items-center gap-1 text-center text-[10px] sm:text-xs ${
                            index <= activeStep ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`h-2.5 w-2.5 rounded-full ${
                              index <= activeStep ? 'bg-primary' : 'bg-border'
                            }`}
                          />
                          {label}
                        </li>
                      ))}
                    </ol>
                  )}

                  {order.status === 'DELIVERY_ISSUE' ? (
                    <div className="mt-4 rounded-xl border border-danger/20 bg-danger-bg p-4">
                      <p className="text-sm font-600 text-danger">
                        The café team is reviewing your delivery issue.
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        We have recorded that you did not receive your order. You cannot confirm
                        receipt unless the café resolves the issue.
                      </p>
                    </div>
                  ) : order.type === 'DELIVERY' &&
                    order.status === 'OUT_FOR_DELIVERY' &&
                    !order.deliveryConfirmedAt ? (
                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <h4 className="font-700 text-foreground">Did you receive your delivery?</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Let the café know once your order has arrived.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={confirmationOrderId === order.id}
                          aria-busy={confirmationOrderId === order.id}
                          onClick={() => void confirmDelivery(order.id, true)}
                          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-600 text-primary-foreground disabled:cursor-wait disabled:opacity-60"
                        >
                          {confirmationOrderId === order.id && <InlineSpinner />}
                          {confirmationOrderId === order.id ? 'Saving…' : 'Yes, I received it'}
                        </button>
                        <button
                          type="button"
                          disabled={confirmationOrderId === order.id}
                          aria-busy={confirmationOrderId === order.id}
                          onClick={() => void confirmDelivery(order.id, false)}
                          className="rounded-xl border border-border px-4 py-2.5 text-sm font-600 text-foreground disabled:cursor-wait disabled:opacity-60"
                        >
                          No, I didn’t receive it
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {order.type === 'DELIVERY' &&
                    order.status === 'COMPLETED' &&
                    !order.deliveryConfirmedAt && (
                      <p className="mt-4 rounded-xl bg-secondary p-3 text-sm text-muted-foreground">
                        If this delivery status looks incorrect, please contact the café team.
                      </p>
                    )}

                  {showReview && submittedReview ? (
                    <p
                      role="status"
                      className="mt-4 rounded-xl bg-success-bg p-3 text-sm text-success"
                    >
                      Review submitted
                      {submittedReview.status === 'PENDING' ? ' — awaiting moderation.' : '.'}
                    </p>
                  ) : showReview ? (
                    <form
                      onSubmit={(event) => void submitReview(order.id, event)}
                      className="mt-4 grid gap-3 rounded-xl border border-border bg-secondary/30 p-4 sm:grid-cols-[140px_1fr_auto]"
                    >
                      <label className="text-sm font-600 text-foreground">
                        Rate your order
                        <select
                          name="rating"
                          required
                          defaultValue="5"
                          className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                        >
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <option key={rating} value={rating}>
                              {rating} {rating === 1 ? 'star' : 'stars'}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-sm font-600 text-foreground">
                        Your review
                        <textarea
                          name="comment"
                          required
                          minLength={10}
                          maxLength={3000}
                          rows={2}
                          className="mt-1 block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={reviewOrderId === order.id}
                        aria-busy={reviewOrderId === order.id}
                        className="flex items-center gap-2 self-end rounded-xl bg-primary px-4 py-2.5 text-sm font-600 text-primary-foreground disabled:cursor-wait disabled:opacity-60"
                      >
                        {reviewOrderId === order.id && <InlineSpinner />}
                        {reviewOrderId === order.id ? 'Submitting…' : 'Leave a review'}
                      </button>
                    </form>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-700 text-foreground">Reservations</h2>
        {data.reservations.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Your reservations will appear here.
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
                    {reservation.time} · {reservation.guestCount}{' '}
                    {reservation.guestCount === 1 ? 'guest' : 'guests'}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-600 ${statusStyle(reservation.status)}`}
                >
                  {reservation.status.toLowerCase().replaceAll('_', ' ')}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
