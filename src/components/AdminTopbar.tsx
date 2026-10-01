'use client';

import React from 'react';
import { LogOut } from 'lucide-react';

interface AdminTopbarProps {
  title?: string;
  subtitle?: string;
}

export default function AdminTopbar({ title, subtitle }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div>
        {title && <h1 className="text-lg font-700 text-foreground leading-tight">{title}</h1>}
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          Authorized administrator
        </span>
        <form action="/api/admin/logout" method="post">
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <LogOut size={15} />
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
