import { NextResponse } from 'next/server';
import { hasAdminSession } from './admin-auth';

export async function adminAuthorizationError(request: Request, requireSameOrigin = false) {
  if (
    requireSameOrigin &&
    request.headers.get('origin') !== new URL(request.url).origin
  ) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Administrator sign-in is required.' }, { status: 401 });
  }

  return null;
}
