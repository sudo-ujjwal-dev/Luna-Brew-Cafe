import type { Metadata } from 'next';
import AdminLayout from '@/components/AdminLayout';
import GalleryManager from './GalleryManager';

export const metadata: Metadata = {
  title: 'Gallery management — Luna Brew Admin',
  robots: { index: false },
};

export default function AdminGalleryPage() {
  return (
    <AdminLayout title="Gallery" subtitle="Manage public gallery images and their display order">
      <GalleryManager />
    </AdminLayout>
  );
}
