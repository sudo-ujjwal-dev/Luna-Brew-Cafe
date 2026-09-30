import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 'rev-001',
    author: 'Priya Menon',
    role: 'Food Blogger',
    rating: 5,
    text: 'The Luna Signature Espresso is genuinely one of the best shots I\'ve had in Brooklyn. The baristas clearly know their craft — the crema was perfect, and the Ethiopian notes came through beautifully. This is my new Monday ritual.',
    date: 'September 2026',
    initials: 'PM',
    color: 'bg-primary/20 text-primary',
  },
  {
    id: 'rev-002',
    author: 'Marcus Delacroix',
    role: 'Regular Customer',
    rating: 5,
    text: 'I\'ve been coming here for two years and the consistency is remarkable. The avocado toast is always fresh, the staff remember my order, and the ambiance just hits differently on weekend mornings. Highly recommend the Cold Brew Float.',
    date: 'August 2026',
    initials: 'MD',
    color: 'bg-accent/20 text-accent-foreground',
  },
  {
    id: 'rev-003',
    author: 'Sofia Okafor',
    role: 'Neighborhood Local',
    rating: 4,
    text: 'Great vibe, genuinely good food, and the matcha latte is exceptional. Occasionally busy on weekends so booking ahead is smart. The lemon tart is a must-try — light, not too sweet, and the meringue is done perfectly.',
    date: 'September 2026',
    initials: 'SO',
    color: 'bg-success-bg text-success',
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-label mb-2">Reviews</p>
          <h2 className="text-display font-700 text-foreground">What Our Guests Say</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5]?.map((s) => (
                <Star key={`avg-star-${s}`} size={16} className="fill-accent text-accent" />
              ))}
            </div>
            <span className="text-foreground font-700 font-mono-data">4.9</span>
            <span className="text-muted-foreground text-sm">from 340+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews?.map((review) => (
            <article key={review?.id} className="bg-card rounded-2xl border border-border p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-700 text-sm ${review?.color}`}>
                    {review?.initials}
                  </div>
                  <div>
                    <p className="font-700 text-sm text-foreground">{review?.author}</p>
                    <p className="text-xs text-muted-foreground">{review?.role}</p>
                  </div>
                </div>
                <Quote size={20} className="text-muted/60 flex-shrink-0" />
              </div>

              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5]?.map((s) => (
                  <Star
                    key={`${review?.id}-star-${s}`}
                    size={13}
                    className={s <= review?.rating ? 'fill-accent text-accent' : 'text-muted'}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{review?.text}</p>

              <p className="text-xs text-muted-foreground/60 font-500">{review?.date}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}