'use client';

import { useCallback, useEffect, useState } from 'react';

export type RecordKind = 'orders' | 'reservations' | 'reviews' | 'contact';

interface RecordRow {
  id: string;
  status: string;
  title: string;
  subtitle: string;
  detail: string;
  created: string;
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
      title: text(row.orderNumber, 'Order'),
      subtitle: `${text(row.customerName)} · ${text(row.type).replaceAll('_', ' ')}`,
      detail: [itemNames, total].filter(Boolean).join(' · '),
      created: text(row.createdAt),
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
      setNotice('Record updated.');
      await loadRecords();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to update this record.'
      );
    } finally {
      setUpdatingId('');
    }
  }

  return (
    <div className="space-y-4">
      {(error || notice) && (
        <p
          role={error ? 'alert' : 'status'}
          className={`rounded-xl p-4 text-sm ${error ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success'}`}
        >
          {error || notice}
        </p>
      )}
      {loading ? (
        <p
          role="status"
          className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground"
        >
          Loading {kind}…
        </p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No {kind} have been recorded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article
              key={row.id}
              className="grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-[minmax(0,1fr)_220px]"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="font-700 text-foreground">{row.title}</h2>
                  <span className="text-xs text-muted-foreground">
                    {row.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{row.subtitle}</p>
                <p className="mt-2 break-words text-sm text-foreground">{row.detail}</p>
                <time className="mt-2 block text-xs text-muted-foreground" dateTime={row.created}>
                  {row.created ? new Date(row.created).toLocaleString('en-NP') : ''}
                </time>
              </div>
              <div>
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
                  {current.statuses.map((status) => (
                    <option value={status} key={status}>
                      {status.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
