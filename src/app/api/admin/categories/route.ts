import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  sortOrder: z.coerce.number().int().min(0).max(1000).default(0),
});

export async function GET(request: Request) {
  const authorizationError = await adminAuthorizationError(request);
  if (authorizationError) return authorizationError;

  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { items: true } } },
    });
    return NextResponse.json({
      categories: categories.map(({ _count, ...category }) => ({
        ...category,
        itemCount: _count.items,
      })),
    });
  } catch (error) {
    console.error('Admin category query failed:', error);
    return NextResponse.json({ error: 'Categories are temporarily unavailable.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Enter a valid category name and sort order.' },
      { status: 400 }
    );
  }

  const slug = parsed.data.name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (!slug)
    return NextResponse.json(
      { error: 'Category name must contain letters or numbers.' },
      { status: 400 }
    );

  try {
    const category = await prisma.category.create({ data: { ...parsed.data, slug } });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'That category name already exists.' }, { status: 409 });
    }
    console.error('Admin category creation failed:', error);
    return NextResponse.json({ error: 'Unable to create this category.' }, { status: 503 });
  }
}
