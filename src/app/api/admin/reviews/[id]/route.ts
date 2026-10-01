import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const statusSchema = z.object({ status: z.enum(['APPROVED', 'REJECTED']) });

export async function PATCH(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose approve or reject.' }, { status: 400 });
  }
  const { id } = await context.params;
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, status: true, updatedAt: true },
    });
    return NextResponse.json({ review });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Review not found.' }, { status: 404 });
    }
    console.error('Admin review moderation failed:', error);
    return NextResponse.json({ error: 'Unable to update this review.' }, { status: 503 });
  }
}
