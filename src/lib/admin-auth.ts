import 'server-only';

import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const cookieName = 'luna-admin-session';
const sessionLifetimeSeconds = 60 * 60 * 8;

function getAuthConfig() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!email || !password || !secret || secret.length < 32) return null;
  return { email, password, secret };
}

function safeEqual(left: string, right: string) {
  const leftHash = createHash('sha256').update(left).digest();
  const rightHash = createHash('sha256').update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function isAdminConfigurationReady() {
  return getAuthConfig() !== null;
}

export function validateAdminCredentials(email: string, password: string) {
  const config = getAuthConfig();
  if (!config) return false;
  return (
    safeEqual(email.trim().toLowerCase(), config.email) && safeEqual(password, config.password)
  );
}

export function createAdminSessionToken(email: string) {
  const config = getAuthConfig();
  if (!config) throw new Error('Admin authentication is not configured.');

  const payload = Buffer.from(
    JSON.stringify({
      email: email.trim().toLowerCase(),
      expiresAt: Date.now() + sessionLifetimeSeconds * 1000,
    })
  ).toString('base64url');
  const signature = createHmac('sha256', config.secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export async function hasAdminSession() {
  const config = getAuthConfig();
  if (!config) return false;

  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;

  const [payload, signature, ...extra] = token.split('.');
  if (!payload || !signature || extra.length > 0) return false;

  const expected = createHmac('sha256', config.secret).update(payload).digest();
  let provided: Buffer;
  try {
    provided = Buffer.from(signature, 'hex');
  } catch {
    return false;
  }
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      email?: unknown;
      expiresAt?: unknown;
    };
    return (
      session.email === config.email &&
      typeof session.expiresAt === 'number' &&
      session.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}

export const adminSessionCookie = {
  name: cookieName,
  maxAge: sessionLifetimeSeconds,
};
