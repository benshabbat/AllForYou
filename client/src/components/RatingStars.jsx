import React from 'react';
import PropTypes from 'prop-types';
import styles from './RatingStars.module.css';

const RatingStars = ({ initialRating = 0, onRating, readOnly = false }) => {
  const rating = Number(initialRating);
  const displayRating = !isNaN(rating) ? rating.toFixed(1) : 'N/A';

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
              onClick={() => !readOnly && onRating && onRating(currentRating)}
              style={{ display: 'none' }}
              aria-label={`דרג ${currentRating} מתוך 5 כוכבים`}
              disabled={readOnly}
            />
            <span
              className={`${styles.star} ${currentRating <= rating ? styles.filled : ''} ${readOnly ? styles.readOnly : ''}`}
              role={readOnly ? "img" : "button"}
              aria-label={`${currentRating} כוכבים`}
            >
              ★
            </span>
          </label>
        );
      })}
      <div className={styles.rating} aria-live="polite">דירוג: {displayRating}/5</div>
    </div>
  );
};

RatingStars.propTypes = {
  initialRating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onRating: PropTypes.func,
  readOnly: PropTypes.bool
};

export default RatingStars;