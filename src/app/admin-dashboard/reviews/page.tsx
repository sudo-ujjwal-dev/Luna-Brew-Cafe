import type { Metadata } from 'next';
import AdminLayout from '@/components/AdminLayout';
import RecordManager from '../RecordManager';

export const metadata: Metadata = { title: 'Reviews — Luna Brew Admin', robots: { index: false } };

export default function AdminReviewsPage() {
  return (
    <AdminLayout title="Reviews" subtitle="Moderate guest-submitted reviews">
      <RecordManager kind="reviews" />
    </AdminLayout>
  );
}
