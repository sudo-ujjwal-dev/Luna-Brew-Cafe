'use client';

import React from 'react';
import { Bell, Search, User } from 'lucide-react';

interface AdminTopbarProps {
  title?: string;
  subtitle?: string;
}

export default function AdminTopbar({ title, subtitle }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div>
        {title && (
          <h1 className="text-lg font-700 text-foreground leading-tight">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-input border border-border rounded-xl px-3 py-2 text-sm text-muted-foreground w-48 focus-within:w-64 transition-all duration-200 focus-within:border-primary/50">
          <Search size={14} className="flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-secondary hover:bg-muted flex items-center justify-center transition-colors">
          <Bell size={16} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <User size={14} className="text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-600 text-foreground leading-tight">Admin</p>
            <p className="text-xs text-muted-foreground">owner@lunabrewcafe.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}