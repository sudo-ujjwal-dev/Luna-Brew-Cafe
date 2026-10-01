import { NextResponse } from 'next/server';
import { adminSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const response = NextResponse.redirect(new URL('/admin/login', request.url), 303);
  response.cookies.set(adminSessionCookie.name, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
