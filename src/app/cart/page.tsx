import type { Metadata } from 'next';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Your cart — Luna Brew Café',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl">
          <Link href="/menu" className="text-sm font-600 text-primary hover:underline">
            ← Back to menu
          </Link>
          <h1 className="mt-4 text-display font-800 text-foreground">Your cart</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This is a fictional café demo. The cart is stored in this browser until you place an order.
          </p>
          <CartClient />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
