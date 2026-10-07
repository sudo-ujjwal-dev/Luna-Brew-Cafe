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
    'DELIVERY_ISSUE',
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
    const existing = await prisma.order.findUnique({
      where: { id },
      select: { type: true, status: true },
    });
    if (!existing) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    if (existing.type === 'DELIVERY' && parsed.data.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Delivery orders can only be completed when the customer confirms receipt.' },
        { status: 409 }
      );
    }
    if (existing.type !== 'DELIVERY' && parsed.data.status === 'DELIVERY_ISSUE') {
      return NextResponse.json(
        { error: 'Delivery issues can only be recorded on delivery orders.' },
        { status: 400 }
      );
    }
    if (existing.type === 'DELIVERY' && existing.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Customer-confirmed delivery completion cannot be changed.' },
        { status: 409 }
      );
    }
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: parsed.data.status,
        ...(existing.status === 'DELIVERY_ISSUE' && parsed.data.status !== 'DELIVERY_ISSUE'
          ? { deliveryIssueResolvedAt: new Date() }
          : {}),
      },
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
