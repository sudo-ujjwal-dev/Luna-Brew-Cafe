import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createCustomerSessionToken,
  customerAuthConfigurationReady,
  customerSessionCookie,
  verifyCustomerPassword,
} from '@/lib/customer-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }
  if (!customerAuthConfigurationReady()) {
    return NextResponse.json({ error: 'Customer sign-in is not configured.' }, { status: 503 });
  }
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Enter a valid email address and password.' },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
      select: { id: true, role: true, passwordHash: true },
    });
    const passwordMatches = user
      ? await verifyCustomerPassword(parsed.data.password, user.passwordHash)
      : false;
    if (!user || user.role !== 'CUSTOMER' || !passwordMatches) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(customerSessionCookie.name, createCustomerSessionToken(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: customerSessionCookie.maxAge,
    });
    return response;
  } catch (error) {
    console.error('Customer sign-in failed:', error);
    return NextResponse.json({ error: 'Unable to sign in right now.' }, { status: 503 });
  }
}
