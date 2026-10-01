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
  title: 'Luna Brew Café | Coffee & café food in Lakeside, Pokhara',
  alternates: { canonical: '/' },
  description:
    'Explore a fictional café concept for Lakeside, Pokhara, Nepal. Browse the sample menu, view the demo location, and learn about the Luna Brew Café portfolio project.',
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Restaurant',
            name: 'Luna Brew Café',
            description:
              'A fictional café portfolio concept for Lakeside, Pokhara, Nepal. Business details are illustrative.',
            servesCuisine: ['Nepalese', 'Coffee', 'Café food'],
            menu: '/menu',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Pokhara',
              addressRegion: 'Gandaki Province',
              addressCountry: 'NP',
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '07:30',
                closes: '20:00',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '08:00',
                closes: '21:00',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Sunday',
                opens: '08:00',
                closes: '19:00',
              },
            ],
          }),
        }}
      />
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
