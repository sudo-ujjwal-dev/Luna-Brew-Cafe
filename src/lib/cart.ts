'use client';

export interface CartLine {
  menuItemId: string;
  quantity: number;
}

const cartStorageKey = 'luna-brew-cart-v1';
const cartUpdatedEvent = 'luna-cart-updated';

export function readCart(): CartLine[] {
  try {
    const saved = localStorage.getItem(cartStorageKey);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (line): line is CartLine =>
        Boolean(line) &&
        typeof line === 'object' &&
        'menuItemId' in line &&
        typeof line.menuItemId === 'string' &&
        'quantity' in line &&
        typeof line.quantity === 'number' &&
        Number.isInteger(line.quantity) &&
        line.quantity >= 1 &&
        line.quantity <= 20
    );
  } catch {
    return [];
  }
}

function saveCart(lines: CartLine[]) {
  localStorage.setItem(cartStorageKey, JSON.stringify(lines));
  window.dispatchEvent(new Event(cartUpdatedEvent));
}

export function addItemToCart(menuItemId: string) {
  const lines = readCart();
  const existing = lines.find((line) => line.menuItemId === menuItemId);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + 1, 20);
  } else {
    lines.push({ menuItemId, quantity: 1 });
  }

  saveCart(lines);
}

export function updateCartItem(menuItemId: string, quantity: number) {
  const lines = readCart();
  if (quantity < 1) {
    saveCart(lines.filter((line) => line.menuItemId !== menuItemId));
    return;
  }
  saveCart(
    lines.map((line) =>
      line.menuItemId === menuItemId
        ? { ...line, quantity: Math.min(Math.floor(quantity), 20) }
        : line
    )
  );
}

export function clearCart() {
  saveCart([]);
}

export function subscribeToCart(listener: () => void) {
  window.addEventListener(cartUpdatedEvent, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(cartUpdatedEvent, listener);
    window.removeEventListener('storage', listener);
  };
}

export function cartItemCount(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.quantity, 0);
}
