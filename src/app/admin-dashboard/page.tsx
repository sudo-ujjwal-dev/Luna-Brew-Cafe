import React from 'react';
import type { Metadata } from 'next';
import AdminLayout from '@/components/AdminLayout';
import KPIBentoGrid from './components/KPIBentoGrid';
import RevenueChart from './components/RevenueChart';
import ReservationsTable from './components/ReservationsTable';
import OrdersTable from './components/OrdersTable';
import ReviewQueue from './components/ReviewQueue';

export const metadata: Metadata = {
  title: 'Dashboard — Luna Brew Admin',
  description: 'Luna Brew Café admin dashboard — operations overview',
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Monday, September 28, 2026 · 1:45 PM"
    >
      <div className="space-y-8">
        <KPIBentoGrid />

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          <div className="xl:col-span-1">
            <ReviewQueue />
          </div>
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <ReservationsTable />
          <OrdersTable />
        </div>
      </div>
    </AdminLayout>
  );
}