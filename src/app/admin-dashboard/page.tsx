import type { Metadata } from 'next';
import type { Order, Reservation } from '@prisma/client';
import Link from 'next/link';
import { CalendarDays, Images, MessageSquare, Plus, ShoppingBag, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import KPIBentoGrid, { type DashboardSummary } from './components/KPIBentoGrid';
import RevenuePanel from './components/RevenuePanel';

export const metadata: Metadata = {
  title: 'Dashboard — Luna Brew Admin',
  description: 'Luna Brew Café admin dashboard — operations overview',
};

export const dynamic = 'force-dynamic';

type RecentOrder = Pick<
  Order,
  'id' | 'orderNumber' | 'customerName' | 'total' | 'status' | 'type' | 'createdAt'
>;
type UpcomingReservation = Pick<
  Reservation,
  'id' | 'customerName' | 'date' | 'time' | 'guestCount' | 'status'
>;

function pokharaDayRange() {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const [year, month, day] = today.split('-').map(Number);
  const start = new Date(`${today}T00:00:00.000+05:45`);
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000), today, nextDay };
}

const quickActions = [
  { href: '/admin-dashboard/menu', label: 'Add menu item', Icon: Plus },
  { href: '/admin-dashboard/orders', label: 'View orders', Icon: ShoppingBag },
  { href: '/admin-dashboard/reservations', label: 'View reservations', Icon: CalendarDays },
  { href: '/admin-dashboard/reviews', label: 'Review pending reviews', Icon: Star },
  { href: '/admin-dashboard/messages', label: 'View messages', Icon: MessageSquare },
  { href: '/admin-dashboard/gallery', label: 'Manage gallery', Icon: Images },
];

