import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const statusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'COMPLETED',
    'CANCELLED',
  ]),
});

export async function PATCH(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const parsedBody = await request.json().catch(() => null);
  const parsed = statusSchema.safeParse(parsedBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose a valid order status.' }, { status: 400 });
  }

  const { id } = await context.params;
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, orderNumber: true, status: true, updatedAt: true },
    });
    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }
    console.error('Admin order status update failed:', error);
    return NextResponse.json({ error: 'Unable to update this order.' }, { status: 503 });
  }
}
