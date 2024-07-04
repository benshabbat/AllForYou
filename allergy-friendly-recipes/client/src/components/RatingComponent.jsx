import React from 'react';
import PropTypes from 'prop-types';
import { useApi } from '../hooks/useApi';
import { rateRecipe } from '../services/api';

function RatingComponent({ recipeId, currentRating, onRatingChange }) {
  const { execute: executeRating, loading } = useApi(rateRecipe);

  const handleRating = async (score) => {
    try {
      const result = await executeRating(recipeId, score);
      onRatingChange(result.averageRating);
    } catch (error) {
      console.error('Failed to rate recipe:', error);
    }
  };

  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRating(star)}
          style={{ cursor: 'pointer', color: star <= currentRating ? 'gold' : 'gray' }}
        >
          ★
        </span>
      ))}
      {loading && <span>מעדכן דירוג...</span>}
    </div>
  );
}

RatingComponent.propTypes = {
  recipeId: PropTypes.string.isRequired,
  currentRating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};

export default RatingComponent;