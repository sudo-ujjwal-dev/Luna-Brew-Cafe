'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export type AdminNotificationType =
  | 'NEW_ORDER'
  | 'NEW_RESERVATION'
  | 'NEW_REVIEW'
  | 'NEW_CONTACT_MESSAGE'
  | 'DELIVERY_ISSUE';

export type AdminUnreadCounts = Partial<Record<AdminNotificationType, number>>;

interface NotificationResponse {
  unreadCounts?: AdminUnreadCounts;
  error?: string;
}

interface AdminNotificationContextValue {
  unreadCounts: AdminUnreadCounts;
  markRead: (types: AdminNotificationType[]) => Promise<void>;
}

const AdminNotificationContext = createContext<AdminNotificationContextValue>({
  unreadCounts: {},
  markRead: async () => {},
});

export function useAdminUnreadCounts() {
  return useContext(AdminNotificationContext).unreadCounts;
}

export default function AdminNotificationState({ children }: { children: React.ReactNode }) {
  const [unreadCounts, setUnreadCounts] = useState<AdminUnreadCounts>({});
  const unreadCountsRef = useRef<AdminUnreadCounts>({});
  const lastMarkedPathRef = useRef<string | null>(null);
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        cache: 'no-store',
      });
      const result = (await response.json()) as NotificationResponse;
      if (!response.ok || !result.unreadCounts) {
        throw new Error(result.error || 'Unable to refresh admin notification counts.');
      }
      unreadCountsRef.current = result.unreadCounts;
      setUnreadCounts(result.unreadCounts);
      return true;
    } catch (error) {
      console.error('Admin sidebar notification refresh failed:', error);
      return false;
    }
  }, []);

  const markRead = useCallback(
    async (types: AdminNotificationType[]) => {
      const previousCounts = unreadCountsRef.current;
      const optimisticCounts = { ...previousCounts };
      for (const type of types) delete optimisticCounts[type];
      unreadCountsRef.current = optimisticCounts;
      setUnreadCounts((current) => {
        const next = { ...current };
        for (const type of types) delete next[type];
        return next;
      });
      try {
        const response = await fetch('/api/admin/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ readTypes: types }),
        });
        const result = (await response.json()) as NotificationResponse;
        if (!response.ok || !result.unreadCounts) {
          throw new Error(result.error || 'Unable to mark notifications as read.');
        }
        unreadCountsRef.current = result.unreadCounts;
        setUnreadCounts(result.unreadCounts);
      } catch (error) {
        console.error('Admin section notification read update failed:', error);
        const refreshed = await refresh();
        if (!refreshed) {
          const restoredCounts = { ...unreadCountsRef.current };
          for (const type of types) {
            const previousCount = previousCounts[type];
            if (previousCount === undefined) delete restoredCounts[type];
            else restoredCounts[type] = previousCount;
          }
          unreadCountsRef.current = restoredCounts;
          setUnreadCounts(restoredCounts);
        }
      }
    },
    [refresh]
  );

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 30_000);
    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', refreshOnFocus);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshOnFocus);
    };
  }, [refresh]);

  useEffect(() => {
    const types: AdminNotificationType[] =
      pathname === '/admin-dashboard/orders'
        ? ['NEW_ORDER', 'DELIVERY_ISSUE']
        : pathname === '/admin-dashboard/reservations'
          ? ['NEW_RESERVATION']
          : pathname === '/admin-dashboard/reviews'
            ? ['NEW_REVIEW']
            : pathname === '/admin-dashboard/messages'
              ? ['NEW_CONTACT_MESSAGE']
              : [];
    if (!types.length) {
      lastMarkedPathRef.current = null;
      return;
    }
    if (lastMarkedPathRef.current === pathname) return;
    lastMarkedPathRef.current = pathname;
    void markRead(types);
  }, [pathname, markRead]);

  return (
    <AdminNotificationContext.Provider value={{ unreadCounts, markRead }}>
      {children}
    </AdminNotificationContext.Provider>
  );
}
