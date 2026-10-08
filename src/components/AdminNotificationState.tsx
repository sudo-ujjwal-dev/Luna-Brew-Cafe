'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

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

const AdminNotificationContext = createContext<AdminUnreadCounts>({});

export function useAdminUnreadCounts() {
  return useContext(AdminNotificationContext);
}

export default function AdminNotificationState({ children }: { children: React.ReactNode }) {
  const [unreadCounts, setUnreadCounts] = useState<AdminUnreadCounts>({});

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        cache: 'no-store',
      });
      const result = (await response.json()) as NotificationResponse;
      if (!response.ok || !result.unreadCounts) {
        throw new Error(result.error || 'Unable to refresh admin notification counts.');
      }
      setUnreadCounts(result.unreadCounts);
    } catch (error) {
      console.error('Admin sidebar notification refresh failed:', error);
    }
  }, []);

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

  return (
    <AdminNotificationContext.Provider value={unreadCounts}>
      {children}
    </AdminNotificationContext.Provider>
  );
}
