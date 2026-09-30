import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


// Backend integration point: replace with fetch('/api/admin/kpi-summary')
const kpiData = [
  {
    id: 'kpi-revenue',
    label: "Today\'s Revenue",
    value: '$847.50',
    subValue: '23 orders',
    trend: '+12.4%',
    trendUp: true,
    trendLabel: 'vs yesterday',
    Icon: DollarSign,
    color: 'bg-success-bg',
    iconColor: 'text-success',
    textColor: 'text-success',
    featured: true,
  },
  {
    id: 'kpi-pending-orders',
    label: 'Pending Orders',
    value: '4',
    subValue: '2 preparing',
    trend: 'Action needed',
    trendUp: false,
    trendLabel: 'oldest: 18 min',
    Icon: ShoppingBag,
    color: 'bg-warning-bg',
    iconColor: 'text-warning',
    textColor: 'text-warning',
    alert: true,
    featured: false,
  },
  {
    id: 'kpi-reservations',
    label: "Today\'s Reservations",
    value: '7',
    subValue: '3 confirmed',
    trend: '+2',
    trendUp: true,
    trendLabel: 'vs last Monday',
    Icon: CalendarDays,
    color: 'bg-info-bg',
    iconColor: 'text-info',
    textColor: 'text-info',
    featured: false,
  },
  {
    id: 'kpi-menu',
    label: 'Active Menu Items',
    value: '38',
    subValue: '2 unavailable',
    trend: '-2',
    trendUp: false,
    trendLabel: 'vs last week',
    Icon: UtensilsCrossed,
    color: 'bg-secondary',
    iconColor: 'text-primary',
    textColor: 'text-muted-foreground',
    featured: false,
  },
  {
    id: 'kpi-rating',
    label: 'Avg Rating',
    value: '4.9',
    subValue: '340 reviews',
    trend: '+0.1',
    trendUp: true,
    trendLabel: 'this month',
    Icon: Star,
    color: 'bg-accent/10',
    iconColor: 'text-accent',
    textColor: 'text-accent-foreground',
    featured: false,
  },
  {
    id: 'kpi-reviews',
    label: 'Pending Reviews',
    value: '3',
    subValue: 'Awaiting approval',
    trend: 'Review now',
    trendUp: null,
    trendLabel: 'submitted today',
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
          Last updated: 1:45 PM
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
            alert,
          }) => (
            <div
              key={id}
              className={`${color} rounded-2xl border border-border p-4 relative overflow-hidden`}
            >
              {alert && (
                <div className="absolute top-2.5 right-2.5">
                  <AlertTriangle size={14} className="text-warning" />
                </div>
              )}

              <div className={`w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center mb-3`}>
                <Icon size={16} className={iconColor} />
              </div>

              <p className="text-xs font-600 text-muted-foreground mb-1 leading-tight">{label}</p>
              <p className={`text-2xl font-800 font-mono-data ${textColor} leading-none mb-1`}>
                {value}
              </p>
              <p className="text-xs text-muted-foreground font-500">{subValue}</p>

              {trend && (
                <div className="flex items-center gap-1 mt-2">
                  {trendUp === true && <TrendingUp size={11} className="text-success" />}
                  {trendUp === false && trendUp !== null && <TrendingDown size={11} className="text-danger" />}
                  <span
                    className={`text-xs font-600 ${
                      trendUp === true
                        ? 'text-success'
                        : trendUp === false
                        ? 'text-danger' :'text-warning'
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