import Link from 'next/link';
import {
  CalendarDays,
  CircleAlert,
  DollarSign,
  MessageSquare,
  PackageCheck,
  ShoppingBag,
  Star,
  UtensilsCrossed,
} from 'lucide-react';

export interface DashboardSummary {
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  todayReservations: number;
  pendingReservations: number;
  activeMenuItems: number;
  averageRating: number | null;
  approvedReviews: number;
  pendingReviews: number;
  unreadMessages: number;
  activeDeliveries: number;
  deliveryIssues: number;
}

const currency = (value: number) =>
  `Rs. ${value.toLocaleString('en-NP', { maximumFractionDigits: 2 })}`;

interface KPIBentoGridProps {
  summary: DashboardSummary;
}

export default function KPIBentoGrid({ summary }: KPIBentoGridProps) {
  const kpiData = [
    {
      label: "Today's completed-order revenue",
      value: currency(summary.todayRevenue),
      note: 'Completed orders only',
      Icon: DollarSign,
      href: '/admin-dashboard/orders',
    },
    {
      label: "Today's orders",
      value: String(summary.todayOrders),
      note: 'Excludes cancelled orders',
      Icon: ShoppingBag,
      href: '/admin-dashboard/orders',
    },
    {
      label: 'Pending orders',
      value: String(summary.pendingOrders),
      note: 'Awaiting confirmation',
      Icon: ShoppingBag,
      href: '/admin-dashboard/orders',
    },
    {
      label: "Today's reservations",
      value: String(summary.todayReservations),
      note: 'Pending or confirmed',
      Icon: CalendarDays,
      href: '/admin-dashboard/reservations',
    },
    {
      label: 'Pending reservations',
      value: String(summary.pendingReservations),
      note: 'Awaiting approval',
      Icon: CalendarDays,
      href: '/admin-dashboard/reservations',
    },
    {
      label: 'Pending reviews',
      value: String(summary.pendingReviews),
      note: 'Awaiting moderation',
      Icon: Star,
      href: '/admin-dashboard/reviews',
    },
    {
      label: 'Unread messages',
      value: String(summary.unreadMessages),
      note: 'Customer messages',
      Icon: MessageSquare,
      href: '/admin-dashboard/messages',
    },
    {
      label: 'Active deliveries',
      value: String(summary.activeDeliveries),
      note: 'Out for delivery',
      Icon: PackageCheck,
      href: '/admin-dashboard/orders',
    },
    {
      label: 'Delivery issues',
      value: String(summary.deliveryIssues),
      note: 'Needs follow-up',
      Icon: CircleAlert,
      href: '/admin-dashboard/orders',
    },
    {
      label: 'Menu & rating',
      value: `${summary.activeMenuItems} · ${summary.averageRating === null ? '—' : summary.averageRating.toFixed(1)}`,
      note: `${summary.approvedReviews} approved reviews`,
      Icon: UtensilsCrossed,
      href: '/admin-dashboard/menu',
    },
  ];

  return (
    <section aria-labelledby="operations-overview-heading">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="operations-overview-heading" className="text-base font-700 text-foreground">
          Operations overview
        </h2>
        <span className="text-xs text-muted-foreground">Live database summary</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {kpiData.map(({ label, value, note, Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="min-w-0 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
          >
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
              <Icon size={16} className="text-primary" />
            </div>
            <p className="mb-1 text-xs font-600 leading-tight text-muted-foreground">{label}</p>
            <p className="mb-1 break-words text-xl font-800 leading-tight text-foreground">
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{note}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
