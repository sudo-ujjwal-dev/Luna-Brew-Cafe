import type { Metadata } from 'next';
import AdminLayout from '@/components/AdminLayout';
import MenuManager from './MenuManager';

export const metadata: Metadata = {
  title: 'Menu management — Luna Brew Admin',
  robots: { index: false, follow: false },
};

export default function AdminMenuPage() {
  return (
    <AdminLayout
      title="Menu management"
      subtitle="Manage the menu and availability shown to customers"
    >
      <MenuManager />
    </AdminLayout>
  );
}
