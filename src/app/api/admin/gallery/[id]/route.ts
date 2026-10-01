import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const galleryUpdateSchema = z.object({
  title: z.string().trim().min(2).max(120).optional(),
  imageUrl: z
    .string()
    .trim()
    .min(1)
    .max(2048)
    .refine((value) => value.startsWith('/') || /^https:\/\//i.test(value))
    .optional(),
  altText: z.string().trim().min(2).max(255).optional(),
  category: z.string().trim().min(2).max(60).optional(),
  visible: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(10000).optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const parsed = galleryUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || Object.keys(parsed.data ?? {}).length === 0) {
    return NextResponse.json({ error: 'Provide valid gallery fields to update.' }, { status: 400 });
  }

  const { id } = await context.params;
  try {
    const image = await prisma.galleryImage.update({
      where: { id },
      data: parsed.data,
      select: { id: true, title: true, visible: true, sortOrder: true },
    });
    return NextResponse.json({ image });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Gallery image not found.' }, { status: 404 });
    }
    console.error('Admin gallery image update failed:', error);
    return NextResponse.json({ error: 'Unable to update this gallery image.' }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const { id } = await context.params;
  try {
    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Gallery image not found.' }, { status: 404 });
    }
    console.error('Admin gallery image deletion failed:', error);
    return NextResponse.json({ error: 'Unable to delete this gallery image.' }, { status: 503 });
  }
}
