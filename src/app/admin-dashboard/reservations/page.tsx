import type { Metadata } from 'next';
import AdminLayout from '@/components/AdminLayout';
import RecordManager from '../RecordManager';

export const metadata: Metadata = {
  title: 'Reservations — Luna Brew Admin',
  robots: { index: false },
};

export default function AdminReservationsPage() {
  return (
    <AdminLayout title="Reservations" subtitle="Review guest requests and update their status">
      <RecordManager kind="reservations" />
    </AdminLayout>
  );
}
