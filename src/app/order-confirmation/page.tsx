import type { Metadata } from 'next';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Order received — Luna Brew Café',
  robots: { index: false, follow: false },
};

interface OrderConfirmationProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationProps) {
  const params = await searchParams;
  const orderNumber = params.orderNumber?.match(/^LB-\d{8}-[A-F0-9]{16}$/)?.[0];
  let order: { orderNumber: string; status: string; total: number } | null = null;
  let lookupFailed = false;

  if (orderNumber) {
    try {
      const savedOrder = await prisma.order.findUnique({
        where: { orderNumber },
        select: { orderNumber: true, status: true, total: true },
      });
      order = savedOrder ? { ...savedOrder, total: savedOrder.total.toNumber() } : null;
    } catch (error) {
      console.error('Order confirmation lookup failed:', error);
      lookupFailed = true;
    }
  }

  return (
    <>
      <PublicNav />
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-32">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center">
          <p className="section-label">Luna Brew Café</p>
          <h1 className="mt-2 text-display font-800 text-foreground">
            {order ? 'Order received' : 'Order details unavailable'}
          </h1>
          {order ? (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                Your order is saved. Sign in to your account to follow its progress and confirm delivery.
              </p>
              <dl className="mt-6 space-y-3 rounded-xl bg-secondary/50 p-4 text-left text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Order number</dt>
                  <dd className="font-700 text-foreground">{order.orderNumber}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-600 text-foreground">
                    {{
                      PENDING: 'Order received',
                      CONFIRMED: 'Confirmed',
                      PREPARING: 'Being prepared',
                      READY: 'Ready',
                      OUT_FOR_DELIVERY: 'Out for delivery',
                      DELIVERY_ISSUE: 'Delivery issue',
                      COMPLETED: 'Completed',
                      CANCELLED: 'Cancelled',
                    }[order.status] ?? order.status.toLowerCase().replaceAll('_', ' ')}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-700 text-primary">
                    {`Rs. ${order.total.toLocaleString('en-NP')}`}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              {lookupFailed
                ? 'Order details are temporarily unavailable. Your order may still have been saved; please try this page again.'
                : 'No matching saved order was found for this confirmation.'}
            </p>
          )}
          <Link
            href="/menu"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-600 text-primary-foreground"
          >
            Back to menu
          </Link>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
