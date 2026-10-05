import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const customer = await getCustomerSession();
    if (!customer) {
      return NextResponse.json({ error: 'Customer sign-in is required.' }, { status: 401 });
    }
    const [orders, reservations] = await Promise.all([
      prisma.order.findMany({
        where: { userId: customer.id },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          orderNumber: true,
          type: true,
          status: true,
          total: true,
          createdAt: true,
          items: {
            select: { itemName: true, quantity: true, unitPrice: true, lineTotal: true },
          },
        },
      }),
      prisma.reservation.findMany({
        where: { userId: customer.id },
        orderBy: [{ date: 'desc' }, { time: 'desc' }],
        take: 100,
        select: { id: true, date: true, time: true, guestCount: true, status: true },
      }),
    ]);

    return NextResponse.json({
      orders: orders.map((order) => ({
        ...order,
        total: order.total.toNumber(),
        items: order.items.map((item) => ({
          ...item,
          unitPrice: item.unitPrice.toNumber(),
          lineTotal: item.lineTotal.toNumber(),
        })),
      })),
      reservations: reservations.map((reservation) => ({
        ...reservation,
        date: reservation.date.toISOString().slice(0, 10),
      })),
    });
  } catch (error) {
    console.error('Customer order and reservation history query failed:', error);
    return NextResponse.json(
      { error: 'Account history is temporarily unavailable.' },
      { status: 503 }
    );
  }
}
