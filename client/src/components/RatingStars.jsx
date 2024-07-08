import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './RatingStars.module.css';

function RatingStars({ initialRating = 0, onRating, readOnly = false }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleRating = (currentRating) => {
    if (!readOnly) {
      setRating(currentRating);
      onRating(currentRating);
    }
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
              aria-label={`דרג ${currentRating} מתוך 5 כוכבים`}
              disabled={readOnly}
            />
            <span
              className={`${styles.star} ${currentRating <= (hover || rating) ? styles.filled : ''} ${readOnly ? styles.readOnly : ''}`}
              onMouseEnter={() => !readOnly && setHover(currentRating)}
              onMouseLeave={() => !readOnly && setHover(0)}
              role={readOnly ? "img" : "button"}
              aria-label={`${currentRating} כוכבים`}
            >
              ★
            </span>
          </label>
        );
      })}
      <div className={styles.rating} aria-live="polite">דירוג: {rating.toFixed(1)}/5</div>
    </div>
  );
}

RatingStars.propTypes = {
  initialRating: PropTypes.number,
  onRating: PropTypes.func,
  readOnly: PropTypes.bool
};

export default RatingStars;