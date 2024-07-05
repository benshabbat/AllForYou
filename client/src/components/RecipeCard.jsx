import React from 'react';
import { Link } from 'react-router-dom';
import { GiPeanut, GiMilkCarton, GiEgg, GiWheat } from 'react-icons/gi';
import styles from './RecipeCard.module.css';

const allergenIcons = {
  'בוטנים': GiPeanut,
  'חלב': GiMilkCarton,
  'ביצים': GiEgg,
  'גלוטן': GiWheat
};

function RecipeCard({ recipe }) {
  return (
    <div className={styles.recipeCard}>
      <img src={recipe.image} alt={recipe.name} className={styles.recipeImage} />
      <div className={styles.recipeContent}>
        <h3 className={styles.recipeTitle}>{recipe.name}</h3>
        <p className={styles.recipeDescription}>{recipe.description}</p>
        <div className={styles.allergenIcons}>
          {recipe.allergens.map(allergen => {
            const Icon = allergenIcons[allergen];
            return Icon ? <Icon key={allergen} className={styles.allergenIcon} title={allergen} /> : null;
          })}
        </div>
        <Link to={`/recipe/${recipe._id}`} className={styles.viewRecipeButton}>
          צפה במתכון
        </Link>
      </div>
    </div>
  );
}

export default RecipeCard;