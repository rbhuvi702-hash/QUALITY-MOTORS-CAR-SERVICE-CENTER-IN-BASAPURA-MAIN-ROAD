import React, { useState } from 'react';
import { Star, ShieldCheck, Plus, X, Check, Loader2 } from 'lucide-react';
import { ReviewItem } from '../types';
import { api } from '../services/api';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  onReviewAdded: (newReview: ReviewItem) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onReviewAdded }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [carModel, setCarModel] = useState('');
  const [service, setService] = useState('Comprehensive Periodic Car Maintenance');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      setError('Please provide your name and your feedback.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newRev = await api.createReview({
        author,
        rating,
        carModel: carModel.trim() || 'Verified Customer',
        service,
        text
      });

      onReviewAdded(newRev);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setModalOpen(false);
        setAuthor('');
        setCarModel('');
        setText('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Rating Scoreboard */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-semibold tracking-wider uppercase text-amber-400">
              Customer Experiences & Verification
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Verified Feedback from Bengaluru Drivers
            </h2>
            <p className="text-sm text-slate-400">
              Authentic reviews submitted by vehicle owners serviced at our Basapura Main Road workshop.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums">4.8</div>
              <div className="text-xs space-y-0.5">
                <div className="flex text-amber-400">
                  {'★'.repeat(5)}
                </div>
                <div className="text-slate-400 font-mono">38+ Google Reviews</div>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-3 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < rev.rating ? 'text-amber-400' : 'text-slate-700'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{rev.author}</span>
                  {rev.verified && (
                    <span title="Verified Customer">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{rev.carModel}</div>
                <div className="text-[10px] text-amber-400/80 line-clamp-1">{rev.service}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Share Your Workshop Experience</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-2 text-emerald-400">
                <Check className="w-10 h-10 mx-auto" />
                <div className="text-base font-bold text-white">Thank You!</div>
                <p className="text-xs text-slate-400">Your review has been verified and posted.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Murthy"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Honda City 1.5 i-VTEC"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-mono ${
                          rating >= num
                            ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        {num}★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the service quality, transparency, advisor communication, and turnaround time."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg flex items-center gap-1.5"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
