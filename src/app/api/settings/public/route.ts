import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: 'default' },
      select: { deliveryFee: true },
    });
    return NextResponse.json({ deliveryFee: settings?.deliveryFee.toNumber() ?? 0 });
  } catch (error) {
    console.error('Public business settings query failed:', error);
    return NextResponse.json({ error: 'Business settings are unavailable.' }, { status: 503 });
  }
}
