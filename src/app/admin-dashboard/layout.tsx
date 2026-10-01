import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { hasAdminSession } from '@/lib/admin-auth';

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  if (!(await hasAdminSession())) redirect('/admin/login');
  return children;
}
