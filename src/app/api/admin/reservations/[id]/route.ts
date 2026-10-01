import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const statusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED']),
});

export async function PATCH(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose a valid reservation status.' }, { status: 400 });
  }
  const { id } = await context.params;
  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, status: true, updatedAt: true },
    });
    return NextResponse.json({ reservation });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Reservation not found.' }, { status: 404 });
    }
    console.error('Admin reservation update failed:', error);
    return NextResponse.json({ error: 'Unable to update this reservation.' }, { status: 503 });
  }
}
