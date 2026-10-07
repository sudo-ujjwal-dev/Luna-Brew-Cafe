'use client';

import { useEffect, useMemo, useState } from 'react';
import { readCart, subscribeToCart, type CartLine } from './cart';
import type { MenuItem } from './menu-types';

export function useCartProducts() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasCartItems = lines.length > 0;

  useEffect(() => {
    const sync = () => setLines(readCart());
    sync();
    return subscribeToCart(sync);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      if (!hasCartItems) {
        setMenuItems([]);
        setError('');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/menu', { signal: controller.signal });
        const result = (await response.json()) as { items?: MenuItem[]; error?: string };
        if (!response.ok || !result.items) {
          throw new Error(result.error || 'Menu data is unavailable.');
        }
        setMenuItems(result.items);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Menu data is temporarily unavailable.'
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadMenu();
    return () => controller.abort();
  }, [hasCartItems]);

  const products = useMemo(
    () =>
      lines.flatMap((line) => {
        const item = menuItems.find((candidate) => candidate.id === line.menuItemId);
        return item ? [{ ...line, item }] : [];
      }),
    [lines, menuItems]
  );
  const unavailableIds = lines
    .filter((line) => !menuItems.some((item) => item.id === line.menuItemId))
    .map((line) => line.menuItemId);
  return { lines, products, unavailableIds, loading, error };
}
