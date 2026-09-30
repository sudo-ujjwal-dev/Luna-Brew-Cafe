import React from 'react';
import type { Metadata } from 'next';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import HeroSection from './components/HeroSection';
import FeaturedMenuSection from './components/FeaturedMenuSection';
import AboutSection from './components/AboutSection';
import GalleryPreview from './components/GalleryPreview';
import ReviewsSection from './components/ReviewsSection';
import HoursLocationSection from './components/HoursLocationSection';
import BookingSection from './components/BookingSection';

export const metadata: Metadata = {
  title: 'Luna Brew Café — Good Coffee. Good Food. Good Moments.',
  description:
    'Specialty coffee, handcrafted food, and warm vibes at Luna Brew Café in Brooklyn, NY. Book a table or browse our menu today.',
};

export default function HomePage() {
  return (
    <>
      <PublicNav currentPath="/" />
      <main>
        <HeroSection />
        <FeaturedMenuSection />
        <AboutSection />
        <GalleryPreview />
        <ReviewsSection />
        <HoursLocationSection />
        <BookingSection />
      </main>
      <PublicFooter />
    </>
  );
}