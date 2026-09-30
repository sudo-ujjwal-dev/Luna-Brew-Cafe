'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,  } from 'recharts';

// Backend integration point: replace with fetch('/api/admin/revenue-weekly')
const weeklyRevenue = [
  { id: 'day-mon', day: 'Mon', revenue: 612, orders: 18 },
  { id: 'day-tue', day: 'Tue', revenue: 788, orders: 22 },
  { id: 'day-wed', day: 'Wed', revenue: 534, orders: 16 },
  { id: 'day-thu', day: 'Thu', revenue: 920, orders: 27 },
  { id: 'day-fri', day: 'Fri', revenue: 1140, orders: 34 },
  { id: 'day-sat', day: 'Sat', revenue: 1380, orders: 41 },
  { id: 'day-sun', day: 'Sun', revenue: 847, orders: 23 },
];

const todayDay = 'Sun';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { orders: number } }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-card">
      <p className="text-xs font-600 text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-800 text-foreground font-mono-data">
        ${payload[0].value.toFixed(2)}
      </p>
      <p className="text-xs text-muted-foreground">{payload[0].payload.orders} orders</p>
    </div>
  );
}

export default function RevenueChart() {
  const totalWeek = weeklyRevenue.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-700 text-foreground text-base">Weekly Revenue</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Mon Sep 22 – Sun Sep 28, 2026</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-800 text-foreground font-mono-data">${totalWeek.toLocaleString()}</p>
          <p className="text-xs text-success font-600">+8.3% vs last week</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyRevenue} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4, radius: 8 }} />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
            {weeklyRevenue.map((entry) => (
              <Cell
                key={entry.id}
                fill={entry.day === todayDay ? 'var(--primary)' : 'var(--accent)'}
                opacity={entry.day === todayDay ? 1 : 0.65}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-accent opacity-65" />
          <span className="text-xs text-muted-foreground">Previous days</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
      </div>
    </div>
  );
}