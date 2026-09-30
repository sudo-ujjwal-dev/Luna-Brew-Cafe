'use client';

import React, { useState } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: string;
  total: number;
  type: 'dine-in' | 'takeaway';
  status: OrderStatus;
  placedAt: string;
}

// Backend integration point: replace with fetch('/api/admin/orders')
const initialOrders: Order[] = [
  { id: 'ord-001', orderNumber: '#LB-0284', customer: 'Table 4', items: 'Flat White × 2, Avocado Toast', total: 24.00, type: 'dine-in', status: 'preparing', placedAt: '1:28 PM' },
  { id: 'ord-002', orderNumber: '#LB-0285', customer: 'Nadia Flores', items: 'Cold Brew Float, Lemon Tart', total: 17.50, type: 'takeaway', status: 'pending', placedAt: '1:31 PM' },
  { id: 'ord-003', orderNumber: '#LB-0286', customer: 'Table 7', items: 'Luna Full Breakfast × 2, OJ', total: 40.00, type: 'dine-in', status: 'confirmed', placedAt: '1:33 PM' },
  { id: 'ord-004', orderNumber: '#LB-0287', customer: 'Kwame Asante', items: 'Matcha Latte, Chamomile', total: 11.00, type: 'takeaway', status: 'ready', placedAt: '1:19 PM' },
  { id: 'ord-005', orderNumber: '#LB-0283', customer: 'Table 2', items: 'Truffle Risotto, Flat White', total: 27.00, type: 'dine-in', status: 'completed', placedAt: '12:55 PM' },
  { id: 'ord-006', orderNumber: '#LB-0282', customer: 'Ingrid Svensson', items: 'Mango Cooler × 3', total: 21.00, type: 'takeaway', status: 'pending', placedAt: '1:38 PM' },
  { id: 'ord-007', orderNumber: '#LB-0281', customer: 'Table 1', items: 'Luna Espresso, Lemon Tart', total: 14.50, type: 'dine-in', status: 'completed', placedAt: '12:40 PM' },
  { id: 'ord-008', orderNumber: '#LB-0280', customer: 'Ryan Park', items: 'Cold Brew Float', total: 8.50, type: 'takeaway', status: 'cancelled', placedAt: '12:30 PM' },
];

const statusConfig: Record<OrderStatus, { label: string; className: string; next?: OrderStatus }> = {
  pending: { label: 'Pending', className: 'status-pending', next: 'confirmed' },
  confirmed: { label: 'Confirmed', className: 'status-confirmed', next: 'preparing' },
  preparing: { label: 'Preparing', className: 'status-preparing', next: 'ready' },
  ready: { label: 'Ready', className: 'status-ready', next: 'completed' },
  completed: { label: 'Completed', className: 'status-completed' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled' },
};

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    // Backend integration point: PATCH /api/admin/orders/:id/status
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    setOpenDropdown(null);
    toast.success(`Order updated to ${newStatus}`);
  };

  const activeCount = orders.filter((o) => ['pending', 'confirmed', 'preparing'].includes(o.status)).length;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} className="text-primary" />
          <h3 className="font-700 text-foreground text-base">Recent Orders</h3>
          {activeCount > 0 && (
            <span className="bg-accent/20 text-accent-foreground text-xs font-700 px-2 py-0.5 rounded-full">
              {activeCount} active
            </span>
          )}
        </div>
        <button className="text-xs text-primary font-600 hover:underline">View all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground">Order</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground">Items</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground">Total</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-600 text-muted-foreground">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-700 text-foreground text-xs font-mono-data">{order.orderNumber}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-600 ${
                        order.type === 'dine-in' ?'bg-info-bg text-info' :'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {order.type === 'dine-in' ? 'Dine-in' : 'Takeaway'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.customer}</p>
                </td>
                <td className="px-4 py-3 max-w-[140px]">
                  <p className="text-xs text-muted-foreground truncate" title={order.items}>
                    {order.items}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="font-700 text-foreground font-mono-data text-sm">
                    ${order.total.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                    className={`flex items-center gap-1 text-xs font-600 px-2.5 py-1 rounded-full transition-all hover:opacity-80 ${statusConfig[order.status].className}`}
                    disabled={order.status === 'completed' || order.status === 'cancelled'}
                  >
                    {statusConfig[order.status].label}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <ChevronDown size={11} />
                    )}
                  </button>

                  {openDropdown === order.id && (
                    <div className="absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-xl shadow-modal py-1 min-w-[140px]">
                      {statusFlow
                        .filter((s) => s !== order.status)
                        .map((s) => (
                          <button
                            key={`status-opt-${order.id}-${s}`}
                            onClick={() => updateStatus(order.id, s)}
                            className={`w-full text-left px-3 py-2 text-xs font-600 hover:bg-secondary/60 transition-colors ${statusConfig[s].className} bg-transparent`}
                          >
                            → {statusConfig[s].label}
                          </button>
                        ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground font-mono-data">{order.placedAt}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-600 text-foreground">{orders.length}</span> orders today ·{' '}
          <span className="font-600 text-success">
            ${orders.filter((o) => o.status === 'completed').reduce((s, o) => s + o.total, 0).toFixed(2)}
          </span>{' '}
          completed revenue
        </p>
      </div>
    </div>
  );
}