export default async function AdminDashboardPage() {
  let summary: DashboardSummary | null = null;
  let recentOrders: RecentOrder[] = [];
  let upcomingReservations: UpcomingReservation[] = [];
  try {
    const { start, end, today, nextDay } = pokharaDayRange();
    const reservationDayStart = new Date(`${today}T00:00:00.000Z`);
    const reservationDayEnd = new Date(`${nextDay}T00:00:00.000Z`);
    const [
      completedRevenue,
      todayOrders,
      pendingOrders,
      todayReservations,
      pendingReservations,
      activeMenuItems,
      reviews,
      pendingReviews,
      unreadMessages,
      activeDeliveries,
      deliveryIssues,
      recentOrderRecords,
      upcomingReservationRecords,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { status: 'COMPLETED', completedAt: { gte: start, lt: end } },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: { createdAt: { gte: start, lt: end }, status: { not: 'CANCELLED' } },
      }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.reservation.count({
        where: {
          date: { gte: reservationDayStart, lt: reservationDayEnd },
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      }),
      prisma.reservation.count({ where: { status: 'PENDING' } }),
      prisma.menuItem.count({ where: { available: true, category: { active: true } } }),
      prisma.review.aggregate({
        where: { status: 'APPROVED' },
        _avg: { rating: true },
        _count: { _all: true },
      }),
      prisma.review.count({ where: { status: 'PENDING' } }),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.order.count({ where: { type: 'DELIVERY', status: 'OUT_FOR_DELIVERY' } }),
      prisma.order.count({ where: { type: 'DELIVERY', status: 'DELIVERY_ISSUE' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          total: true,
          status: true,
          type: true,
          createdAt: true,
        },
      }),
      prisma.reservation.findMany({
        where: {
          date: { gte: reservationDayStart },
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
        take: 5,
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
        select: {
          id: true,
          customerName: true,
          date: true,
          time: true,
          guestCount: true,
          status: true,
        },
      }),
    ]);
    recentOrders = recentOrderRecords;
    upcomingReservations = upcomingReservationRecords;
    summary = {
      todayRevenue: completedRevenue._sum.total?.toNumber() ?? 0,
      todayOrders,
      pendingOrders,
      todayReservations,
      pendingReservations,
      activeMenuItems,
      averageRating: reviews._avg.rating,
      approvedReviews: reviews._count._all,
      pendingReviews,
      unreadMessages,
      activeDeliveries,
      deliveryIssues,
    };
  } catch (error) {
    console.error('Admin dashboard statistics query failed:', error);
  }

  const actionItems = summary
    ? [
        {
          count: summary.pendingOrders,
          text: 'orders waiting for confirmation',
          href: '/admin-dashboard/orders',
        },
        {
          count: summary.pendingReservations,
          text: 'reservations waiting for approval',
          href: '/admin-dashboard/reservations',
        },
        {
          count: summary.pendingReviews,
          text: 'reviews waiting for moderation',
          href: '/admin-dashboard/reviews',
        },
        {
          count: summary.unreadMessages,
          text: 'unread customer messages',
          href: '/admin-dashboard/messages',
        },
        {
          count: summary.deliveryIssues,
          text: 'delivery issues to follow up',
          href: '/admin-dashboard/orders',
        },
      ].filter((item) => item.count > 0)
    : [];

  return (
    <AdminLayout title="Dashboard" subtitle="Luna Brew Café operations">
      <div className="space-y-7">
        {summary ? (
          <>
            <KPIBentoGrid summary={summary} />
            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="section-label">Action required</p>
                  <h2 className="mt-1 text-lg font-700 text-foreground">
                    {actionItems.length ? 'Items needing your attention' : "You're all caught up."}
                  </h2>
                </div>
                {summary.activeDeliveries > 0 && (
                  <Link
                    href="/admin-dashboard/orders"
                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-600 text-foreground hover:bg-secondary"
                  >
                    {summary.activeDeliveries} active deliveries
                  </Link>
                )}
              </div>
              {actionItems.length > 0 ? (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {actionItems.map((item) => (
                    <li key={item.text}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm hover:bg-secondary/60"
                      >
                        <span className="text-foreground">{item.text}</span>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-700 text-primary">
                          {item.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  There are no pending orders, reservations, reviews, unread messages, or delivery
                  issues.
                </p>
              )}
            </section>
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 className="text-base font-700 text-foreground">Quick actions</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                {quickActions.map(({ href, label, Icon }) => (
                  <Link
                    href={href}
                    key={href}
                    className="flex min-h-20 flex-col items-start justify-between gap-3 rounded-xl border border-border p-3 text-sm font-600 text-foreground hover:bg-secondary/60"
                  >
                    <Icon size={18} className="text-primary" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <RevenuePanel />
            <div className="grid gap-6 xl:grid-cols-2">
              <section className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <h2 className="font-700 text-foreground">Recent orders</h2>
                  <Link
                    href="/admin-dashboard/orders"
                    className="text-sm font-600 text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>
                {recentOrders.length === 0 ? (
                  <p className="p-5 text-sm text-muted-foreground">No recent orders.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {recentOrders.map((order) => (
                      <li
                        key={order.id}
                        className="flex min-w-0 items-center justify-between gap-3 px-5 py-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-600 text-foreground">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            #{order.orderNumber} · {order.type.replaceAll('_', ' ')} ·{' '}
                            {order.status.replaceAll('_', ' ')}
                          </p>
                          <time
                            dateTime={order.createdAt.toISOString()}
                            className="text-xs text-muted-foreground"
                          >
                            {order.createdAt.toLocaleString('en-NP', {
                              timeZone: 'Asia/Kathmandu',
                            })}
                          </time>
                        </div>
                        <p className="shrink-0 text-sm font-700 text-foreground">
                          Rs. {order.total.toNumber().toLocaleString('en-NP')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <h2 className="font-700 text-foreground">Upcoming reservations</h2>
                  <Link
                    href="/admin-dashboard/reservations"
                    className="text-sm font-600 text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>
                {upcomingReservations.length === 0 ? (
                  <p className="p-5 text-sm text-muted-foreground">No upcoming reservations.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {upcomingReservations.map((reservation) => (
                      <li
                        key={reservation.id}
                        className="flex items-center justify-between gap-3 px-5 py-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-600 text-foreground">
                            {reservation.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reservation.date.toLocaleDateString('en-NP', {
                              timeZone: 'Asia/Kathmandu',
                            })}{' '}
                            · {reservation.time} · {reservation.guestCount} guests
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-600 text-muted-foreground">
                          {reservation.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        ) : (
          <div role="alert" className="rounded-2xl border border-danger/30 bg-danger-bg p-5">
            <h2 className="font-700 text-foreground">Dashboard data is unavailable</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Check the database connection and run pending migrations before using business
              reports.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
