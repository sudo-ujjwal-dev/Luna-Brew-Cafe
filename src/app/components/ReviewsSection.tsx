import React from 'react';
import Link from 'next/link';

export default function ReviewsSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-label mb-2">Reviews</p>
          <h2 className="text-display font-700 text-foreground">Guest Reviews</h2>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground leading-relaxed">
            This is a fictional café demo, so it has no real customer reviews or rating yet.
            Approved guest reviews can be shown here when review storage is configured.
          </p>
          <Link
            href="/#booking"
            className="mt-5 inline-flex text-sm font-600 text-primary hover:underline"
          >
            Ask about a visit
          </Link>
        </div>
      </div>
    </section>
  );
}
