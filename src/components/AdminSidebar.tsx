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

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin-dashboard', label: 'Dashboard', Icon: LayoutDashboard, badge: null },
      { href: '/admin-dashboard/menu', label: 'Menu & categories', Icon: UtensilsCrossed, badge: null },
      { href: '/admin-dashboard/orders', label: 'Orders', Icon: ShoppingBag, badge: null },
      { href: '/admin-dashboard/reservations', label: 'Reservations', Icon: CalendarDays, badge: null },
      { href: '/admin-dashboard/reviews', label: 'Reviews', Icon: Star, badge: null },
      { href: '/admin-dashboard/messages', label: 'Messages', Icon: MessageSquare, badge: null },
      { href: '/admin-dashboard/gallery', label: 'Gallery', Icon: Images, badge: null },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-60'
      } min-h-screen sticky top-0`}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-border transition-all duration-300 ${
          collapsed ? 'justify-center px-0 h-16' : 'gap-2.5 px-4 h-16'
        }`}
      >
        <AppLogo size={32} />
        {!collapsed && (
          <div className="overflow-hidden">
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
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-widest px-3 mb-2">
                {group?.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group?.items?.map(({ href, label, Icon, badge }) => {
                const isActive = pathname === href;
                return (
                  <li key={`sidebar-${href}`}>
                    <Link
                      href={href}
                      title={collapsed ? label : undefined}
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
                        <span className="flex-1 whitespace-nowrap font-500">{label}</span>
                      )}
                      {!collapsed && badge && (
                        <span className="bg-accent text-accent-foreground text-xs font-700 px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                          {badge}
                        </span>
                      )}
                      {collapsed && badge && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
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
          title={collapsed ? 'View Website' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-150 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Globe size={18} className="flex-shrink-0" />
          {!collapsed && <span className="font-500">View Website</span>}
        </Link>
        <form action="/api/admin/logout" method="post">
          <button
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-danger hover:bg-danger-bg transition-all duration-150 w-full ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="font-500">Sign Out</span>}
          </button>
        </form>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-150 w-full ${
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
