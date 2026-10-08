'use client';

import { useCallback, useEffect, useState } from 'react';

export type RecordKind = 'orders' | 'reservations' | 'reviews' | 'contact';

interface RecordRow {
  id: string;
  status: string;
  orderType?: string;
  title: string;
  subtitle: string;
  detail: string;
  created: string;
  customerConfirmedDelivery?: boolean;
}

const config: Record<RecordKind, { collection: string; endpoint: string; statuses: string[] }> = {
  orders: {
    collection: 'orders',
    endpoint: '/api/admin/orders',
    statuses: [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'READY',
      'OUT_FOR_DELIVERY',
      'DELIVERY_ISSUE',
      'COMPLETED',
      'CANCELLED',
    ],
  },
  reservations: {
    collection: 'reservations',
    endpoint: '/api/admin/reservations',
    statuses: ['PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
  },
  reviews: {
    collection: 'reviews',
    endpoint: '/api/admin/reviews',
    statuses: ['PENDING', 'APPROVED', 'REJECTED'],
  },
  contact: {
    collection: 'messages',
    endpoint: '/api/admin/contact',
    statuses: ['UNREAD', 'READ', 'RESOLVED'],
  },
};

function text(value: unknown, fallback = '') {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
}

function normalizeRow(kind: RecordKind, row: Record<string, unknown>): RecordRow {
  if (kind === 'orders') {
    const itemRows = Array.isArray(row.items) ? (row.items as Record<string, unknown>[]) : [];
    const itemNames = itemRows
      .map((item) => `${text(item.itemName, 'Item')} × ${text(item.quantity, '1')}`)
      .join(', ');
    const total = typeof row.total === 'number' ? `Rs. ${row.total.toLocaleString('en-NP')}` : '';
    return {
      id: text(row.id),
      status: text(row.status),
      orderType: text(row.type),
      title: text(row.orderNumber, 'Order'),
      subtitle: `${text(row.customerName)} · ${text(row.phone)}${row.email ? ` · ${text(row.email)}` : ''} · ${text(row.type).replaceAll('_', ' ')}`,
      detail: [
        itemNames,
        total,
        row.deliveryAddress ? `Delivery address: ${text(row.deliveryAddress)}` : '',
        row.status === 'DELIVERY_ISSUE' && row.deliveryIssueReportedAt
          ? `Customer reported not received · ${new Date(text(row.deliveryIssueReportedAt)).toLocaleString('en-NP')}`
          : '',
        row.deliveryConfirmedAt
          ? `Customer confirmed receipt · ${new Date(text(row.deliveryConfirmedAt)).toLocaleString('en-NP')}`
          : '',
      ]
        .filter(Boolean)
        .join(' · '),
      created: text(row.createdAt),
      customerConfirmedDelivery: Boolean(row.deliveryConfirmedAt),
    };
  }
  if (kind === 'reservations') {
    return {
      id: text(row.id),
      status: text(row.status),
      title: text(row.customerName, 'Reservation'),
      subtitle: `${text(row.date)} at ${text(row.time)} · ${text(row.guestCount)} guests`,
      detail: `${text(row.phone)}${row.specialRequest ? ` · ${text(row.specialRequest)}` : ''}`,
      created: text(row.createdAt),
    };
  }
  if (kind === 'reviews') {
    return {
      id: text(row.id),
      status: text(row.status),
      title: `${text(row.customerName, 'Guest')} · ${text(row.rating)}/5`,
      subtitle: 'Customer review',
      detail: text(row.comment),
      created: text(row.createdAt),
    };
  }
  return {
    id: text(row.id),
    status: text(row.status),
    title: text(row.subject, 'Contact message'),
    subtitle: `${text(row.name)} · ${text(row.email)}`,
    detail: text(row.message),
    created: text(row.createdAt),
  };
}

export default function RecordManager({ kind }: { kind: RecordKind }) {
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const current = config[kind];

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(current.endpoint);
      const result = (await response.json()) as Record<string, unknown> & { error?: string };
      const raw = result[current.collection];
      if (!response.ok || !Array.isArray(raw)) {
        throw new Error(result.error || 'Unable to load records.');
      }
      setRows(raw.map((row) => normalizeRow(kind, row as Record<string, unknown>)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Records are unavailable.');
    } finally {
      setLoading(false);
    }
  }, [current.collection, current.endpoint, kind]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  async function updateStatus(row: RecordRow, status: string) {
    setUpdatingId(row.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`${current.endpoint}/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to update this record.');
      setRows((currentRows) =>
        currentRows.map((currentRow) =>
          currentRow.id === row.id ? { ...currentRow, status } : currentRow
        )
      );
      setNotice(
        status === 'OUT_FOR_DELIVERY' && row.status === 'DELIVERY_ISSUE'
          ? 'Delivery issue resolved; order returned to out for delivery.'
          : 'Record updated.'
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to update this record.'
      );
    } finally {
      setUpdatingId('');
    }
  }

  async function deleteContactMessage(row: RecordRow) {
    if (kind !== 'contact' || !window.confirm(`Permanently delete "${row.title}"?`)) return;
    setDeletingId(row.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`${current.endpoint}/${row.id}`, { method: 'DELETE' });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to delete this message.');
      setNotice('Contact message deleted.');
      setRows((currentRows) => currentRows.filter((currentRow) => currentRow.id !== row.id));
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to delete this message.'
      );
    } finally {
      setDeletingId('');
    }
  }

  const visibleRows = rows.filter((row) => {
    const matchesStatus = !statusFilter || row.status === statusFilter;
    const matchesSearch =
      !search ||
      `${row.title} ${row.subtitle} ${row.detail}`.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="rounded-xl bg-danger-bg p-4 text-sm text-danger">
          {error}
          {!loading && (
            <button
              type="button"
              onClick={() => void loadRecords()}
              className="ml-3 font-700 underline"
            >
              Try again
            </button>
          )}
        </p>
      )}
      {notice && !error && (
        <p role="status" className="rounded-xl bg-success-bg p-4 text-sm text-success">
          {notice}
        </p>
      )}
      {loading ? (
        <div role="status" aria-label={`Loading ${kind}`} className="space-y-3">
          <span className="sr-only">Loading records</span>
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              aria-hidden="true"
              className="animate-pulse rounded-2xl border border-border bg-card p-5"
            >
              <div className="h-5 w-40 rounded bg-muted" />
              <div className="mt-3 h-4 w-2/3 rounded bg-muted" />
              <div className="mt-4 h-4 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 && error ? null : rows.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No {kind} have been recorded yet.
        </p>
      ) : (
        <div className="space-y-4">
          {kind === 'orders' && (
            <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_220px]">
              <label className="text-sm font-600 text-foreground">
                Search orders
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Order number, customer or item"
                  className="mt-1 block w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm font-400"
                />
              </label>
              <label className="text-sm font-600 text-foreground">
                Filter by status
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="mt-1 block w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm font-400"
                >
                  <option value="">All statuses</option>
                  {current.statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          {visibleRows.length === 0 ? (
            <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No records match these filters.
            </p>
          ) : (
            visibleRows.map((row) => (
              <article
                key={row.id}
                className={`grid gap-4 rounded-2xl border bg-card p-5 md:grid-cols-[minmax(0,1fr)_220px] ${
                  row.status === 'DELIVERY_ISSUE' ? 'border-danger/40' : 'border-border'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="font-700 text-foreground">{row.title}</h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-600 ${
                        row.status === 'DELIVERY_ISSUE'
                          ? 'bg-danger-bg text-danger'
                          : row.status === 'COMPLETED'
                            ? 'bg-success-bg text-success'
                            : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {row.status === 'DELIVERY_ISSUE'
                        ? 'Customer reports not received'
                        : row.status === 'COMPLETED' &&
                            row.orderType === 'DELIVERY' &&
                            row.customerConfirmedDelivery
                          ? 'Customer confirmed delivery'
                          : row.status.replaceAll('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{row.subtitle}</p>
                  <p className="mt-2 break-words text-sm text-foreground">{row.detail}</p>
                  <time className="mt-2 block text-xs text-muted-foreground" dateTime={row.created}>
                    {row.created ? new Date(row.created).toLocaleString('en-NP') : ''}
                  </time>
                </div>
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor={`record-status-${row.id}`}
                    className="mb-1.5 block text-xs font-600 text-muted-foreground"
                  >
                    Update status
                  </label>
                  <select
                    id={`record-status-${row.id}`}
                    value={row.status}
                    disabled={updatingId === row.id}
                    onChange={(event) => void updateStatus(row, event.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground"
                  >
                    {[
                      ...current.statuses.filter((status) =>
                        row.orderType === 'DELIVERY'
                          ? status !== 'COMPLETED'
                          : status !== 'DELIVERY_ISSUE'
                      ),
                      ...(current.statuses.includes(row.status) ? [] : [row.status]),
                    ].map((status) => (
                      <option value={status} key={status}>
                        {status === 'DELIVERY_ISSUE'
                          ? 'Delivery issue — customer reports not received'
                          : status === 'OUT_FOR_DELIVERY'
                            ? 'Out for delivery'
                            : status.replaceAll('_', ' ')}
                      </option>
                    ))}
                  </select>
                  {kind === 'contact' && (
                    <button
                      type="button"
                      disabled={deletingId === row.id}
                      onClick={() => void deleteContactMessage(row)}
                      className="rounded-xl border border-danger/30 px-3 py-2 text-sm font-600 text-danger hover:bg-danger-bg disabled:opacity-60"
                    >
                      {deletingId === row.id ? 'Deleting…' : 'Delete message'}
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
