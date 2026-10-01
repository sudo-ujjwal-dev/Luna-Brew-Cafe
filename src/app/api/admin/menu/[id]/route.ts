import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  description: z.string().trim().min(5).max(5000).optional(),
  price: z.coerce.number().finite().positive().max(1000000).optional(),
  categoryId: z.string().min(1).max(30).optional(),
  image: z.string().trim().max(2048).refine((value) => !value || value.startsWith('/') || /^https:\/\//i.test(value)).optional(),
  imageAlt: z.string().trim().max(255).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  vegetarian: z.boolean().optional(),
  vegan: z.boolean().optional(),
  spicy: z.boolean().optional(),
  allergens: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
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

async function readBody(request: Request) {
  try {
    return { body: (await request.json()) as unknown };
  } catch {
    return { error: NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 }) };
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const { id } = await context.params;
  const parsedBody = await readBody(request);
  if (parsedBody.error) return parsedBody.error;
  const parsed = updateSchema.safeParse(parsedBody.body);
  if (!parsed.success || Object.keys(parsed.data ?? {}).length === 0) {
    return NextResponse.json({ error: 'Provide valid menu item fields to update.' }, { status: 400 });
  }

  try {
    const data = parsed.data;
    if (data.vegan && data.vegetarian === false) {
      return NextResponse.json({ error: 'Vegan menu items must also be marked vegetarian.' }, { status: 400 });
    }
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
        select: { active: true },
      });
      if (!category?.active) {
        return NextResponse.json({ error: 'Choose an active menu category.' }, { status: 400 });
      }
    }

    const update = {
      ...data,
      ...(data.name ? { slug: createSlug(data.name) } : {}),
      ...(data.image !== undefined ? { image: data.image || null } : {}),
      ...(data.imageAlt !== undefined || data.name
        ? { imageAlt: data.imageAlt || data.name }
        : {}),
      ...(data.price !== undefined ? { price: data.price.toFixed(2) } : {}),
    };
    const item = await prisma.menuItem.update({
      where: { id },
      data: update,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        available: true,
        featured: true,
        categoryId: true,
      },
    });
    return NextResponse.json({ item: { ...item, price: item.price.toNumber() } });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
    }
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'A menu item with that name already exists.' }, { status: 409 });
    }
    console.error('Admin menu item update failed:', error);
    return NextResponse.json({ error: 'Unable to update this menu item.' }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const authorizationError = await adminAuthorizationError(request, true);
  if (authorizationError) return authorizationError;

  const { id } = await context.params;
  try {
    const item = await prisma.menuItem.update({
      where: { id },
      data: { available: false, featured: false },
      select: { id: true, name: true, available: true },
    });
    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
    }
    console.error('Admin menu item deactivation failed:', error);
    return NextResponse.json({ error: 'Unable to deactivate this menu item.' }, { status: 503 });
  }
}
