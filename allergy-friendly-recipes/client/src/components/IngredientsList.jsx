import React from 'react';

function IngredientsList({ ingredients }) {
  return (
    <section className="ingredients-list">
      <h3>מצרכים:</h3>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </section>
  );
}

export default IngredientsList;