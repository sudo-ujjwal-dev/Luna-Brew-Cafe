import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatValidationError, reviewSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: 'APPROVED' },
      select: { id: true, customerName: true, rating: true, comment: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
    const aggregate = await prisma.review.aggregate({
      where: { status: 'APPROVED' },
      _avg: { rating: true },
      _count: { _all: true },
    });

    return NextResponse.json({
      reviews,
      averageRating: aggregate._avg.rating,
      total: aggregate._count._all,
    });
  } catch (error) {
    console.error('Approved reviews query failed:', error);
    return NextResponse.json({ error: 'Reviews are temporarily unavailable.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Check your review and try again.', issues: formatValidationError(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.review.create({
      data: { ...parsed.data, status: 'PENDING' },
      select: { id: true, status: true },
    });
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Review persistence failed:', error);
    return NextResponse.json({ error: 'Unable to save your review right now.' }, { status: 503 });
  }
}
