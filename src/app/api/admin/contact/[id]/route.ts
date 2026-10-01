import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const statusSchema = z.object({ status: z.enum(['UNREAD', 'READ', 'RESOLVED']) });

export async function PATCH(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose a valid message status.' }, { status: 400 });
  }
  const { id } = await context.params;
  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, status: true, updatedAt: true },
    });
    return NextResponse.json({ message });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Contact message not found.' }, { status: 404 });
    }
    console.error('Admin contact message update failed:', error);
    return NextResponse.json({ error: 'Unable to update this message.' }, { status: 503 });
  }
}
