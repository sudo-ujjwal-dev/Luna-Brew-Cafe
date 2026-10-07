import { NextResponse } from 'next/server';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authorizationError = await adminAuthorizationError(request);
  if (authorizationError) return authorizationError;

  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        phone: true,
        email: true,
        type: true,
        status: true,
        total: true,
        deliveryAddress: true,
        deliveryConfirmedAt: true,
        deliveryIssueReportedAt: true,
        deliveryIssueResolvedAt: true,
        createdAt: true,
        items: { select: { itemName: true, quantity: true, lineTotal: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({
      orders: orders.map((order) => ({
        ...order,
        subtotal: order.subtotal.toNumber(),
        deliveryFee: order.deliveryFee.toNumber(),
        total: order.total.toNumber(),
        deliveryConfirmedAt: order.deliveryConfirmedAt?.toISOString() ?? null,
        deliveryIssueReportedAt: order.deliveryIssueReportedAt?.toISOString() ?? null,
        deliveryIssueResolvedAt: order.deliveryIssueResolvedAt?.toISOString() ?? null,
        items: order.items.map((item) => ({
          ...item,
          lineTotal: item.lineTotal.toNumber(),
        })),
      })),
    });
  } catch (error) {
    console.error('Admin order query failed:', error);
    return NextResponse.json({ error: 'Orders are temporarily unavailable.' }, { status: 503 });
  }
}
