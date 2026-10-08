'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Star } from 'lucide-react';

interface ApprovedReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ApprovedReview[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/reviews', { signal: controller.signal })
      .then(async (response) => {
        const result = (await response.json()) as {
          reviews?: ApprovedReview[];
          averageRating?: number | null;
          total?: number;
          error?: string;
        };
        if (!response.ok || !result.reviews) {
          throw new Error(result.error || 'Reviews are temporarily unavailable.');
        }
        setReviews(result.reviews);
        setAverageRating(result.averageRating ?? null);
        setTotal(result.total ?? 0);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(error instanceof Error ? error.message : 'Reviews are unavailable.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError('');
    setSubmitMessage('');
    setSubmitting(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.get('customerName'),
          rating: form.get('rating'),
          comment: form.get('comment'),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to submit your review.');
      formElement.reset();
      setSubmitMessage('Thank you. Your review is saved and will appear after moderation.');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your review.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-label mb-2">Reviews</p>
          <h2 className="text-display font-700 text-foreground">Guest Reviews</h2>
          {total > 0 && averageRating !== null && (
            <div
              className="mt-3 flex items-center justify-center gap-2"
              aria-label={`${averageRating.toFixed(1)} average rating from ${total} approved reviews`}
            >
              <Star size={16} className="fill-accent text-accent" />
              <span className="font-700 text-foreground">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">from {total} approved reviews</span>
            </div>
          )}
        </div>

        {loading ? (
          <div
            role="status"
            aria-label="Loading reviews"
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                aria-hidden="true"
                className="animate-pulse rounded-2xl border border-border bg-card p-6"
              >
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="mt-5 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-4/5 rounded bg-muted" />
                <div className="mt-6 h-4 w-28 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <p role="alert" className="py-8 text-center text-sm text-danger">
            {loadError}
          </p>
        ) : reviews.length === 0 ? (
          <p className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No approved reviews yet. Reviews submitted below remain private until moderated.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="bg-card rounded-2xl border border-border p-6 card-hover"
              >
                <div
                  className="flex items-center gap-1"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={`${review.id}-${index}`}
                      size={14}
                      className={index < review.rating ? 'fill-accent text-accent' : 'text-muted'}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
                <p className="mt-4 text-sm font-700 text-foreground">{review.customerName}</p>
                <time
                  className="mt-1 block text-xs text-muted-foreground"
                  dateTime={review.createdAt}
                >
                  {new Date(review.createdAt).toLocaleDateString('en-NP')}
                </time>
              </article>
            ))}
          </div>
        )}

        <form
          onSubmit={submitReview}
          className="mx-auto mt-10 grid max-w-2xl gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 sm:p-7"
        >
          <h3 className="sm:col-span-2 text-lg font-700 text-foreground">Leave a review</h3>
          <div>
            <label htmlFor="review-name" className="mb-1.5 block text-sm font-600 text-foreground">
              Your name
            </label>
            <input
              id="review-name"
              name="customerName"
              required
              minLength={2}
              maxLength={120}
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="review-rating"
              className="mb-1.5 block text-sm font-600 text-foreground"
            >
              Rating
            </label>
            <select
              id="review-rating"
              name="rating"
              required
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option value={rating} key={rating}>
                  {rating} {rating === 1 ? 'star' : 'stars'}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="review-comment"
              className="mb-1.5 block text-sm font-600 text-foreground"
            >
              Your review
            </label>
            <textarea
              id="review-comment"
              name="comment"
              required
              minLength={10}
              maxLength={3000}
              rows={4}
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm"
            />
          </div>
          {(submitError || submitMessage) && (
            <p
              role={submitError ? 'alert' : 'status'}
              className={`sm:col-span-2 text-sm ${submitError ? 'text-danger' : 'text-success'}`}
            >
              {submitError || submitMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="sm:col-span-2 rounded-xl bg-primary px-5 py-3 text-sm font-700 text-primary-foreground disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit for review'}
          </button>
        </form>
      </div>
    </section>
  );
}
