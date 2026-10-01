import type { Metadata } from 'next';
import AdminLayout from '@/components/AdminLayout';
import RecordManager from '../RecordManager';

export const metadata: Metadata = { title: 'Orders — Luna Brew Admin', robots: { index: false } };

export default function AdminOrdersPage() {
  return (
    <AdminLayout title="Orders" subtitle="Review and update customer orders">
      <RecordManager kind="orders" />
    </AdminLayout>
  );
}
