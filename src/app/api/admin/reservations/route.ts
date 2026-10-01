import { NextResponse } from 'next/server';
import { adminAuthorizationError } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authorizationError = await adminAuthorizationError(request);
  if (authorizationError) return authorizationError;

  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      take: 100,
    });
    return NextResponse.json({
      reservations: reservations.map((reservation) => ({
        ...reservation,
        date: reservation.date.toISOString().slice(0, 10),
      })),
    });
  } catch (error) {
    console.error('Admin reservation query failed:', error);
    return NextResponse.json(
      { error: 'Reservations are temporarily unavailable.' },
      { status: 503 }
    );
  }
}
