import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Star,
  MessageSquare,
} from 'lucide-react';

export interface DashboardSummary {
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  todayReservations: number;
  activeMenuItems: number;
  averageRating: number | null;
  approvedReviews: number;
  pendingReviews: number;
}

const currency = (value: number) =>
  `Rs. ${value.toLocaleString('en-NP', { maximumFractionDigits: 2 })}`;

function createKpiData(summary: DashboardSummary) {
  return [
    {
      id: 'kpi-revenue',
      label: "Today's Revenue",
      value: currency(summary.todayRevenue),
      subValue: `${summary.todayOrders} orders today`,
      Icon: DollarSign,
      color: 'bg-success-bg',
      iconColor: 'text-success',
      textColor: 'text-success',
      featured: true,
    },
    {
      id: 'kpi-pending-orders',
      label: 'Pending Orders',
      value: String(summary.pendingOrders),
      subValue: 'In progress or needs attention',
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
      value: String(summary.todayReservations),
      subValue: 'Today',
      Icon: CalendarDays,
      color: 'bg-info-bg',
      iconColor: 'text-info',
      textColor: 'text-info',
      featured: false,
    },
    {
      id: 'kpi-menu',
      label: 'Active Menu Items',
      value: String(summary.activeMenuItems),
      subValue: 'Available now',
      Icon: UtensilsCrossed,
      color: 'bg-secondary',
      iconColor: 'text-primary',
      textColor: 'text-muted-foreground',
      featured: false,
    },
    {
      id: 'kpi-rating',
      label: 'Avg Rating',
      value: summary.averageRating === null ? '—' : summary.averageRating.toFixed(1),
      subValue: `${summary.approvedReviews} approved reviews`,
      Icon: Star,
      color: 'bg-accent/10',
      iconColor: 'text-accent',
      textColor: 'text-accent-foreground',
      featured: false,
    },
    {
      id: 'kpi-reviews',
      label: 'Pending Reviews',
      value: String(summary.pendingReviews),
      subValue: 'Awaiting moderation',
      Icon: MessageSquare,
      color: 'bg-danger-bg',
      iconColor: 'text-danger',
      textColor: 'text-danger',
      alert: true,
      featured: false,
    },
  ];
}

interface KPIBentoGridProps {
  summary: DashboardSummary;
}

export default function KPIBentoGrid({ summary }: KPIBentoGridProps) {
  const kpiData = createKpiData(summary);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-700 text-foreground">Operations Overview</h2>
        <span className="text-xs text-muted-foreground font-mono-data">Live database summary</span>
      </div>

      {/* 6 cards → grid-cols-3 × 2 rows */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData?.map(({ id, label, value, subValue, Icon, color, iconColor, textColor }) => (
          <div
            key={id}
            className={`${color} rounded-2xl border border-border p-4 relative overflow-hidden`}
          >
            <div className={`w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center mb-3`}>
              <Icon size={16} className={iconColor} />
            </div>

            <p className="text-xs font-600 text-muted-foreground mb-1 leading-tight">{label}</p>
            <p className={`text-2xl font-800 font-mono-data ${textColor} leading-none mb-1`}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground font-500">{subValue}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
