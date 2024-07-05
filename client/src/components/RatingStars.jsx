import React from 'react';
import PropTypes from 'prop-types';
import styles from './RatingStars.module.css';

function RatingStars({ rating, onRating }) {
  return (
    <div className={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${star <= rating ? styles.filled : ''}`}
          onClick={() => onRating(star)}
          role="button"
          tabIndex={0}
          aria-label={`דרג ${star} מתוך 5 כוכבים`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

RatingStars.propTypes = {
  rating: PropTypes.number.isRequired,
  onRating: PropTypes.func.isRequired,
};

export default RatingStars;