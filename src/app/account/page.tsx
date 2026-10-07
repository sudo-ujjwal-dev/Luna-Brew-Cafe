import type { Metadata } from 'next';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import AccountClient from './AccountClient';

export const metadata: Metadata = {
  title: 'Your account — Luna Brew Café',
  robots: { index: false, follow: false },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <PublicNav />
      <main className="min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="text-sm font-600 text-primary hover:underline">
            ← Home
          </Link>
          <h1 className="mt-4 text-display font-800 text-foreground">My Account</h1>
          <p className="mb-8 mt-2 text-sm text-muted-foreground">
            Manage your profile, orders and reservations.
          </p>
          <AccountClient welcome={params.welcome === '1'} />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
