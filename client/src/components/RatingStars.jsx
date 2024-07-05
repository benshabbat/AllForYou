import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './RatingStars.module.css';

function RatingStars({ initialRating, onRating }) {
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
            />
            <span
              className={`${styles.star} ${currentRating <= (hover || rating) ? styles.filled : ''}`}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          </label>
        );
      })}
      <div className={styles.rating}>דירוג: {rating}/5</div>
    </div>
  );
}

RatingStars.propTypes = {
  initialRating: PropTypes.number,
  onRating: PropTypes.func.isRequired,
};

RatingStars.defaultProps = {
  initialRating: 0,
};

export default RatingStars;