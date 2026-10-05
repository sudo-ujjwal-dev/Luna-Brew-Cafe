import type { Metadata } from 'next';
import Link from 'next/link';
import AccountAuthForm from '../AccountAuthForm';

export const metadata: Metadata = {
  title: 'Customer sign in — Luna Brew Café',
  robots: { index: false, follow: false },
};

export default function CustomerLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <Link href="/" className="section-label mb-2 inline-block">
          Luna Brew Café
        </Link>
        <h1 className="text-2xl font-700 text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to view your orders and table reservations.
        </p>
        <AccountAuthForm mode="login" />
      </div>
    </main>
  );
}
