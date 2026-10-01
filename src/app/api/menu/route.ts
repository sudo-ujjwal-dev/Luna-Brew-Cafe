import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const query = url.searchParams.get('q')?.trim();
  const featuredOnly = url.searchParams.get('featured') === 'true';

  try {
    const [categories, items] = await Promise.all([
      prisma.category.findMany({
        where: { active: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: { id: true, name: true, slug: true },
      }),
      prisma.menuItem.findMany({
        where: {
          category: { active: true },
          ...(category && category !== 'all' ? { category: { slug: category, active: true } } : {}),
          ...(query ? { OR: [{ name: { contains: query } }, { description: { contains: query } }] } : {}),
          ...(featuredOnly ? { featured: true } : {}),
        },
        include: { category: { select: { name: true, slug: true } } },
        orderBy: [{ featured: 'desc' }, { name: 'asc' }],
      }),
    ]);

    return NextResponse.json({
      categories,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price.toNumber(),
        category: item.category.name,
        categorySlug: item.category.slug,
        image: item.image || '/assets/images/no_image.svg',
        imageAlt: item.imageAlt || item.name,
        available: item.available,
        featured: item.featured,
        tags: [
          ...(item.vegan ? ['vegan'] : []),
          ...(item.vegetarian && !item.vegan ? ['vegetarian'] : []),
          ...(item.spicy ? ['spicy'] : []),
        ],
        allergens: Array.isArray(item.allergens) ? item.allergens : [],
        preparationTime: item.preparationTime,
      })),
    });
  } catch (error) {
    console.error('Public menu query failed:', error);
    return NextResponse.json({ error: 'Menu data is temporarily unavailable.' }, { status: 503 });
  }
}
