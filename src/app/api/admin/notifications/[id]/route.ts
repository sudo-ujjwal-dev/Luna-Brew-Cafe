import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const readSchema = z.object({ read: z.boolean() });

export async function PATCH(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const parsed = readSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Provide a valid notification read state.' },
      { status: 400 }
    );
  }

  const { id } = await context.params;
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { readAt: parsed.data.read ? new Date() : null },
      select: { id: true, readAt: true },
    });
    return NextResponse.json({
      notification: {
        ...notification,
        readAt: notification.readAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Notification not found.' }, { status: 404 });
    }
    console.error('Admin notification read-state update failed:', error);
    return NextResponse.json({ error: 'Unable to update this notification.' }, { status: 503 });
  }
}
