import { NextResponse } from 'next/server';
import { reviewSchema } from '@/lib/validation';
import { getCustomerSession } from '@/lib/customer-auth';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }
  const customer = await getCustomerSession();
  if (!customer) {
    return NextResponse.json({ error: 'Customer sign-in is required.' }, { status: 401 });
  }
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check your review and try again.' }, { status: 400 });
  }

  const { id } = await context.params;
  try {
    const order = await prisma.order.findFirst({
      where: { id, userId: customer.id },
      select: {
        id: true,
        type: true,
        status: true,
        deliveryConfirmedAt: true,
        review: { select: { id: true } },
      },
    });
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    if (
      order.status !== 'COMPLETED' ||
      (order.type === 'DELIVERY' && order.deliveryConfirmedAt === null)
    ) {
      return NextResponse.json(
        { error: 'A review is available after your order is completed.' },
        { status: 409 }
      );
    }
    if (order.review) {
      return NextResponse.json(
        { error: 'A review has already been submitted for this order.' },
        { status: 409 }
      );
    }
    const review = await prisma.review.create({
      data: {
        ...parsed.data,
        customerName: customer.name,
        orderId: order.id,
        status: 'PENDING',
      },
      select: { id: true, status: true },
    });
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A review has already been submitted for this order.' },
        { status: 409 }
      );
    }
    console.error('Customer order review submission failed:', error);
    return NextResponse.json({ error: 'Unable to save your review right now.' }, { status: 503 });
  }
}
