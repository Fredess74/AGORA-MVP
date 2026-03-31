/* ═══════════════════════════════════════════════════════════
   ReviewSection — Star ratings + user reviews
   ═══════════════════════════════════════════════════════════ */

import { useState, useCallback } from 'react';
import { getReviews, addReview, type Review } from '../lib/usageTracker';
import './PricingTiers.css'; // shared styles

interface Props {
    agentId: string;
    onReviewAdded?: () => void;
}

export default function ReviewSection({ agentId, onReviewAdded }: Props) {
    const [reviews, setReviews] = useState<Review[]>(() => getReviews(agentId));
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [authorName, setAuthorName] = useState('');

    const avgRating = reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const handleSubmit = useCallback(() => {
        if (rating === 0) return;
        addReview(agentId, rating, comment, authorName || undefined);
        setReviews(getReviews(agentId));
        setRating(0);
        setComment('');
        setAuthorName('');
        onReviewAdded?.();
    }, [agentId, rating, comment, authorName, onReviewAdded]);

    const stars = (count: number) => '⭐'.repeat(count) + '☆'.repeat(5 - count);

    return (
        <div className="review-section">
            <h3 className="review-section__title">
                ⭐ Reviews ({reviews.length}) {reviews.length > 0 && `· ${avgRating}/5`}
            </h3>

            {/* Write a review */}
            <div className="review-form">
                <div className="review-form__stars">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            className={`review-form__star ${star <= (hoverRating || rating) ? 'review-form__star--active' : ''}`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            ⭐
                        </button>
                    ))}
                    {rating > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>{rating}/5</span>}
                </div>
                <textarea
                    className="review-form__input"
                    placeholder="Share your experience with this agent..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <div className="review-form__row">
                    <input
                        className="review-form__name"
                        type="text"
                        placeholder="Your name (optional)"
                        value={authorName}
                        onChange={e => setAuthorName(e.target.value)}
                    />
                    <button
                        className="review-form__submit"
                        onClick={handleSubmit}
                        disabled={rating === 0}
                    >
                        Submit Review
                    </button>
                </div>
            </div>

            {/* Review list */}
            {reviews.length === 0 ? (
                <div className="review-empty">
                    No reviews yet. Be the first to review this agent!
                    <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        🔒 Verified reviews (linked to authenticated accounts) coming soon
                    </div>
                </div>
            ) : (
                <div className="review-list">
                    {[...reviews].reverse().map(review => (
                        <div key={review.id} className="review-item">
                            <div className="review-item__header">
                                <span className="review-item__author">{review.author}</span>
                                <span className="review-item__stars">{stars(review.rating)}</span>
                                <span className="review-item__date">
                                    {new Date(review.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            {review.comment && (
                                <p className="review-item__comment">{review.comment}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
