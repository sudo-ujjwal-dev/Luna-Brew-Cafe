import type { Metadata } from 'next';
import AdminLayout from '@/components/AdminLayout';
import RecordManager from '../RecordManager';

export const metadata: Metadata = { title: 'Contact messages — Luna Brew Admin', robots: { index: false } };

export default function AdminMessagesPage() {
  return (
    <AdminLayout title="Contact messages" subtitle="Read and resolve customer messages">
      <RecordManager kind="contact" />
    </AdminLayout>
  );
}
