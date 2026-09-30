'use client';

import React, { useState } from 'react';
import { Star, Check, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  submittedAt: string;
  status: ReviewStatus;
  item?: string;
}

// Backend integration point: replace with fetch('/api/admin/reviews?status=pending')
const initialReviews: Review[] = [
  {
    id: 'review-001',
    author: 'Thomas Bergmann',
    rating: 5,
    text: 'Absolutely the best espresso I\'ve had outside of Naples. The Luna Signature is extraordinary — I order it every morning before work.',
    submittedAt: '10:14 AM',
    status: 'pending',
    item: 'Luna Signature Espresso',
  },
  {
    id: 'review-002',
    author: 'Fatima Al-Rashid',
    rating: 4,
    text: 'Lovely café, great atmosphere. The matcha latte was very good. Only minor issue was the wait time on a Saturday morning, but totally understandable.',
    submittedAt: '11:42 AM',
    status: 'pending',
    item: 'Matcha Latte',
  },
  {
    id: 'review-003',
    author: 'Derek Huang',
    rating: 5,
    text: 'Took my partner here for brunch and we both loved every bite. The avocado toast is perfectly seasoned and the cold brew float is a revelation.',
    submittedAt: '12:58 PM',
    status: 'pending',
  },
  {
    id: 'review-004',
    author: 'Valentina Cruz',
    rating: 4,
    text: 'Consistently good coffee and friendly staff. Been coming for 6 months and haven\'t had a bad visit yet.',
    submittedAt: 'Sep 27',
    status: 'approved',
  },
  {
    id: 'review-005',
    author: 'Anonymous User',
    rating: 1,
    text: 'spam spam buy cheap coffee online',
    submittedAt: 'Sep 26',
    status: 'rejected',
  },
];

export default function ReviewQueue() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeTab, setActiveTab] = useState<ReviewStatus | 'all'>('pending');

  const updateReview = (id: string, newStatus: ReviewStatus) => {
    // Backend integration point: PATCH /api/admin/reviews/:id
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    toast.success(`Review ${newStatus}`);
  };

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const filtered = activeTab === 'all' ? reviews : reviews.filter((r) => r.status === activeTab);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={16} className="text-primary" />
          <h3 className="font-700 text-foreground text-base">Review Queue</h3>
          {pendingCount > 0 && (
            <span className="bg-danger-bg text-danger text-xs font-700 px-2 py-0.5 rounded-full">
              {pendingCount} new
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={`review-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-600 px-2.5 py-1.5 rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border max-h-[420px]">
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No reviews in this category</p>
          </div>
        ) : (
          filtered.map((review) => (
            <div key={review.id} className="px-5 py-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-700 text-sm text-foreground">{review.author}</p>
                  {review.item && (
                    <p className="text-xs text-accent font-500">{review.item}</p>
                  )}
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={`${review.id}-s-${s}`}
                      size={11}
                      className={s <= review.rating ? 'fill-accent text-accent' : 'text-muted'}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                {review.text}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/60 font-mono-data">{review.submittedAt}</span>

                <div className="flex items-center gap-1.5">
                  {review.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => updateReview(review.id, 'approved')}
                        className="flex items-center gap-1 text-xs font-600 px-2.5 py-1 rounded-lg bg-success-bg text-success hover:bg-success hover:text-white transition-all"
                      >
                        <Check size={11} />
                        Approve
                      </button>
                      <button
                        onClick={() => updateReview(review.id, 'rejected')}
                        className="flex items-center gap-1 text-xs font-600 px-2.5 py-1 rounded-lg bg-danger-bg text-danger hover:bg-danger hover:text-white transition-all"
                      >
                        <X size={11} />
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-600 px-2.5 py-1 rounded-full ${
                        review.status === 'approved' ? 'status-approved' : 'status-rejected'
                      }`}
                    >
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-5 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-600 text-foreground">{reviews.filter((r) => r.status === 'approved').length}</span> approved ·{' '}
          <span className="font-600 text-foreground">{pendingCount}</span> awaiting moderation
        </p>
      </div>
    </div>
  );
}