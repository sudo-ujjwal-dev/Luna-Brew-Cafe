import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const gallerySchema = z.object({
  title: z.string().trim().min(2).max(120),
  imageUrl: z.string().trim().min(1).max(2048).refine((value) => value.startsWith('/') || /^https:\/\//i.test(value)),
  altText: z.string().trim().min(2).max(255),
  category: z.string().trim().min(2).max(60),
  visible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(10000).default(0),
});

export async function GET(request: Request) {
  const authorizationError = await adminAuthorizationError(request);
  if (authorizationError) return authorizationError;

  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Admin gallery query failed:', error);
    return NextResponse.json({ error: 'Gallery management data is unavailable.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const parsed = gallerySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the image title, URL, alt text, and category.' }, { status: 400 });
  }
  try {
    const image = await prisma.galleryImage.create({ data: parsed.data });
    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error('Admin gallery image creation failed:', error);
    return NextResponse.json({ error: 'Unable to add this gallery image.' }, { status: 503 });
  }
}
