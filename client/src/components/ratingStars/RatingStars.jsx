import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './RatingStars.module.css';

/**
 * RatingStars component for displaying and setting ratings.
 * 
 * @param {Object} props
 * @param {number} props.initialRating - Initial rating value
 * @param {Function} props.onRating - Callback function when rating changes
 * @param {boolean} props.readOnly - Whether the rating is read-only
 */
const RatingStars = ({ initialRating = 0, onRating, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleRating = useCallback((currentRating) => {
    if (!readOnly) {
      setRating(currentRating);
      if (onRating) {
        onRating(currentRating);
      }
    }
  }, [readOnly, onRating]);

  const handleMouseEnter = useCallback((starRating) => {
    if (!readOnly) {
      setHover(starRating);
    }
  }, [readOnly]);

  const handleMouseLeave = useCallback(() => {
    if (!readOnly) {
      setHover(0);
    }
  }, [readOnly]);

  const starRating = useMemo(() => {
    return hover || rating;
  }, [hover, rating]);

  const displayRating = useMemo(() => {
    const ratingValue = Number(initialRating);
    return !isNaN(ratingValue) ? ratingValue.toFixed(1) : 'N/A';
  }, [initialRating]);

  return (
    <div className={styles.ratingContainer}>
      <div className={styles.starContainer} role="group" aria-label="דירוג כוכבים">
        {[...Array(5)].map((_, index) => {
          const currentRating = index + 1;
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={currentRating}
                onClick={() => handleRating(currentRating)}
                aria-label={`דרג ${currentRating} מתוך 5 כוכבים`}
                className={styles.radioInput}
                readOnly={readOnly}
              />
              <span
                className={`${styles.star} ${currentRating <= starRating ? styles.filled : ''} ${readOnly ? styles.readOnly : ''}`}
                onMouseEnter={() => handleMouseEnter(currentRating)}
                onMouseLeave={handleMouseLeave}
                role={readOnly ? "img" : "button"}
                aria-label={`${currentRating} כוכבים`}
              >
                ★
              </span>
            </label>
          );
        })}
      </div>
      <div className={styles.rating} aria-live="polite">דירוג: {displayRating}/5</div>
    </div>
  );
};

RatingStars.propTypes = {
  initialRating: PropTypes.number,
  onRating: PropTypes.func,
  readOnly: PropTypes.bool
};

export default React.memo(RatingStars);