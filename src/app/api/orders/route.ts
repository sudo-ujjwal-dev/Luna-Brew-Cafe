import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { formatValidationError, orderSchema } from '@/lib/validation';
import { getCustomerSession } from '@/lib/customer-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Check your order details and try again.',
        issues: formatValidationError(parsed.error),
      },
      { status: 400 }
    );
  }

  try {
    const submitted = parsed.data;
    const customer = await getCustomerSession();
    if (submitted.type === 'DELIVERY' && !customer) {
      return NextResponse.json(
        { error: 'Sign in to your customer account before placing a delivery order.' },
        { status: 401 }
      );
    }
    const requestedIds = submitted.items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: requestedIds }, available: true, category: { active: true } },
      select: { id: true, name: true, price: true },
    });

    if (menuItems.length !== requestedIds.length) {
      return NextResponse.json(
        { error: 'One or more selected items are unavailable. Refresh the menu and try again.' },
        { status: 409 }
      );
    }

    const itemsById = new Map(menuItems.map((item) => [item.id, item]));
    const orderLines = submitted.items.flatMap((selected) => {
      const menuItem = itemsById.get(selected.menuItemId);
      return menuItem ? [{ selected, menuItem }] : [];
    });
    if (orderLines.length !== submitted.items.length) {
      return NextResponse.json(
        { error: 'One or more selected items are unavailable. Refresh the menu and try again.' },
        { status: 409 }
      );
    }
    const subtotal = orderLines.reduce(
      (total, { selected, menuItem }) => total.plus(menuItem.price.mul(selected.quantity)),
      new Prisma.Decimal(0)
    );
    const settings =
      submitted.type === 'DELIVERY'
        ? await prisma.businessSettings.findUnique({
            where: { id: 'default' },
            select: { deliveryFee: true },
          })
        : null;
    const deliveryFee = settings?.deliveryFee ?? new Prisma.Decimal(0);
    const total = subtotal.plus(deliveryFee);
    const dateCode = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    const orderNumber = `LB-${dateCode}-${randomBytes(8).toString('hex').toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: submitted.customerName,
        phone: submitted.phone,
        email: submitted.email ? submitted.email.toLowerCase() : null,
        ...(customer
          ? {
              userId: customer.id,
              customerName: customer.name,
              email: customer.email,
            }
          : {}),
        type: submitted.type,
        paymentMethod: submitted.paymentMethod,
        deliveryAddress: submitted.type === 'DELIVERY' ? submitted.deliveryAddress : null,
        notes: submitted.notes || null,
        subtotal,
        deliveryFee,
        total,
        items: {
          create: orderLines.map(({ selected, menuItem }) => {
            const lineTotal = menuItem.price.mul(selected.quantity);
            return {
              menuItemId: menuItem.id,
              itemName: menuItem.name,
              unitPrice: menuItem.price,
              quantity: selected.quantity,
              lineTotal,
            };
          }),
        },
      },
      select: { id: true, orderNumber: true, status: true, total: true, createdAt: true },
    });

    return NextResponse.json(
      {
        order: {
          ...order,
          total: order.total.toNumber(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order persistence failed:', error);
    return NextResponse.json({ error: 'Unable to place the order right now.' }, { status: 503 });
  }
}
