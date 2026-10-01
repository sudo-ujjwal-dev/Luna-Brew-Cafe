import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/AdminLayout';
import KPIBentoGrid, { type DashboardSummary } from './components/KPIBentoGrid';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard — Luna Brew Admin',
  description: 'Luna Brew Café admin dashboard — operations overview',
};

export const dynamic = 'force-dynamic';

function pokharaDayRange() {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const start = new Date(`${today}T00:00:00.000+05:45`);
  const [year, month, day] = today.split('-').map(Number);
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000), today, nextDay };
}

export default async function AdminDashboardPage() {
  let summary: DashboardSummary | null = null;
  let recentOrders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let upcomingReservations: Awaited<ReturnType<typeof prisma.reservation.findMany>> = [];
  try {
    const { start, end, today, nextDay } = pokharaDayRange();
    const [
      revenue,
      todayOrders,
      pendingOrders,
      todayReservations,
      activeMenuItems,
      reviews,
      pendingReviews,
      recentOrderRecords,
      upcomingReservationRecords,
    ] = await Promise.all([
        prisma.order.aggregate({
          where: { status: 'COMPLETED', createdAt: { gte: start, lt: end } },
          _sum: { total: true },
        }),
        prisma.order.count({
          where: { createdAt: { gte: start, lt: end }, status: { not: 'CANCELLED' } },
        }),
        prisma.order.count({
          where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] } },
        }),
        prisma.reservation.count({
          where: {
            date: {
              gte: new Date(`${today}T00:00:00.000Z`),
              lt: new Date(`${nextDay}T00:00:00.000Z`),
            },
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
        }),
        prisma.menuItem.count({ where: { available: true, category: { active: true } } }),
        prisma.review.aggregate({
          where: { status: 'APPROVED' },
          _avg: { rating: true },
          _count: { _all: true },
        }),
        prisma.review.count({ where: { status: 'PENDING' } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            total: true,
            status: true,
            createdAt: true,
          },
        }),
        prisma.reservation.findMany({
          where: {
            date: { gte: new Date(`${today}T00:00:00.000Z`) },
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
      todayRevenue: revenue._sum.total?.toNumber() ?? 0,
      todayOrders,
      pendingOrders,
      todayReservations,
      activeMenuItems,
      averageRating: reviews._avg.rating,
      approvedReviews: reviews._count._all,
      pendingReviews,
    };
  } catch (error) {
    console.error('Admin dashboard statistics query failed:', error);
  }

  return (
    <AdminLayout title="Dashboard" subtitle="Luna Brew Café operations">
      <div className="space-y-8">
        {summary ? (
          <KPIBentoGrid summary={summary} />
        ) : (
          <div role="alert" className="rounded-2xl border border-danger/30 bg-danger-bg p-5">
            <h2 className="font-700 text-foreground">Dashboard data is unavailable</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Check the database connection and run the migration before using business reports.
            </p>
          </div>
        )}
        {summary && (
          <div className="grid gap-6 xl:grid-cols-2">
            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="font-700 text-foreground">Recent orders</h2>
                <Link href="/admin-dashboard/orders" className="text-sm font-600 text-primary hover:underline">View all</Link>
              </div>
              {recentOrders.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">No orders have been placed yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <li key={order.id} className="flex items-center justify-between gap-3 px-5 py-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-600 text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">#{order.orderNumber} · {order.status.replaceAll('_', ' ')}</p>
                      </div>
                      <p className="shrink-0 text-sm font-700 text-foreground">Rs. {order.total.toNumber().toLocaleString('en-NP')}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="font-700 text-foreground">Upcoming reservations</h2>
                <Link href="/admin-dashboard/reservations" className="text-sm font-600 text-primary hover:underline">View all</Link>
              </div>
              {upcomingReservations.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">No upcoming reservations.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {upcomingReservations.map((reservation) => (
                    <li key={reservation.id} className="flex items-center justify-between gap-3 px-5 py-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-600 text-foreground">{reservation.customerName}</p>
                        <p className="text-xs text-muted-foreground">{reservation.date.toLocaleDateString('en-NP', { timeZone: 'Asia/Kathmandu' })} · {reservation.time} · {reservation.guestCount} guests</p>
                      </div>
                      <span className="shrink-0 text-xs font-600 text-muted-foreground">{reservation.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
