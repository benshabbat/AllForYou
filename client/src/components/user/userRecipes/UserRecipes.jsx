import React from 'react';
import PropTypes from 'prop-types';
import RecipeCard from '../../recipe/recipeCard/RecipeCard';
import styles from './UserRecipes.module.css';

function UserRecipes({ recipes = [] }) {
  if (recipes.length === 0) {
    return <p className={styles.noRecipes}>עדיין לא הוספת מתכונים.</p>;
  }

  return (
    <div className={styles.userRecipes}>
      <h3 className={styles.title}>המתכונים שלי</h3>
      <div className={styles.recipeGrid}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

UserRecipes.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    // Add other recipe prop types as needed
  })),
};

export default UserRecipes;