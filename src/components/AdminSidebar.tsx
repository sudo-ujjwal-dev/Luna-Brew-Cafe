'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Globe,
  UtensilsCrossed,
  ShoppingBag,
  CalendarDays,
  Star,
  MessageSquare,
  Images,
} from 'lucide-react';
import { useAdminUnreadCounts } from './AdminNotificationState';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin-dashboard', label: 'Dashboard', Icon: LayoutDashboard },
      {
        href: '/admin-dashboard/menu',
        label: 'Menu & categories',
        Icon: UtensilsCrossed,
      },
      { href: '/admin-dashboard/orders', label: 'Orders', Icon: ShoppingBag },
      {
        href: '/admin-dashboard/reservations',
        label: 'Reservations',
        Icon: CalendarDays,
      },
      { href: '/admin-dashboard/reviews', label: 'Reviews', Icon: Star },
      { href: '/admin-dashboard/messages', label: 'Messages', Icon: MessageSquare },
      { href: '/admin-dashboard/gallery', label: 'Gallery', Icon: Images },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const unreadCounts = useAdminUnreadCounts();

  return (
    <aside
      className={`flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out ${
        collapsed ? 'w-14 md:w-16' : 'w-14 md:w-60'
      } min-h-screen sticky top-0`}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-border transition-all duration-300 ${
          collapsed
            ? 'justify-center px-0 h-16'
            : 'justify-center gap-2.5 px-0 h-16 md:justify-start md:px-4'
        }`}
      >
        <AppLogo size={32} />
        {!collapsed && (
          <div className="hidden overflow-hidden md:block">
            <p className="font-bold text-sm text-foreground whitespace-nowrap">Luna Brew</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {navGroups?.map((group) => (
          <div key={`nav-group-${group?.label}`}>
            {!collapsed && (
              <p className="mb-2 hidden px-3 text-xs font-600 uppercase tracking-widest text-muted-foreground md:block">
                {group?.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group?.items?.map(({ href, label, Icon }) => {
                const isActive = pathname === href;
                const badgeCount =
                  href === '/admin-dashboard/orders'
                    ? (unreadCounts.NEW_ORDER ?? 0) + (unreadCounts.DELIVERY_ISSUE ?? 0)
                    : href === '/admin-dashboard/reservations'
                      ? (unreadCounts.NEW_RESERVATION ?? 0)
                      : href === '/admin-dashboard/reviews'
                        ? (unreadCounts.NEW_REVIEW ?? 0)
                        : href === '/admin-dashboard/messages'
                          ? (unreadCounts.NEW_CONTACT_MESSAGE ?? 0)
                          : 0;
                const badgeLabel = badgeCount > 99 ? '99+' : String(badgeCount);
                return (
                  <li key={`sidebar-${href}`}>
                    <Link
                      href={href}
                      aria-label={label}
                      title={label}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group relative ${
                        isActive
                          ? 'admin-sidebar-active'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <Icon
                        size={18}
                        className={`flex-shrink-0 sidebar-icon transition-colors ${
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      />
                      {!collapsed && (
                        <span className="hidden flex-1 whitespace-nowrap font-500 md:inline">
                          {label}
                        </span>
                      )}
                      {!collapsed && badgeCount > 0 && (
                        <span
                          aria-label={`${badgeCount} unread`}
                          className="min-w-5 rounded-full bg-accent px-1.5 py-0.5 text-center text-xs font-700 leading-none text-accent-foreground"
                        >
                          {badgeLabel}
                        </span>
                      )}
                      {collapsed && badgeCount > 0 && (
                        <span
                          aria-label={`${badgeCount} unread`}
                          className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border p-2 space-y-1">
        <Link
          href="/"
          title="View Website"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-150 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Globe size={18} className="flex-shrink-0" />
          {!collapsed && <span className="hidden font-500 md:inline">View Website</span>}
        </Link>
        <form action="/api/admin/logout" method="post">
          <button
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-danger hover:bg-danger-bg transition-all duration-150 w-full ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Sign Out"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="hidden font-500 md:inline">Sign Out</span>}
          </button>
        </form>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`hidden items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-150 w-full md:flex ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
