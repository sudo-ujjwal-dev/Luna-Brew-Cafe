import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCustomerSession } from '@/lib/customer-auth';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const confirmationSchema = z.object({ received: z.boolean() });

export async function POST(request: Request, context: RouteContext) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }
  const customer = await getCustomerSession();
  if (!customer) {
    return NextResponse.json({ error: 'Customer sign-in is required.' }, { status: 401 });
  }
  const parsed = confirmationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Choose a delivery confirmation response.' },
      { status: 400 }
    );
  }

  const { id } = await context.params;
  const confirmedAt = new Date();
  try {
    const result = await prisma.order.updateMany({
      where: {
        id,
        userId: customer.id,
        type: 'DELIVERY',
        status: 'OUT_FOR_DELIVERY',
        deliveryConfirmedAt: null,
      },
      data: parsed.data.received
        ? { status: 'COMPLETED', deliveryConfirmedAt: confirmedAt }
        : { status: 'DELIVERY_ISSUE', deliveryIssueReportedAt: confirmedAt },
    });
    if (result.count !== 1) {
      const order = await prisma.order.findFirst({
        where: { id, userId: customer.id },
        select: { status: true, type: true },
      });
      if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      return NextResponse.json(
        {
          error:
            order.type !== 'DELIVERY'
              ? 'Delivery confirmation is only available for delivery orders.'
              : 'This order is not awaiting a delivery confirmation.',
        },
        { status: 409 }
      );
    }
    return NextResponse.json({
      status: parsed.data.received ? 'COMPLETED' : 'DELIVERY_ISSUE',
      confirmedAt: confirmedAt.toISOString(),
    });
  } catch (error) {
    console.error('Customer delivery confirmation failed:', error);
    return NextResponse.json(
      { error: 'Unable to save your delivery response right now.' },
      { status: 503 }
    );
  }
}
