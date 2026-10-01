import React from 'react';
import type { Metadata } from 'next';
import AdminLayout from '@/components/AdminLayout';
import KPIBentoGrid from './components/KPIBentoGrid';

export const metadata: Metadata = {
  title: 'Dashboard — Luna Brew Admin',
  description: 'Luna Brew Café admin dashboard — operations overview',
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard" subtitle="Luna Brew Café operations">
      <div className="space-y-8">
        <div role="status" className="rounded-2xl border border-warning/30 bg-warning-bg p-5">
          <h2 className="font-700 text-foreground">Live business data is not connected</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This preview does not have a database configured. Orders, reservations, revenue, and
            reviews will appear here after the persistence layer is set up.
          </p>
        </div>
        <KPIBentoGrid />
      </div>
    </AdminLayout>
  );
}
