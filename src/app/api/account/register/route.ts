import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createCustomerSessionToken,
  customerAuthConfigurationReady,
  hashCustomerPassword,
  customerSessionCookie,
} from '@/lib/customer-auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
});

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }
  if (!customerAuthConfigurationReady()) {
    return NextResponse.json({ error: 'Customer sign-in is not configured.' }, { status: 503 });
  }
  const parsed = registrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Enter your name, a valid email address, and a password of at least 12 characters.',
      },
      { status: 400 }
    );
  }

  try {
    const email = parsed.data.email.toLowerCase();
    const passwordHash = await hashCustomerPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
        role: 'CUSTOMER',
      },
      select: { id: true },
    });
    const response = NextResponse.json({ created: true }, { status: 201 });
    response.cookies.set(customerSessionCookie.name, createCustomerSessionToken(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: customerSessionCookie.maxAge,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An account with this email already exists. Sign in or use another email.' },
        { status: 409 }
      );
    }
    console.error('Customer account registration failed:', error);
    return NextResponse.json(
      { error: 'Unable to create your account right now.' },
      { status: 503 }
    );
  }
}
