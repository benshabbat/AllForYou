import React from 'react';

function RatingStars({ rating, onRate }) {
  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRate(star)}
          style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'gray' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingStars;