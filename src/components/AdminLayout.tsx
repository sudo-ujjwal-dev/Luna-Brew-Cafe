import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title={title} subtitle={subtitle} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
