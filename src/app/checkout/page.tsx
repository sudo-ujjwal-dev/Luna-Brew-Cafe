import type { Metadata } from 'next';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout — Luna Brew Café',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl">
          <p className="section-label">Luna Brew Café</p>
          <h1 className="mt-2 text-display font-800 text-foreground">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Orders are stored only after the server confirms them. Payment is collected at the café or on delivery.
          </p>
          <CheckoutClient />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
