import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authorizationError = await adminAuthorizationError(request);
  if (authorizationError) return authorizationError;

  try {
    const [notifications, unreadCount, unreadByType] = await Promise.all([
      prisma.notification.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          link: true,
          readAt: true,
          createdAt: true,
        },
      }),
      prisma.notification.count({ where: { readAt: null } }),
      prisma.notification.groupBy({
        by: ['type'],
        where: { readAt: null },
        _count: { _all: true },
      }),
    ]);
    return NextResponse.json({
      notifications: notifications.map((notification) => ({
        ...notification,
        readAt: notification.readAt?.toISOString() ?? null,
        createdAt: notification.createdAt.toISOString(),
      })),
      unreadCount,
      unreadCounts: Object.fromEntries(unreadByType.map(({ type, _count }) => [type, _count._all])),
    });
  } catch (error) {
    console.error('Admin notification query failed:', error);
    return NextResponse.json(
      { error: 'Notifications are temporarily unavailable.' },
      { status: 503 }
    );
  }
}

const readAllSchema = z.object({ markAllRead: z.literal(true) });

export async function PATCH(request: Request) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const parsed = readAllSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Provide a valid mark-all-read request.' }, { status: 400 });
  }

  try {
    const result = await prisma.notification.updateMany({
      where: { readAt: null },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ updated: result.count });
  } catch (error) {
    console.error('Admin mark-all-notifications-read failed:', error);
    return NextResponse.json({ error: 'Unable to update notifications.' }, { status: 503 });
  }
}
