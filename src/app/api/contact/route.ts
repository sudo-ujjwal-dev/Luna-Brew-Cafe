import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactMessageSchema, formatValidationError } from '@/lib/validation';

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
      { error: 'Check the message details and try again.', issues: formatValidationError(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const message = await prisma.contactMessage.create({
      data: {
        ...parsed.data,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone || null,
      },
      select: { id: true, createdAt: true },
    });
    return NextResponse.json({ received: true, messageId: message.id }, { status: 201 });
  } catch (error) {
    console.error('Contact message persistence failed:', error);
    return NextResponse.json({ error: 'Unable to save your message right now.' }, { status: 503 });
  }
}
