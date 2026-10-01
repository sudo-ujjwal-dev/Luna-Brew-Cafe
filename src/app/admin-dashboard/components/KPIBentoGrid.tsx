import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Star,
  MessageSquare,
} from 'lucide-react';

const kpiData = [
  {
    id: 'kpi-revenue',
    label: "Today's Revenue",
    value: '—',
    subValue: 'Database not connected',
    trend: '',
    trendUp: null,
    trendLabel: '',
    Icon: DollarSign,
    color: 'bg-success-bg',
    iconColor: 'text-success',
    textColor: 'text-success',
    featured: true,
  },
  {
    id: 'kpi-pending-orders',
    label: 'Pending Orders',
    value: '—',
    subValue: 'Database not connected',
    trend: '',
    trendUp: null,
    trendLabel: '',
    Icon: ShoppingBag,
    color: 'bg-warning-bg',
    iconColor: 'text-warning',
    textColor: 'text-warning',
    alert: true,
    featured: false,
  },
  {
    id: 'kpi-reservations',
    label: "Today's Reservations",
    value: '—',
    subValue: 'Database not connected',
    trend: '',
    trendUp: null,
    trendLabel: '',
    Icon: CalendarDays,
    color: 'bg-info-bg',
    iconColor: 'text-info',
    textColor: 'text-info',
    featured: false,
  },
  {
    id: 'kpi-menu',
    label: 'Active Menu Items',
    value: '—',
    subValue: 'Database not connected',
    trend: '',
    trendUp: null,
    trendLabel: '',
    Icon: UtensilsCrossed,
    color: 'bg-secondary',
    iconColor: 'text-primary',
    textColor: 'text-muted-foreground',
    featured: false,
  },
  {
    id: 'kpi-rating',
    label: 'Avg Rating',
    value: '—',
    subValue: 'Database not connected',
    trend: '',
    trendUp: null,
    trendLabel: '',
    Icon: Star,
    color: 'bg-accent/10',
    iconColor: 'text-accent',
    textColor: 'text-accent-foreground',
    featured: false,
  },
  {
    id: 'kpi-reviews',
    label: 'Pending Reviews',
    value: '—',
    subValue: 'Database not connected',
    trend: '',
    trendUp: null,
    trendLabel: '',
    Icon: MessageSquare,
    color: 'bg-danger-bg',
    iconColor: 'text-danger',
    textColor: 'text-danger',
    alert: true,
    featured: false,
  },
];

export default function KPIBentoGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-700 text-foreground">Operations Overview</h2>
        <span className="text-xs text-muted-foreground font-mono-data">
          No live records available
        </span>
      </div>

      {/* 6 cards → grid-cols-3 × 2 rows */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData?.map(
          ({
            id,
            label,
            value,
            subValue,
            trend,
            trendUp,
            trendLabel,
            Icon,
            color,
            iconColor,
            textColor,
          }) => (
            <div
              key={id}
              className={`${color} rounded-2xl border border-border p-4 relative overflow-hidden`}
            >
              <div
                className={`w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center mb-3`}
              >
                <Icon size={16} className={iconColor} />
              </div>

              <p className="text-xs font-600 text-muted-foreground mb-1 leading-tight">{label}</p>
              <p className={`text-2xl font-800 font-mono-data ${textColor} leading-none mb-1`}>
                {value}
              </p>
              <p className="text-xs text-muted-foreground font-500">{subValue}</p>

              {trend && (
                <div className="flex items-center gap-1 mt-2">
                  <span
                    className={`text-xs font-600 ${
                      trendUp === null ? 'text-warning' : 'text-success'
                    }`}
                  >
                    {trend}
                  </span>
                  <span className="text-xs text-muted-foreground">{trendLabel}</span>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
