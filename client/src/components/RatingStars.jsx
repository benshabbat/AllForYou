import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './RatingStars.module.css';

function RatingStars({ initialRating = 0, onRating }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleRating = (currentRating) => {
    setRating(currentRating);
    onRating(currentRating);
  };

  return (
    <div className={styles.ratingContainer}>
      {[...Array(5)].map((star, index) => {
        const currentRating = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={currentRating}
              onClick={() => handleRating(currentRating)}
              style={{ display: 'none' }}
              aria-label={`Rate ${currentRating} out of 5 stars`}
            />
            <span
              className={`${styles.star} ${currentRating <= (hover || rating) ? styles.filled : ''}`}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(0)}
              role="presentation"
            >
              ★
            </span>
          </label>
        );
      })}
      <div className={styles.rating} aria-live="polite">דירוג: {rating}/5</div>
    </div>
  );
}

RatingStars.propTypes = {
  initialRating: PropTypes.number,
  onRating: PropTypes.func.isRequired,
};

export default RatingStars;