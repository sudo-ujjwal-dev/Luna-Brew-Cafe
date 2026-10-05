import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/customer-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ customer: await getCustomerSession() });
  } catch (error) {
    console.error('Customer session lookup failed:', error);
    return NextResponse.json(
      { error: 'Account session is temporarily unavailable.' },
      { status: 503 }
    );
  }
}
