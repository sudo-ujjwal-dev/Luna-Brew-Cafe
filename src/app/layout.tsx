import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import '../styles/tailwind.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Luna Brew Café — Good Coffee. Good Food. Good Moments.',
  description:
    'Visit Luna Brew Café for specialty coffee, handcrafted meals, and a warm atmosphere. Browse our menu, book a table, or order online today.',
  keywords: ['cafe', 'coffee', 'restaurant', 'Luna Brew', 'specialty coffee', 'brunch'],
  openGraph: {
    title: 'Luna Brew Café',
    description: 'Good coffee. Good food. Good moments.',
    type: 'website',
    locale: 'en_US',
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dmMono.variable}`}>
      <body className={plusJakartaSans.className}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-sans)',
            },
          }}
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Flunabrewca5255back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.3" /></body>
    </html>
  );
}