import type { Metadata } from 'next';
import AdminLoginForm from './AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin sign in — Luna Brew Café',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <p className="section-label mb-2">Luna Brew Café</p>
        <h1 className="text-2xl font-700 text-foreground">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This private area is for authorized café administrators.
        </p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
