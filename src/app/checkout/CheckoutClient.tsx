'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartProducts } from '@/lib/use-cart-products';
import { clearCart } from '@/lib/cart';

type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-NP')}`;

export default function CheckoutClient() {
  const router = useRouter();
  const { products, unavailableIds, loading, error } = useCartProducts();
  const [orderType, setOrderType] = useState<OrderType>('TAKEAWAY');
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const subtotal = products.reduce((sum, line) => sum + line.item.price * line.quantity, 0);

  useEffect(() => {
    if (orderType !== 'DELIVERY') return;
    const controller = new AbortController();
    fetch('/api/settings/public', { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as { deliveryFee?: number; error?: string };
        if (!response.ok || typeof body.deliveryFee !== 'number') {
          throw new Error(body.error || 'Delivery charges are temporarily unavailable.');
        }
        setDeliveryFee(body.deliveryFee);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setFormError(
            requestError instanceof Error
              ? requestError.message
              : 'Delivery charges are temporarily unavailable.'
          );
        }
      });
    return () => controller.abort();
  }, [orderType]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const paymentMethod =
      orderType === 'DELIVERY' && form.get('paymentMethod') === 'CASH_ON_DELIVERY'
        ? 'CASH_ON_DELIVERY'
        : 'PAY_AT_CAFE';

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.get('customerName'),
          phone: form.get('phone'),
          email: form.get('email'),
          type: orderType,
          paymentMethod,
          deliveryAddress: form.get('deliveryAddress'),
          notes: form.get('notes'),
          items: products.map(({ menuItemId, quantity }) => ({ menuItemId, quantity })),
        }),
      });
      const result = (await response.json()) as {
        order?: { orderNumber: string; total: number; status: string };
        error?: string;
      };
      if (!response.ok || !result.order) {
        throw new Error(result.error || 'Unable to place the order.');
      }
      clearCart();
      const query = new URLSearchParams({
        orderNumber: result.order.orderNumber,
      });
      router.push(`/order-confirmation?${query.toString()}`);
    } catch (requestError) {
      setFormError(
        requestError instanceof Error ? requestError.message : 'Unable to place the order.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p role="status" className="py-16 text-center text-muted-foreground">Loading checkout…</p>;
  }
  if (error) {
    return <p role="alert" className="mt-8 rounded-xl bg-danger-bg p-4 text-sm text-danger">{error}</p>;
  }
  if (products.length === 0 || unavailableIds.length > 0) {
    return (
      <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-foreground">
          {unavailableIds.length ? 'Your cart has unavailable items.' : 'Your cart is empty.'}
        </p>
        <Link href="/cart" className="mt-4 inline-flex text-sm font-600 text-primary hover:underline">
          Return to cart
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-7">
        <fieldset className="space-y-3">
          <legend className="font-700 text-foreground">How would you like your order?</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {([
              ['DINE_IN', 'Dine-in'],
              ['TAKEAWAY', 'Takeaway'],
              ['DELIVERY', 'Delivery'],
            ] as const).map(([value, label]) => (
              <label key={value} className={`cursor-pointer rounded-xl border p-3 text-sm ${orderType === value ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground'}`}>
                <input
                  type="radio"
                  name="orderType"
                  value={value}
                  checked={orderType === value}
                  onChange={() => setOrderType(value)}
                  className="mr-2 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="checkout-name" className="mb-1.5 block text-sm font-600 text-foreground">Full name *</label>
            <input id="checkout-name" name="customerName" required maxLength={120} autoComplete="name" className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="checkout-phone" className="mb-1.5 block text-sm font-600 text-foreground">Phone *</label>
            <input id="checkout-phone" name="phone" required maxLength={25} type="tel" autoComplete="tel" placeholder="+977 98X XXX XXXX" className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="checkout-email" className="mb-1.5 block text-sm font-600 text-foreground">Email (optional)</label>
            <input id="checkout-email" name="email" maxLength={254} type="email" autoComplete="email" className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm" />
          </div>
          {orderType === 'DELIVERY' && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="delivery-address" className="mb-1.5 block text-sm font-600 text-foreground">Delivery address *</label>
                <textarea id="delivery-address" name="deliveryAddress" required minLength={5} maxLength={1000} rows={3} autoComplete="street-address" className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="payment-method" className="mb-1.5 block text-sm font-600 text-foreground">Payment</label>
                <select id="payment-method" name="paymentMethod" className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm">
                  <option value="CASH_ON_DELIVERY">Cash on delivery</option>
                  <option value="PAY_AT_CAFE">Pay at café</option>
                </select>
              </div>
            </>
          )}
          <div className="sm:col-span-2">
            <label htmlFor="order-notes" className="mb-1.5 block text-sm font-600 text-foreground">Notes (optional)</label>
            <textarea id="order-notes" name="notes" maxLength={2000} rows={2} className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm" />
          </div>
        </div>

        {formError && <p role="alert" className="text-sm text-danger">{formError}</p>}
        <button
          type="submit"
          disabled={submitting || (orderType === 'DELIVERY' && deliveryFee === null)}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-700 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
      </form>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5">
        <h2 className="font-700 text-foreground">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {products.map(({ item, quantity }) => (
            <li key={item.id} className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{quantity} × {item.name}</span>
              <span className="shrink-0 text-foreground">{formatPrice(item.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-600 text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery fee</span>
          <span className="text-foreground">
            {orderType !== 'DELIVERY' ? formatPrice(0) : deliveryFee === null ? 'Loading…' : formatPrice(deliveryFee)}
          </span>
        </div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 font-700">
          <span className="text-foreground">Total</span>
          <span className="text-primary">
            {formatPrice(subtotal + (orderType === 'DELIVERY' ? deliveryFee ?? 0 : 0))}
          </span>
        </div>
      </aside>
    </div>
  );
}
