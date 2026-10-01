import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const imageSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => !value || value.startsWith('/') || /^https:\/\//i.test(value));

const menuItemSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(5000),
  price: z.coerce.number().finite().positive().max(1000000),
  categoryId: z.string().min(1).max(30),
  image: imageSchema.optional().default(''),
  imageAlt: z.string().trim().max(255).optional().default(''),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  vegetarian: z.boolean().default(false),
  vegan: z.boolean().default(false),
  spicy: z.boolean().default(false),
  allergens: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
  preparationTime: z.coerce.number().int().min(1).max(600).nullable().optional(),
});

function createSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET(request: Request) {
  const authorizationError = await adminAuthorizationError(request);
  if (authorizationError) return authorizationError;

  try {
    const [categories, items] = await Promise.all([
      prisma.category.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: { id: true, name: true, active: true, sortOrder: true },
      }),
      prisma.menuItem.findMany({
        include: { category: { select: { id: true, name: true } } },
        orderBy: [{ category: { sortOrder: 'asc' } }, { name: 'asc' }],
      }),
    ]);
    return NextResponse.json({
      categories,
      items: items.map((item) => ({ ...item, price: item.price.toNumber() })),
    });
  } catch (error) {
    console.error('Admin menu query failed:', error);
    return NextResponse.json({ error: 'Menu management data is unavailable.' }, { status: 503 });
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
  const parsed = menuItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the menu item fields and try again.' }, { status: 400 });
  }

  const data = parsed.data;
  if (data.vegan && !data.vegetarian) {
    return NextResponse.json({ error: 'Vegan menu items must also be marked vegetarian.' }, { status: 400 });
  }
  const slug = createSlug(data.name);
  if (!slug) return NextResponse.json({ error: 'Item name must include letters or numbers.' }, { status: 400 });

  try {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
      select: { id: true, active: true },
    });
    if (!category?.active) {
      return NextResponse.json({ error: 'Choose an active menu category.' }, { status: 400 });
    }

    const item = await prisma.menuItem.create({
      data: {
        ...data,
        slug,
        image: data.image || null,
        imageAlt: data.imageAlt || data.name,
        price: data.price.toFixed(2),
      },
      select: { id: true, name: true, slug: true, price: true, available: true },
    });
    return NextResponse.json({ item: { ...item, price: item.price.toNumber() } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'A menu item with that name already exists.' }, { status: 409 });
    }
    console.error('Admin menu item creation failed:', error);
    return NextResponse.json({ error: 'Unable to create this menu item.' }, { status: 503 });
  }
}
