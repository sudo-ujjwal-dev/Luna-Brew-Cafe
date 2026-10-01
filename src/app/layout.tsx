import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';
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
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: 'Luna Brew Café | Lakeside, Pokhara',
  description:
    'A fictional café website concept for Lakeside, Pokhara, Nepal. Explore sample café food, coffee, and business features.',
  keywords: ['cafe', 'coffee shop', 'restaurant', 'Luna Brew', 'Lakeside', 'Pokhara', 'Nepal'],
  openGraph: {
    title: 'Luna Brew Café',
    description: 'A fictional café concept for Lakeside, Pokhara, Nepal.',
    type: 'website',
    locale: 'en_NP',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dmMono.variable}`}>
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  );
}
