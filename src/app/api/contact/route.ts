import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactMessageSchema, formatValidationError } from '@/lib/validation';
import { getCustomerSession } from '@/lib/customer-auth';
import { sendContactNotification } from '@/lib/contact-email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Check the message details and try again.',
        issues: formatValidationError(parsed.error),
      },
      { status: 400 }
    );
  }

  try {
    const customer = await getCustomerSession();
    const message = await prisma.contactMessage.create({
      data: {
        ...parsed.data,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone || null,
        userId: customer?.id,
      },
      select: { id: true, createdAt: true },
    });
    const delivery = await sendContactNotification(parsed.data);
    return NextResponse.json(
      {
        received: true,
        messageId: message.id,
        emailSent: delivery.sent,
        ...(delivery.sent ? {} : { emailStatus: delivery.reason }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact message persistence failed:', error);
    return NextResponse.json({ error: 'Unable to save your message right now.' }, { status: 503 });
  }
}
