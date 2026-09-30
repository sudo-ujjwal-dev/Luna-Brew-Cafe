'use client';

import React, { useState } from 'react';
import { CalendarDays, Check, X, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Reservation {
  id: string;
  name: string;
  guests: number;
  date: string;
  time: string;
  phone: string;
  status: ReservationStatus;
  message?: string;
}

// Backend integration point: replace with fetch('/api/admin/reservations')
const initialReservations: Reservation[] = [
  { id: 'res-001', name: 'Priya Menon', guests: 2, date: 'Sep 28', time: '7:00 PM', phone: '+1 718-555-0201', status: 'pending', message: 'Window seat preferred' },
  { id: 'res-002', name: 'Marcus Delacroix', guests: 4, date: 'Sep 28', time: '7:30 PM', phone: '+1 718-555-0134', status: 'confirmed' },
  { id: 'res-003', name: 'Sofia Okafor', guests: 3, date: 'Sep 28', time: '8:00 PM', phone: '+1 718-555-0309', status: 'pending', message: 'Birthday celebration' },
  { id: 'res-004', name: 'Liam Kowalski', guests: 6, date: 'Sep 29', time: '12:30 PM', phone: '+1 718-555-0472', status: 'confirmed' },
  { id: 'res-005', name: 'Aisha Ndiaye', guests: 2, date: 'Sep 29', time: '1:00 PM', phone: '+1 718-555-0588', status: 'pending' },
  { id: 'res-006', name: 'Carlos Reyes', guests: 5, date: 'Sep 29', time: '7:00 PM', phone: '+1 718-555-0621', status: 'confirmed' },
  { id: 'res-007', name: 'Elena Vasquez', guests: 2, date: 'Sep 30', time: '6:30 PM', phone: '+1 718-555-0743', status: 'cancelled' },
  { id: 'res-008', name: 'James Thornton', guests: 8, date: 'Sep 30', time: '7:30 PM', phone: '+1 718-555-0855', status: 'pending', message: 'Corporate dinner, need projector' },
];

const statusConfig: Record<ReservationStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'status-pending' },
  confirmed: { label: 'Confirmed', className: 'status-confirmed' },
  completed: { label: 'Completed', className: 'status-completed' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled' },
};

export default function ReservationsTable() {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [filter, setFilter] = useState<ReservationStatus | 'all'>('all');

  const updateStatus = (id: string, newStatus: ReservationStatus) => {
    // Backend integration point: PATCH /api/admin/reservations/:id
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    toast.success(`Reservation ${newStatus}`);
  };

  const filtered = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter);
  const pendingCount = reservations.filter((r) => r.status === 'pending').length;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-primary" />
          <h3 className="font-700 text-foreground text-base">Reservations</h3>
          {pendingCount > 0 && (
            <span className="bg-warning-bg text-warning text-xs font-700 px-2 py-0.5 rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
            <button
              key={`res-filter-${s}`}
              onClick={() => setFilter(s)}
              className={`text-xs font-600 px-2.5 py-1.5 rounded-lg transition-all ${
                filter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground">Guest</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground">Date & Time</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground">Guests</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                  No reservations found
                </td>
              </tr>
            ) : (
              filtered.map((res) => (
                <tr key={res.id} className="hover:bg-secondary/30 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-600 text-foreground text-sm">{res.name}</p>
                    <p className="text-xs text-muted-foreground">{res.phone}</p>
                    {res.message && (
                      <p className="text-xs text-accent mt-0.5 truncate max-w-[140px]" title={res.message}>
                        {res.message}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-600 text-foreground text-sm font-mono-data">{res.date}</p>
                    <p className="text-xs text-muted-foreground font-mono-data">{res.time}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-700 text-foreground font-mono-data">{res.guests}</span>
                    <span className="text-xs text-muted-foreground ml-1">pax</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-600 px-2.5 py-1 rounded-full ${statusConfig[res.status].className}`}>
                      {statusConfig[res.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {res.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(res.id, 'confirmed')}
                            className="w-7 h-7 rounded-lg bg-success-bg hover:bg-success text-success hover:text-white flex items-center justify-center transition-all"
                            title="Confirm reservation"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={() => updateStatus(res.id, 'cancelled')}
                            className="w-7 h-7 rounded-lg bg-danger-bg hover:bg-danger text-danger hover:text-white flex items-center justify-center transition-all"
                            title="Cancel reservation"
                          >
                            <X size={13} />
                          </button>
                        </>
                      )}
                      {res.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(res.id, 'completed')}
                          className="w-7 h-7 rounded-lg bg-info-bg hover:bg-info text-info hover:text-white flex items-center justify-center transition-all"
                          title="Mark as completed"
                        >
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-600 text-foreground">{filtered.length}</span> of{' '}
          <span className="font-600 text-foreground">{reservations.length}</span> reservations
        </p>
        <button className="text-xs text-primary font-600 hover:underline">View all</button>
      </div>
    </div>
  );
}