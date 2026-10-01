import { NextResponse } from 'next/server';
import {
  adminSessionCookie,
  createAdminSessionToken,
  isAdminConfigurationReady,
  validateAdminCredentials,
} from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  if (!isAdminConfigurationReady()) {
    return NextResponse.json(
      {
        error:
          'Admin sign-in is unavailable until ADMIN_EMAIL, ADMIN_PASSWORD, and a 32-character AUTH_SECRET are configured.',
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== 'object' ||
    !('email' in body) ||
    !('password' in body) ||
    typeof body.email !== 'string' ||
    typeof body.password !== 'string' ||
    body.email.length > 254 ||
    body.password.length > 1024
  ) {
    return NextResponse.json(
      { error: 'Enter a valid email address and password.' },
      { status: 400 }
    );
  }

  if (!validateAdminCredentials(body.email, body.password)) {
    return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie.name, createAdminSessionToken(body.email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: adminSessionCookie.maxAge,
  });
  return response;
}
