'use client';

import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { updateCartItem } from '@/lib/cart';
import { useCartProducts } from '@/lib/use-cart-products';

const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-NP')}`;

export default function CartClient() {
  const { products, unavailableIds, loading, error } = useCartProducts();
  const subtotal = products.reduce((total, line) => total + line.item.price * line.quantity, 0);

  if (loading) {
    return <p role="status" className="py-16 text-center text-muted-foreground">Loading cart…</p>;
  }

  if (error) {
    return <p role="alert" className="mt-8 rounded-xl bg-danger-bg p-4 text-sm text-danger">{error}</p>;
  }

  if (products.length === 0 && unavailableIds.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
        <h2 className="font-700 text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">Browse the menu and add something you like.</p>
        <Link href="/menu" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-600 text-primary-foreground">
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
      <section className="space-y-4" aria-label="Cart items">
        {unavailableIds.map((id) => (
          <div key={id} className="flex items-center justify-between gap-3 rounded-xl border border-warning/30 bg-warning-bg p-4">
            <p className="text-sm text-foreground">An item in your cart is no longer available. Remove it to continue.</p>
            <button type="button" onClick={() => updateCartItem(id, 0)} className="shrink-0 text-sm font-600 text-danger hover:underline">
              Remove
            </button>
          </div>
        ))}
        {products.map(({ item, quantity }) => (
          <article key={item.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              <AppImage src={item.image} alt={item.imageAlt} fill sizes="96px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-700 text-foreground">{item.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                </div>
                <p className="whitespace-nowrap text-sm font-700 text-primary">
                  {formatPrice(item.price * quantity)}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <label className="text-xs text-muted-foreground" htmlFor={`quantity-${item.id}`}>Qty</label>
                <select
                  id={`quantity-${item.id}`}
                  value={quantity}
                  onChange={(event) => updateCartItem(item.id, Number(event.target.value))}
                  className="rounded-lg border border-border bg-card px-2 py-1.5 text-sm text-foreground"
                >
                  {Array.from({ length: 20 }, (_, index) => index + 1).map((qty) => (
                    <option key={qty} value={qty}>{qty}</option>
                  ))}
                </select>
                <button type="button" onClick={() => updateCartItem(item.id, 0)} className="text-xs font-600 text-danger hover:underline">
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-700 text-foreground">Order summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-600 text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Delivery charges are shown during checkout.</p>
        <Link
          href="/checkout"
          aria-disabled={unavailableIds.length > 0 || products.length === 0}
          className={`mt-6 flex justify-center rounded-xl px-5 py-3 text-sm font-700 ${
            unavailableIds.length > 0 || products.length === 0
              ? 'pointer-events-none bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          Continue to checkout
        </Link>
      </aside>
    </div>
  );
}
