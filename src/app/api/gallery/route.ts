import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, title: true, imageUrl: true, altText: true, category: true },
    });
    return NextResponse.json({
      images: images.map((image) => ({
        id: image.id,
        title: image.title,
        src: image.imageUrl,
        alt: image.altText,
        category: image.category,
      })),
    });
  } catch (error) {
    console.error('Public gallery query failed:', error);
    return NextResponse.json(
      { error: 'Gallery images are temporarily unavailable.' },
      { status: 503 }
    );
  }
}
