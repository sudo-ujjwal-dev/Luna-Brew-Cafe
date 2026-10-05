import 'server-only';

import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const customerCookieName = 'luna-customer-session';
const sessionLifetimeSeconds = 60 * 60 * 24 * 30;
const scryptParameters = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const keyLength = 64;
const derivePasswordKey = (password: string, salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, scryptParameters, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });

export interface CustomerSession {
  id: string;
  name: string;
  email: string;
}

export async function hashCustomerPassword(password: string) {
  const salt = randomBytes(16);
  const derived = await derivePasswordKey(password, salt);
  return `scrypt$${scryptParameters.N}$${scryptParameters.r}$${scryptParameters.p}$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export async function verifyCustomerPassword(password: string, encoded: string) {
  const [algorithm, nValue, rValue, pValue, saltValue, hashValue, ...extra] = encoded.split('$');
  if (
    algorithm !== 'scrypt' ||
    nValue !== String(scryptParameters.N) ||
    rValue !== String(scryptParameters.r) ||
    pValue !== String(scryptParameters.p) ||
    !saltValue ||
    !hashValue ||
    extra.length > 0 ||
    !/^[a-f0-9]{32}$/.test(saltValue) ||
    !/^[a-f0-9]{128}$/.test(hashValue)
  ) {
    return false;
  }

  const salt = Buffer.from(saltValue, 'hex');
  const expected = Buffer.from(hashValue, 'hex');
  const actual = await derivePasswordKey(password, salt);
  return timingSafeEqual(actual, expected);
}

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must contain at least 32 characters.');
  }
  return secret;
}

export function customerAuthConfigurationReady() {
  try {
    getSessionSecret();
    return true;
  } catch {
    return false;
  }
}

export function createCustomerSessionToken(userId: string) {
  const payload = Buffer.from(
    JSON.stringify({ userId, expiresAt: Date.now() + sessionLifetimeSeconds * 1000 })
  ).toString('base64url');
  const signature = createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  let secret: string;
  try {
    secret = getSessionSecret();
  } catch {
    return null;
  }

  const token = (await cookies()).get(customerCookieName)?.value;
  if (!token) return null;
  const [payload, signature, ...extra] = token.split('.');
  if (!payload || !signature || extra.length > 0 || !/^[a-f0-9]{64}$/.test(signature)) {
    return null;
  }

  const expected = createHmac('sha256', secret).update(payload).digest();
  const provided = Buffer.from(signature, 'hex');
  if (!timingSafeEqual(expected, provided)) return null;

  let userId: string;
  let expiresAt: number;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      userId?: unknown;
      expiresAt?: unknown;
    };
    if (
      typeof session.userId !== 'string' ||
      typeof session.expiresAt !== 'number' ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }
    userId = session.userId;
    expiresAt = session.expiresAt;
  } catch {
    return null;
  }

  if (expiresAt <= Date.now()) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId, role: 'CUSTOMER' },
    select: { id: true, name: true, email: true },
  });
  if (!user?.name) return null;
  return { ...user, name: user.name };
}

export async function customerAuthorizationError(request: Request, requireSameOrigin = false) {
  if (requireSameOrigin && request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }
  const customer = await getCustomerSession();
  if (!customer) {
    return NextResponse.json({ error: 'Customer sign-in is required.' }, { status: 401 });
  }
  return null;
}

export const customerSessionCookie = {
  name: customerCookieName,
  maxAge: sessionLifetimeSeconds,
};
