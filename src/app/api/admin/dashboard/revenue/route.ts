import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const periodSchema = z.enum(['today', '7d', '30d', 'month']);
type RevenuePeriod = z.infer<typeof periodSchema>;

const kathmanduDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kathmandu',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function dateAtKathmanduMidnight(date: string) {
  return new Date(`${date}T00:00:00.000+05:45`);
}

function shiftDate(date: string, days: number) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function dateRange(period: RevenuePeriod, today: string) {
  const startDate =
    period === 'today'
      ? today
      : period === '7d'
        ? shiftDate(today, -6)
        : period === '30d'
          ? shiftDate(today, -29)
          : `${today.slice(0, 7)}-01`;
  const endDate = shiftDate(today, 1);
  return {
    startDate,
    start: dateAtKathmanduMidnight(startDate),
    end: dateAtKathmanduMidnight(endDate),
  };
}

function trendDates(period: RevenuePeriod, startDate: string, today: string) {
  const dates: string[] = [];
  for (let date = startDate; date <= today; date = shiftDate(date, 1)) dates.push(date);
  return dates;
}

function money(value: number) {
  return Number(value.toFixed(2));
}

export async function GET(request: Request) {
  const authorizationError = await adminAuthorizationError(request);
  if (authorizationError) return authorizationError;

  const period = periodSchema.safeParse(new URL(request.url).searchParams.get('period') ?? 'today');
  if (!period.success) {
    return NextResponse.json(
      { error: 'Choose today, 7 days, 30 days, or this month.' },
      { status: 400 }
    );
  }

  try {
    const today = kathmanduDateFormatter.format(new Date());
    const selectedRange = dateRange(period.data, today);
    const [year, calendarMonth, day] = today.split('-').map(Number);
    const weekday = new Date(Date.UTC(year, calendarMonth - 1, day)).getUTCDay();
    const weekStartDate = shiftDate(today, -((weekday + 6) % 7));
    const weekRange = {
      start: dateAtKathmanduMidnight(weekStartDate),
      end: dateAtKathmanduMidnight(shiftDate(today, 1)),
    };
    const monthRange = dateRange('month', today);
    const [selectedOrders, allTime, week, monthAggregate] = await Promise.all([
      prisma.order.findMany({
        where: {
          status: 'COMPLETED',
          completedAt: { gte: selectedRange.start, lt: selectedRange.end },
        },
        select: { total: true, completedAt: true },
        orderBy: { completedAt: 'asc' },
      }),
      prisma.order.aggregate({
        where: { status: 'COMPLETED', completedAt: { not: null } },
        _sum: { total: true },
        _count: { _all: true },
      }),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          completedAt: { gte: weekRange.start, lt: weekRange.end },
        },
        _sum: { total: true },
        _count: { _all: true },
      }),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          completedAt: { gte: monthRange.start, lt: monthRange.end },
        },
        _sum: { total: true },
        _count: { _all: true },
      }),
    ]);
    const dates = trendDates(period.data, selectedRange.startDate, today);
    const totalsByDate = new Map(dates.map((date) => [date, 0]));
    let selectedTotal = 0;
    for (const order of selectedOrders) {
      const total = order.total.toNumber();
      selectedTotal += total;
      if (order.completedAt) {
        const date = kathmanduDateFormatter.format(order.completedAt);
        totalsByDate.set(date, (totalsByDate.get(date) ?? 0) + total);
      }
    }

    return NextResponse.json({
      period: period.data,
      revenue: money(selectedTotal),
      orderCount: selectedOrders.length,
      averageOrder: selectedOrders.length ? money(selectedTotal / selectedOrders.length) : 0,
      thisWeekRevenue: money(week._sum.total?.toNumber() ?? 0),
      thisMonthRevenue: money(monthAggregate._sum.total?.toNumber() ?? 0),
      totalCompletedRevenue: money(allTime._sum.total?.toNumber() ?? 0),
      totalCompletedOrders: allTime._count._all,
      trend: dates.map((date) => ({ date, total: money(totalsByDate.get(date) ?? 0) })),
    });
  } catch (error) {
    console.error('Admin completed-order revenue query failed:', error);
    return NextResponse.json(
      { error: 'Revenue data is temporarily unavailable.' },
      { status: 503 }
    );
  }
}
