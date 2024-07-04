import React from 'react';
import RatingStars from './RatingStars';

function RecipeHeader({ name, averageRating, onRate }) {
  return (
    <header className="recipe-header">
      <h2>{name}</h2>
      <div className="rating-container">
        <RatingStars rating={averageRating} onRate={onRate} />
        <p>דירוג ממוצע: {averageRating?.toFixed(1)}</p>
      </div>
    </header>
  );
}

export default RecipeHeader;
