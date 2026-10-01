import { NextResponse } from 'next/server';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }
  if (
    !body ||
    typeof body !== 'object' ||
    !('active' in body) ||
    typeof body.active !== 'boolean'
  ) {
    return NextResponse.json({ error: 'Provide an active boolean value.' }, { status: 400 });
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { active: body.active },
      select: { id: true, name: true, active: true },
    });
    return NextResponse.json({ category });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }
    console.error('Admin category update failed:', error);
    return NextResponse.json({ error: 'Unable to update this category.' }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const { id } = await context.params;
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { active: false },
      select: { id: true, name: true, active: true },
    });
    return NextResponse.json({ category });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }
    console.error('Admin category deactivation failed:', error);
    return NextResponse.json({ error: 'Unable to deactivate this category.' }, { status: 503 });
  }
}
